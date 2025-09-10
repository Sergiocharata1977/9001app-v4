export interface Personnel {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  positionId: string;
  departmentId: string;
  organizationId: string;
  hireDate: Date;
  status: PersonnelStatus;
  supervisor?: string; // ID del supervisor
  emergencyContact?: EmergencyContact;
  documents?: PersonnelDocument[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PersonnelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated'
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PersonnelDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadDate: Date;
  expiryDate?: Date;
}

export enum DocumentType {
  ID = 'id',
  CONTRACT = 'contract',
  CERTIFICATE = 'certificate',
  TRAINING = 'training',
  MEDICAL = 'medical',
  OTHER = 'other'
}