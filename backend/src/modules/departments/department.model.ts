export interface Department {
  id: string;
  name: string;
  description?: string;
  code: string;
  organizationId: string;
  managerId?: string; // ID del jefe del departamento
  parentDepartmentId?: string; // Para jerarquías
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  code: string;
  managerId?: string;
  parentDepartmentId?: string;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {
  isActive?: boolean;
}