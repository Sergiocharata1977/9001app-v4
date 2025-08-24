import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import documentosService from '@/services/documentosService';
import {
    Download,
    File,
    Trash2,
    Upload
} from 'lucide-react';
import React, { useState } from 'react';

export interface Document {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    uploaded_at: string;
}

export interface DocumentUploaderProps {
    onDocumentUploaded?: (document: Document) => void;
    onDocumentDeleted?: (documentId: string) => void;
    existingDocuments?: Document[];
    maxFiles?: number;
    acceptedTypes?: string[];
    maxSizeMB?: number;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
    onDocumentUploaded,
    onDocumentDeleted,
    existingDocuments = [],
    maxFiles = 5,
    acceptedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'],
    maxSizeMB = 10
}) => {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const { toast } = useToast();

    const handleFileSelect = async (files: FileList) => {
        const fileArray = Array.from(files);

        if (existingDocuments.length + fileArray.length > maxFiles) {
            toast({
                title: "❌ Demasiados archivos",
                description: `Máximo ${maxFiles} archivos permitidos`,
                variant: "destructive",
            });
            return;
        }

        for (const file of fileArray) {
            // Validar tipo de archivo
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!acceptedTypes.includes(fileExtension || '')) {
                toast({
                    title: "❌ Tipo de archivo no válido",
                    description: `Solo se permiten: ${acceptedTypes.join(', ')}`,
                    variant: "destructive",
                });
                continue;
            }

            // Validar tamaño
            if (file.size > maxSizeMB * 1024 * 1024) {
                toast({
                    title: "❌ Archivo demasiado grande",
                    description: `Máximo ${maxSizeMB}MB por archivo`,
                    variant: "destructive",
                });
                continue;
            }

            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simular progreso
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            const response = await documentosService.uploadDocument(file, 'minuta');

            clearInterval(progressInterval);
            setUploadProgress(100);

            toast({
                title: "✅ Documento subido exitosamente",
                description: `${file.name} ha sido adjuntado`,
            });

            if (onDocumentUploaded) {
                onDocumentUploaded(response.data);
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            toast({
                title: "❌ Error al subir archivo",
                description: "No se pudo subir el archivo. Inténtalo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleDelete = async (documentId: string) => {
        try {
            await documentosService.deleteDocumento(parseInt(documentId));

            toast({
                title: "✅ Documento eliminado",
                description: "El documento ha sido eliminado exitosamente",
            });

            if (onDocumentDeleted) {
                onDocumentDeleted(documentId);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            toast({
                title: "❌ Error al eliminar",
                description: "No se pudo eliminar el documento",
                variant: "destructive",
            });
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <File className="h-4 w-4 text-red-500" />;
            case 'doc':
            case 'docx':
                return <File className="h-4 w-4 text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <File className="h-4 w-4 text-green-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <File className="h-4 w-4 text-purple-500" />;
            default:
                return <File className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Subir Documentos
                    <Badge variant="outline">{existingDocuments.length}/{maxFiles}</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Área de drop */}
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                        Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                        Tipos permitidos: {acceptedTypes.join(', ')} | Máximo: {maxSizeMB}MB por archivo
                    </p>

                    <Input
                        type="file"
                        multiple
                        accept={acceptedTypes.join(',')}
                        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                        className="hidden"
                        id="file-upload"
                    />
                    <Label htmlFor="file-upload" asChild>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            Seleccionar Archivos
                        </Button>
                    </Label>
                </div>

                {/* Progreso de carga */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Subiendo archivo...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Lista de documentos */}
                {existingDocuments.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Documentos adjuntos</h4>
                        <div className="space-y-2">
                            {existingDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(doc.name)}
                                        <div>
                                            <p className="text-sm font-medium">{doc.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(doc.size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(doc.url, '_blank')}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(doc.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DocumentUploader;
