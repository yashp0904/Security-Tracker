export type UserRole = 'admin' | 'tester' | 'developer';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repositoryLink: string;
  techStack: string[];
  owner: string;
  assignedTesters: string[];
  createdAt: string;
  lastScanned?: string;
}

export interface Vulnerability {
  id: string;
  projectId: string;
  type: string;
  file: string;
  severity: SeverityLevel;
  description: string;
  suggestedFix: string;
  status: 'open' | 'in-progress' | 'fixed' | 'ignored';
  discoveredAt: string;
  discoveredBy: string;
}

export interface ScanResult {
  id: string;
  projectId: string;
  testerId: string;
  scanType: 'static' | 'dependency' | 'dynamic';
  status: 'pending' | 'running' | 'completed' | 'failed';
  vulnerabilities: string[];
  startedAt: string;
  completedAt?: string;
  riskScore: number;
}
