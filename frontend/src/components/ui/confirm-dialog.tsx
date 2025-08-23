import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

/**
 * Componente de diálogo de confirmación con estilo Navy/Teal
 * 
 * @param props - Propiedades del componente
 * @param props.isOpen - Controla si el diálogo está abierto
 * @param props.onClose - Función para cerrar el diálogo
 * @param props.onConfirm - Función a ejecutar cuando se confirma la acción
 * @param props.title - Título del diálogo
 * @param props.message - Mensaje de confirmación
 * @param props.confirmText - Texto del botón de confirmación
 * @param props.cancelText - Texto del botón de cancelación
 * @param props.isDestructive - Si la acción es destructiva (rojo)
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro que deseas realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${isDestructive ? 'text-red-500' : 'text-amber-500'}`} />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-slate-300">{message}</p>
        </div>
        
        <DialogFooter className="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          >
            {cancelText}
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm}
            className={isDestructive 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-teal-600 hover:bg-teal-700 text-white"
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
