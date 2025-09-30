import { simpleHandoffScenario } from './simpleHandoff';
import { customerServiceRetailScenario } from './customerServiceRetail';
import { chatSupervisorScenario } from './chatSupervisor';
import { vendingScenario } from './vendingManager';
import type { RealtimeAgent } from '@openai/agents/realtime';
import { vendingScenarioV2 } from './v2';
import { vendingScenarioV3 } from './v3';
// Map of scenario key -> array of RealtimeAgent objects
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  // v3: vendingScenarioV3,
  // v2: vendingScenarioV2,
  v1 : vendingScenario,
  v2: vendingScenarioV2,
  v3: vendingScenarioV3,
};

export const defaultAgentSetKey = 'v1';
