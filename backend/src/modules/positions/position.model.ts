export interface Position {
  id: string;
  title: string;
  description?: string;
  code: string;
  departmentId: string;
  organizationId: string;
  level: PositionLevel;
  requirements?: string[];
  responsibilities?: string[];
  competencies?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PositionLevel {
  EXECUTIVE = 'executive',
  MANAGER = 'manager',
  SUPERVISOR = 'supervisor',
  SPECIALIST = 'specialist',
  OPERATOR = 'operator',
  INTERN = 'intern'
}

export interface CreatePositionRequest {
  title: string;
  description?: string;
  code: string;
  departmentId: string;
  level: PositionLevel;
  requirements?: string[];
  responsibilities?: string[];
  competencies?: string[];
}