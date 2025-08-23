import React, { useEffect, useState } from 'react';
import { FormConfig, FormField, ValidationError } from '../../types/forms';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

export interface GenericFormProps<T> {
    config: FormConfig<T>;
    onSubmit: (data: T) => void;
    onCancel?: () => void;
    onDelete?: (id: string | number) => void;
    isLoading?: boolean;
    errors?: ValidationError[];
    className?: string;
}

export function GenericForm<T extends Record<string, any>>({
    config,
    onSubmit,
    onCancel,
    onDelete,
    isLoading = false,
    errors = [],
    className = ''
}: GenericFormProps<T>) {
    const [formData, setFormData] = useState<T>(config.initialData as T || {} as T);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    // Actualizar errores cuando cambien
    useEffect(() => {
        setValidationErrors(errors);
    }, [errors]);

    // Actualizar datos cuando cambie la configuración inicial
    useEffect(() => {
        if (config.initialData) {
            setFormData(prev => ({ ...prev, ...config.initialData }));
        }
    }, [config.initialData]);

    const handleInputChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error de validación para este campo
        setValidationErrors(prev => prev.filter(error => error.field !== name));
    };

    const getFieldError = (fieldName: string): string | undefined => {
        return validationErrors.find(error => error.field === fieldName)?.message;
    };

    const validateField = (field: FormField, value: any): string | null => {
        if (field.required && (!value || value === '')) {
            return `${field.label} es requerido`;
        }

        if (field.validation) {
            const { min, max, pattern, custom } = field.validation;

            if (min !== undefined && value < min) {
                return `${field.label} debe ser mayor o igual a ${min}`;
            }

            if (max !== undefined && value > max) {
                return `${field.label} debe ser menor o igual a ${max}`;
            }

            if (pattern && !new RegExp(pattern).test(value)) {
                return `${field.label} no tiene el formato correcto`;
            }

            if (custom) {
                return custom(value);
            }
        }

        return null;
    };

    const validateForm = (): boolean => {
        const errors: ValidationError[] = [];

        config.fields.forEach(field => {
            if (!field.hidden) {
                const error = validateField(field, formData[field.name]);
                if (error) {
                    errors.push({ field: field.name, message: error });
                }
            }
        });

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const renderField = (field: FormField) => {
        if (field.hidden) return null;

        const value = formData[field.name];
        const error = getFieldError(field.name);
        const fieldId = `field-${field.name}`;

        const commonProps = {
            id: fieldId,
            name: field.name,
            value: value || '',
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleInputChange(field.name, e.target.value),
            placeholder: field.placeholder,
            disabled: field.disabled || isLoading,
            className: `w-full ${error ? 'border-red-500' : ''} ${field.className || ''}`,
        };

        const renderInput = () => {
            switch (field.type) {
                case 'textarea':
                    return (
                        <Textarea
                            {...commonProps}
                            rows={4}
                        />
                    );

                case 'select':
                    return (
                        <Select
                            value={value || ''}
                            onValueChange={(val) => handleInputChange(field.name, val)}
                            disabled={field.disabled || isLoading}
                        >
                            <SelectTrigger className={error ? 'border-red-500' : ''}>
                                <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );

                case 'checkbox':
                    return (
                        <Checkbox
                            id={fieldId}
                            checked={Boolean(value)}
                            onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                            disabled={field.disabled || isLoading}
                        />
                    );

                case 'date':
                case 'datetime':
                    return (
                        <Input
                            {...commonProps}
                            type={field.type}
                        />
                    );

                default:
                    return (
                        <Input
                            {...commonProps}
                            type={field.type}
                        />
                    );
            }
        };

        return (
            <div key={field.name} className="space-y-2">
                <Label htmlFor={fieldId} className={field.required ? 'required' : ''}>
                    {field.label}
                </Label>
                {renderInput()}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    };

    const renderFields = () => {
        if (config.layout === 'grid' && config.columns) {
            const columns = config.columns;
            const fieldsPerColumn = Math.ceil(config.fields.length / columns);

            return (
                <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
                    {Array.from({ length: columns }, (_, columnIndex) => (
                        <div key={columnIndex} className="space-y-4">
                            {config.fields
                                .slice(columnIndex * fieldsPerColumn, (columnIndex + 1) * fieldsPerColumn)
                                .map(renderField)}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {config.fields.map(renderField)}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            {renderFields()}

            <div className="flex gap-2 pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                >
                    {isLoading ? 'Guardando...' : config.submitButtonText || 'Guardar'}
                </Button>

                {config.showCancelButton && onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {config.cancelButtonText || 'Cancelar'}
                    </Button>
                )}

                {config.showDeleteButton && onDelete && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onDelete(formData.id || '')}
                        disabled={isLoading}
                    >
                        {config.deleteButtonText || 'Eliminar'}
                    </Button>
                )}
            </div>
        </form>
    );
}

export default GenericForm;
