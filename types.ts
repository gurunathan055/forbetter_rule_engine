
export enum Department {
  PROCUREMENT = 'Procurement',
  PRODUCTION = 'Production',
  WAREHOUSING = 'Warehousing',
  DISTRIBUTION = 'Distribution',
  SALES = 'Sales'
}

export enum RuleSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  MANAGER = 'manager',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  department: Department;
  condition: string;
  action: string;
  severity: RuleSeverity;
  isActive: boolean;
  createdAt: string;
}

export interface DataRecord {
  [key: string]: any;
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  isPassed: boolean;
  message: string;
  severity: RuleSeverity;
  department: Department;
}

export interface BatchProcessingResult {
  recordIndex: number;
  results: RuleEvaluationResult[];
  transformedData: DataRecord;
}

export interface DashboardMetrics {
  totalRules: number;
  criticalViolations: number;
  dataQualityScore: number;
  departmentHealth: Record<Department, number>;
}
