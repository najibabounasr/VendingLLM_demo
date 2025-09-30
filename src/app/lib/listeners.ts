/// LISTENER FOR PAYMENT PROCESSED:
// waitForProcessPayment.ts


// waitForProcessPayment.ts
export async function waitForProcessPayment(): Promise<any> {
  return new Promise((resolve) => {
    const handler = (event: any) => {
      const detail = event.detail || event;

      if (
        detail?.type === "conversation.item.created" &&
        detail.item?.type === "function_call_output" &&
        detail.item?.name === "process_payment" &&
        typeof detail.item?.output === "string"
      ) {
        window.removeEventListener("agent-event", handler);

        try {
          const output = JSON.parse(detail.item.output);
          resolve(output);
        } catch (e) {
          console.error("Failed to parse process_payment output", e);
          resolve(null);
        }
      }
    };

    window.addEventListener("agent-event", handler);
  });
}



















// export async function waitForProcessPayment(
//   sendEvent: (event: any) => void,
//   cartItems: any[]
// ): Promise<any> {
//   return new Promise((resolve) => {
//     const handler = (event: any) => {
//       const detail = event.detail || event;

//       if (detail.type === "response.text.done") {
//         window.removeEventListener("agent-event", handler);
//         clearInterval(interval);
//         resolve(detail); // or resolve(JSON.parse(detail.text)) if you want parsed items
//       }
//     };

//     window.addEventListener("agent-event", handler);

//     // keep firing until it gets through
//     const interval = setInterval(() => {
// sendEvent({
//   type: "response.create",
//   response: {
//     tool_choice: {
//       type: "function",
//       name: "process_payment"
//     }
//   }
// });
//     }, 2000);
//   });
// }

// KEY: There is NO documentation that tells us the format events should be in when using
// sendEvent(); this is extremely frustrating, literally trial-and-error. 
// BUT. THIS IS ATLEAST 'CLOSE' DOESNT SAY 'invalid param' but says 'missing param' = progress:
// ACTUALLY WORKS:
//   type: "response.create",
//   response: {
//     tool_choice: {
//       type: "function",
//       name: "process_payment",
//     },
//   },
// });
// WOrks worse:
// sendEvent({
//   type: "response.create",
//   response: {
//     tool_choice: {
//       type: "function",
//       function: {
//         name: "process_payment", // must match tool definition
//         arguments: JSON.stringify({
//           items: [{ id: "123", quantity: 1 }]
//         }),
//       },
//     },
//   },
// });

// /// more:

// sendEvent({
//   type: "conversation.item.created",
//   response: {
//     item: {
//       type: "function_call",
//       name: "process_payment"
//     }
//   }
// });

// LISTENER FOR SHOW PRICE