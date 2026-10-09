import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidUuid } from "@/lib/utils";
import { SnippetForm } from "@/components/snippets/snippet-form";
import { Snippet } from "@/types/snippet";

interface EditSnippetPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: "Edit Snippet | Developer Snippet Vault",
  description: "Modify your saved code snippet.",
};

export default async function EditSnippetPage({ params }: EditSnippetPageProps) {
  const { id } = params;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Security: Check UUID format before querying
  if (!isValidUuid(id)) {
    notFound();
  }

  // Security: Fetch only if owner
  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SnippetForm initialData={data as Snippet} mode="edit" />
    </div>
  );
}
