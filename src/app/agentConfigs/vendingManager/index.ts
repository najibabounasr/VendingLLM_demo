import { authenticationAgent } from './authentication';

// For now you only have one agent, no handoffs needed.
(authenticationAgent.handoffs as any).push(); // left empty until you add more agents

export const vendingScenario = [authenticationAgent];

// Name of the company/service represented by this agent set.
// Used by guardrails for context.
export const vendingCompanyName = "Farida";

export default vendingScenario;
