export type ModuleDefinitionCategory =
  | "academics"
  | "assessments"
  | "communication"
  | "finance"
  | "admissions"
  | "operations"
  | "ai"
  | "integration";

export type ModuleDefinition = {
  id: number;
  title: string;
  category: ModuleDefinitionCategory;
  summary: string;
  details: string;
};

export type InstitutionCapabilityLevel = "Basic" | "PRO" | "MASTER";

export type InstitutionCapabilityMap = {
  id: number;
  name: string;
  school: boolean;
  coaching: boolean;
  engineering: boolean;
  level: InstitutionCapabilityLevel;
};

export type DemoRequestPayload = {
  institutionName: string;
  orgType:
    | "engineering"
    | "school"
    | "junior_college"
    | "coaching"
    | "diploma"
    | "other";
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  state: string;
  city: string;
};

export type CheckoutPayload = {
  plan: "core" | "premium" | "enterprise";
  orgId: string;
  billingCycle: "monthly" | "yearly";
};
