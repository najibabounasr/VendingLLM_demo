// IMPORTS HERE
// Example vending machine inventory data
export const exampleMachineInfo = {
  machineId: "VM-001",
  location: "School of Engineering, Faculty Offices – Business-Ground Room 52, Western Wing",
  operator: "Farida",
  balanceSAR: 1000,
  maxSlotsPerProduct: 30,
  maxProducts: 10,
  status: "Active",
  lastRestockDate: "2025-09-20",
  nextInspectionDue: "2025-10-05",
};

// Products now come from lib/files.ts
// export const exampleProducts = // here

// Example restock policies or rules
export const exampleRestockPolicies = [
  {
    id: "R-001",
    name: "Low Stock Alert",
    topic: "restock trigger",
    content: "If stock of any product drops below 5 units, flag for urgent restock."
  },
  {
    id: "R-002",
    name: "Weekly Inspection Policy",
    topic: "inspection",
    content: "Machines must be inspected every 2 weeks to ensure cleanliness and functionality."
  },
  {
    id: "R-003",
    name: "Price Update Policy",
    topic: "pricing",
    content: "Prices can be updated monthly based on supplier costs and student demand surveys."
  }
];
