"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidUuid } from "@/lib/utils";
import { Snippet, SnippetFormData, ActionResponse } from "@/types/snippet";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";
import { generateSnippetMetadata } from "@/lib/ai/gemini";

/**
 * Creates a new code snippet in the database.
 * Strictly derives the user_id from the authenticated Supabase session on the server.
 * Integrates Gemini AI generation for tags and summary with graceful fallback.
 */
export async function createSnippetAction(
  formData: SnippetFormData
): Promise<ActionResponse<Snippet>> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized. Please sign in to create snippets.",
      };
    }

    const title = formData.title?.trim();
    const codeContent = formData.code_content;
    const language = formData.language?.trim();

    // Field validations
    if (!title) {
      return { success: false, error: "Snippet title is required." };
    }
    if (title.length > 120) {
      return {
        success: false,
        error: "Title must be 120 characters or fewer.",
      };
    }
    if (!codeContent || !codeContent.trim()) {
      return { success: false, error: "Code content cannot be empty." };
    }
    if (!language) {
      return { success: false, error: "Programming language is required." };
    }

    // Fallback if language is outside predefined list
    const validLanguage = (SUPPORTED_LANGUAGES as readonly string[]).includes(
      language
    )
      ? language
      : "Other";

    // Attempt Gemini AI generation (gracefully fallback if fails)
    let aiTags: string[] = [];
    let aiSummary: string | null = null;

    try {
      const aiMetadata = await generateSnippetMetadata({
        title,
        codeContent,
        language: validLanguage,
      });

      if (aiMetadata) {
        aiTags = aiMetadata.tags;
        aiSummary = aiMetadata.summary;
      }
    } catch (aiErr) {
      // Never fail snippet creation if Gemini fails
      console.error(
        "[createSnippetAction] Gemini generation failed, using defaults:",
        aiErr instanceof Error ? aiErr.message : "Unknown error"
      );
    }

    // Insert snippet with authenticated user ID and AI metadata
    const { data, error } = await supabase
      .from("snippets")
      .insert({
        user_id: user.id, // Strictly server-derived
        title,
        code_content: codeContent,
        language: validLanguage,
        tags: aiTags,
        summary: aiSummary,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: "Failed to save snippet. Please check your data and try again.",
      };
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      data: data as Snippet,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred while saving the snippet.",
    };
  }
}

/**
 * Updates an existing snippet.
 * Verifies authenticated ownership using both user_id check and RLS.
 * Only regenerates Gemini metadata when title, code_content, or language changes.
 */
export async function updateSnippetAction(
  snippetId: string,
  formData: SnippetFormData
): Promise<ActionResponse<Snippet>> {
  try {
    if (!isValidUuid(snippetId)) {
      return { success: false, error: "Invalid snippet identifier." };
    }

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized. Please sign in to update snippets.",
      };
    }

    const title = formData.title?.trim();
    const codeContent = formData.code_content;
    const language = formData.language?.trim();

    if (!title) {
      return { success: false, error: "Snippet title is required." };
    }
    if (title.length > 120) {
      return {
        success: false,
        error: "Title must be 120 characters or fewer.",
      };
    }
    if (!codeContent || !codeContent.trim()) {
      return { success: false, error: "Code content cannot be empty." };
    }
    if (!language) {
      return { success: false, error: "Programming language is required." };
    }

    const validLanguage = (SUPPORTED_LANGUAGES as readonly string[]).includes(
      language
    )
      ? language
      : "Other";

    // Fetch existing snippet to detect changes and preserve existing metadata
    const { data: existingSnippet, error: fetchError } = await supabase
      .from("snippets")
      .select("id, title, code_content, language, tags, summary")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingSnippet) {
      return {
        success: false,
        error:
          "Snippet not found or you do not have permission to update this snippet.",
      };
    }

    // Check if any relevant field changed
    const contentChanged =
      existingSnippet.title !== title ||
      existingSnippet.code_content !== codeContent ||
      existingSnippet.language !== validLanguage;

    let updatedTags: string[] = existingSnippet.tags || [];
    let updatedSummary: string | null = existingSnippet.summary ?? null;

    if (contentChanged) {
      try {
        const aiMetadata = await generateSnippetMetadata({
          title,
          codeContent,
          language: validLanguage,
        });

        if (aiMetadata) {
          updatedTags = aiMetadata.tags;
          updatedSummary = aiMetadata.summary;
        }
      } catch (aiErr) {
        // If Gemini fails, preserve previous metadata without failing edit
        console.error(
          "[updateSnippetAction] Gemini regeneration failed, preserving previous metadata:",
          aiErr instanceof Error ? aiErr.message : "Unknown error"
        );
      }
    }

    // Update snippet matching both id and authenticated user_id
    const { data, error } = await supabase
      .from("snippets")
      .update({
        title,
        code_content: codeContent,
        language: validLanguage,
        tags: updatedTags,
        summary: updatedSummary,
      })
      .eq("id", snippetId)
      .eq("user_id", user.id) // Enforce ownership boundary
      .select()
      .single();

    if (error || !data) {
      return {
        success: false,
        error:
          "Snippet not found or you do not have permission to update this snippet.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/snippets/${snippetId}`);

    return {
      success: true,
      data: data as Snippet,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred while updating the snippet.",
    };
  }
}

/**
 * Regenerates Gemini AI metadata (tags and summary) for an existing snippet.
 * Verifies authenticated ownership on the server.
 */
export async function regenerateSnippetAiAction(
  snippetId: string
): Promise<ActionResponse<{ tags: string[]; summary: string | null }>> {
  try {
    if (!isValidUuid(snippetId)) {
      return { success: false, error: "Invalid snippet identifier." };
    }

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized. Please sign in to regenerate AI metadata.",
      };
    }

    // Verify snippet belongs to authenticated user
    const { data: snippet, error: fetchError } = await supabase
      .from("snippets")
      .select("id, title, code_content, language")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !snippet) {
      return {
        success: false,
        error:
          "Snippet not found or you do not have permission to modify this snippet.",
      };
    }

    // Regenerate tags and summary using current snippet content
    const aiMetadata = await generateSnippetMetadata({
      title: snippet.title,
      codeContent: snippet.code_content,
      language: snippet.language,
    });

    if (!aiMetadata) {
      return {
        success: false,
        error:
          "Unable to generate AI metadata at this time. Please try again later.",
      };
    }

    // Update only tags and summary
    const { data: updated, error: updateError } = await supabase
      .from("snippets")
      .update({
        tags: aiMetadata.tags,
        summary: aiMetadata.summary,
      })
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .select("tags, summary")
      .single();

    if (updateError || !updated) {
      return {
        success: false,
        error: "Failed to update snippet with generated AI metadata.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/snippets/${snippetId}`);

    return {
      success: true,
      data: {
        tags: updated.tags,
        summary: updated.summary,
      },
    };
  } catch (err) {
    console.error(
      "[regenerateSnippetAiAction] Error:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return {
      success: false,
      error: "An unexpected error occurred while regenerating AI metadata.",
    };
  }
}

/**
 * Deletes a snippet.
 * Verifies authenticated ownership using both user_id check and RLS.
 */
export async function deleteSnippetAction(
  snippetId: string
): Promise<ActionResponse<null>> {
  try {
    if (!isValidUuid(snippetId)) {
      return { success: false, error: "Invalid snippet identifier." };
    }

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized. Please sign in to delete snippets.",
      };
    }

    const { error, count } = await supabase
      .from("snippets")
      .delete({ count: "exact" })
      .eq("id", snippetId)
      .eq("user_id", user.id); // Enforce ownership boundary

    if (error) {
      return {
        success: false,
        error: "Failed to delete snippet. Please try again.",
      };
    }

    if (count === 0) {
      return {
        success: false,
        error:
          "Snippet not found or you do not have permission to delete this snippet.",
      };
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      data: null,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred while deleting the snippet.",
    };
  }
}
