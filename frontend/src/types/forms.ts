// ========== TIPOS DE FORMULARIOS ==========

// Campo de formulario genérico
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'multiselect' | 'textarea' | 'date' | 'datetime' | 'checkbox' | 'radio' | 'file' | 'rich_text';
  required?: boolean;
  placeholder?: string;
  help_text?: string;
  validation?: FieldValidation;
  options?: FormOption[];
  depends_on?: string; // Campo del que depende
  depends_value?: any; // Valor requerido para mostrar
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  order: number;
}

// Opción para campos select/multiselect
export interface FormOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Validación de campo
export interface FieldValidation {
  required?: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  custom?: (value: any) => string | null; // Retorna mensaje de error o null si es válido
}

// Formulario completo
export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  submit_button_text?: string;
  cancel_button_text?: string;
  success_message?: string;
  error_message?: string;
  redirect_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Estado del formulario
export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// ========== TIPOS DE VALIDACIÓN ==========

// Esquema de validación
export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

// Regla de validación
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  condition?: (values: Record<string, any>) => boolean;
}

// Resultado de validación
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ========== TIPOS DE FORMULARIOS ESPECÍFICOS ==========

// Formulario de login
export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

// Formulario de registro
export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}

// Formulario de perfil de usuario
export interface UserProfileForm {
  name: string;
  last_name?: string;
  email: string;
  phone?: string;
  avatar?: File;
  position?: string;
  department_id?: string;
}

// Formulario de cambio de contraseña
export interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Formulario de organización
export interface OrganizationForm {
  name: string;
  legal_name: string;
  tax_id?: string;
  address: AddressForm;
  contact_info: ContactInfoForm;
  industry?: string;
  size?: 'small' | 'medium' | 'large';
}

// Formulario de dirección
export interface AddressForm {
  street: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

// Formulario de información de contacto
export interface ContactInfoForm {
  email: string;
  phone?: string;
  website?: string;
}

// Formulario de auditoría
export interface AuditForm {
  title: string;
  description?: string;
  type: 'internal' | 'external' | 'supplier' | 'certification';
  scope: string;
  objectives: string[];
  criteria: string[];
  start_date: string;
  end_date: string;
  lead_auditor_id: string;
  team_member_ids: string[];
  auditee_id: string;
  department_id?: string;
}

// Formulario de hallazgo
export interface FindingForm {
  title: string;
  description: string;
  type: 'non_conformity' | 'observation' | 'opportunity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  clause?: string;
  requirement?: string;
  evidence?: string;
  responsible_id?: string;
  due_date?: string;
}

// Formulario de acción correctiva/preventiva
export interface ActionForm {
  title: string;
  description: string;
  type: 'corrective' | 'preventive' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source_type: 'audit' | 'complaint' | 'incident' | 'review' | 'other';
  source_id?: string;
  responsible_id: string;
  assigned_to_id?: string;
  department_id?: string;
  due_date?: string;
  cost?: number;
}

// Formulario de documento
export interface DocumentForm {
  title: string;
  description?: string;
  type: 'policy' | 'procedure' | 'work_instruction' | 'form' | 'record' | 'manual';
  category: string;
  version: string;
  keywords: string[];
  effective_date?: string;
  review_date?: string;
  file: File;
  related_document_ids: string[];
}

// Formulario de proceso
export interface ProcessForm {
  name: string;
  description: string;
  type: 'core' | 'support' | 'management';
  owner_id: string;
  department_id?: string;
  inputs: string[];
  outputs: string[];
}

// Formulario de capacitación
export interface TrainingForm {
  title: string;
  description: string;
  type: 'internal' | 'external' | 'online' | 'workshop';
  category: string;
  duration: number;
  provider?: string;
  instructor_id?: string;
  objectives: string[];
  requirements?: string[];
  max_participants?: number;
  cost?: number;
}

// Formulario de encuesta
export interface SurveyForm {
  title: string;
  description: string;
  type: 'satisfaction' | 'feedback' | 'assessment' | 'research';
  target_audience: string[];
  anonymous: boolean;
  allow_multiple_responses: boolean;
  start_date?: string;
  end_date?: string;
  questions: SurveyQuestionForm[];
}

// Formulario de pregunta de encuesta
export interface SurveyQuestionForm {
  text: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'rating' | 'boolean';
  required: boolean;
  options?: string[];
  min_value?: number;
  max_value?: number;
  order: number;
}

// ========== TIPOS DE WIZARD/MULTI-STEP FORMS ==========

// Paso de wizard
export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: ValidationSchema;
  is_completed: boolean;
  is_required: boolean;
  order: number;
}

// Wizard completo
export interface Wizard {
  id: string;
  name: string;
  description?: string;
  steps: WizardStep[];
  current_step: number;
  is_completed: boolean;
  allow_back: boolean;
  allow_skip: boolean;
  show_progress: boolean;
}

// Estado del wizard
export interface WizardState {
  current_step: number;
  completed_steps: Set<number>;
  form_data: Record<string, any>;
  errors: Record<string, string>;
  is_submitting: boolean;
}

// ========== TIPOS DE FORMULARIOS DINÁMICOS ==========

// Campo dinámico
export interface DynamicField extends FormField {
  dynamic_options?: (formData: Record<string, any>) => FormOption[];
  dynamic_validation?: (formData: Record<string, any>) => FieldValidation;
  dynamic_visibility?: (formData: Record<string, any>) => boolean;
}

// Formulario dinámico
export interface DynamicForm extends Form {
  fields: DynamicField[];
  dynamic_logic?: DynamicLogic[];
}

// Lógica dinámica
export interface DynamicLogic {
  trigger_field: string;
  trigger_value: any;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'set_value' | 'clear_value';
  target_field: string;
  target_value?: any;
}

// ========== TIPOS DE FORMULARIOS DE BÚSQUEDA ==========

// Campo de búsqueda
export interface SearchField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date_range' | 'number_range' | 'boolean';
  placeholder?: string;
  options?: FormOption[];
  default_value?: any;
  operator?: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
}

// Formulario de búsqueda
export interface SearchForm {
  fields: SearchField[];
  default_sort?: string;
  default_order?: 'asc' | 'desc';
  page_size?: number;
  allow_export?: boolean;
  allow_save_search?: boolean;
}

// Parámetros de búsqueda
export interface SearchParams {
  search?: string;
  filters: Record<string, any>;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// ========== TIPOS DE FORMULARIOS DE IMPORTACIÓN ==========

// Campo de mapeo de importación
export interface ImportMappingField {
  source_column: string;
  target_field: string;
  required: boolean;
  data_type: 'string' | 'number' | 'date' | 'boolean' | 'email';
  transformation?: (value: any) => any;
  validation?: FieldValidation;
}

// Formulario de importación
export interface ImportForm {
  file: File;
  mapping: ImportMappingField[];
  options: {
    skip_header: boolean;
    update_existing: boolean;
    create_missing: boolean;
    validate_only: boolean;
  };
}

// Resultado de importación
export interface ImportResult {
  total_rows: number;
  imported_rows: number;
  skipped_rows: number;
  error_rows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
}

// Error de importación
export interface ImportError {
  row: number;
  column: string;
  value: any;
  message: string;
}

// Advertencia de importación
export interface ImportWarning {
  row: number;
  column: string;
  value: any;
  message: string;
}
