import { Database } from "./database";

export type Snippet = Database["public"]["Tables"]["snippets"]["Row"];
export type SnippetInsert = Database["public"]["Tables"]["snippets"]["Insert"];
export type SnippetUpdate = Database["public"]["Tables"]["snippets"]["Update"];

export interface SnippetFormData {
  title: string;
  code_content: string;
  language: string;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
