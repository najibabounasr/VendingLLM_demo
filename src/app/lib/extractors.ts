export function extractLineItemsFromAgentEvent(event: any) {
  const detail = event.detail || event;

  if (
    detail.type === "conversation.item.created" &&
    detail.item?.type === "function_call_output" &&
    detail.item?.object === "realtime.item" &&
    typeof detail.item?.output === "string"
  ) {
    try {
      const parsed = JSON.parse(detail.item.output);
      if (Array.isArray(parsed.line_items)) {
        return parsed.line_items;
      }
    } catch {
      // ignore
    }
  }

  return null;
}