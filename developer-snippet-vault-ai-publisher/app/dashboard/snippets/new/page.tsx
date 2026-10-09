import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SnippetForm } from "@/components/snippets/snippet-form";

export const metadata = {
  title: "New Snippet | Developer Snippet Vault",
  description: "Create and store a new code snippet in your vault.",
};

export default async function NewSnippetPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SnippetForm mode="create" />
    </div>
  );
}
