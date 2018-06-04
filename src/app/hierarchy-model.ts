export interface Step {
  id: number;
  name: string;
}

export interface Scenario {
  id: number;
  name: string;
  steps: Step[];
}

export interface Functionality {
  id: number;
  name: string;
  scenarios: Scenario[];
}

export interface TestPlan {
  id: number;
  name: string;
  functionalities: Functionality[];
}

export interface HierarchyModel {
  id: number;
  name: string;
  testPlans: TestPlan[];
}
