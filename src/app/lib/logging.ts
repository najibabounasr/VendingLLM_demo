import { supabaseClient } from "@/app/lib/supabaseClient";
import { currentConversationId } from "@/app/lib/conversation";


type Kind =
  | "restock"
  | "preference"
  | "complaint"
  | "bug"
  | "pricing"
  | "lost_sale"
  | "note";

export async function saveFeedbackToDB(opts: {
  message: string;
  tags?: string[];
  role?: "user" | "agent" | "system";
  kind?: Kind;
  extra?: Record<string, any>;
}) {
  const {
    message,
    tags = [],
    role = "agent",
    kind,
    extra = {},
  } = opts;

  // pick kind: explicit > first tag > 'note'
  const candidate = (kind ?? tags[0]?.toLowerCase() ?? "note") as Kind;
  const allowed: Kind[] = [
    "restock",
    "preference",
    "complaint",
    "bug",
    "pricing",
    "lost_sale",
    "note",
  ];
  const finalKind: Kind = allowed.includes(candidate) ? candidate : "note";

  const { data, error } = await supabaseClient
    .from("signals")
    .insert({
      conversation_id: currentConversationId,
      role,
      kind: finalKind,
      payload: { message, tags, ...extra },
    })
    .select()
    .single();

  if (error) throw error;
  return data; // row from signals
}