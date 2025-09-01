import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, User, Download, Filter, Grid, List, ArrowLeft, Mail, Phone, MapPin, Calendar, Building, Award, CheckCircle, AlertCircle, Clock, Users, Eye, UserCheck, Plus } from 'lucide-react';
import { personalService } from '@/services/personalService';
import PersonalModal from './PersonalModal';
import PersonalTableView from './PersonalTableView';
import PersonalCard from './PersonalCard';
import UnifiedHeader from '../common/UnifiedHeader';
import UnifiedCard from '../common/UnifiedCard';
import UserInfoHeader from '../common/UserInfoHeader';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PersonalListSkeleton, HeaderSkeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/context/AuthContext';
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const PersonalListing = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.organization_id) {
      fetchPersonal();
    }
  }, [user]);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando personal para organization_id:', user?.organization_id);
      
      const data = await personalService.getAllPersonal();
      console.log('📡 Datos recibidos del servicio:', data);
      
      // Filtrar por organización si es necesario
      const validPersonal = Array.isArray(data) ? data.filter(person => 
        person.organization_id === user?.organization_id || !person.organization_id
      ) : [];
      
      console.log('✅ Personal filtrado:', validPersonal.length, 'registros');
      setPersonal(validPersonal);
    } catch (error) {
      console.error('❌ Error cargando personal:', error);
      setError(error.message);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "No se pudo cargar el personal." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (person = null) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  const handleSave = async (personData) => {
    try {
      setIsSaving(true);
      if (selectedPerson) {
        await personalService.updatePersonal(selectedPerson.id, {
          ...personData,
          organization_id: user?.organization_id
        });
        toast({ title: "Personal actualizado", description: "Los datos del personal han sido actualizados." });
      } else {
        await personalService.createPersonal({
          ...personData,
          organization_id: user?.organization_id
        });
        toast({ title: "Personal creado", description: "Se ha agregado un nuevo personal." });
      }
      await fetchPersonal();
      setIsModalOpen(false);
      setSelectedPerson(null);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message || "Ocurrió un error", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const person = personal.find(p => p.id === id);
    setPersonToDelete(person);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await personalService.deletePersonal(personToDelete.id);
      toast({ title: "Personal eliminado", description: "El personal ha sido eliminado." });
      await fetchPersonal();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message || "No se pudo eliminar el personal", 
        variant: "destructive" 
      });
    } finally {
      setDeleteDialogOpen(false);
      setPersonToDelete(null);
    }
  };

  const handleCardClick = (person) => {
    if (person && person.id) {
      navigate(`/app/personal/${person.id}`, { 
        state: { person: person } 
      });
    }
  };

  const filteredPersonal = personal.filter(person =>
    person.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderSkeleton />
        <div className="container mx-auto px-4 py-8">
          <PersonalListSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchPersonal} variant="outline">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Personal</h1>
            <p className="text-gray-600 mt-2">
              Administra el personal de tu organización
            </p>
          </div>
          <Button 
            onClick={() => handleOpenModal()} 
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Personal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Personal</p>
                  <p className="text-2xl font-bold text-gray-900">{personal.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {personal.filter(p => p.estado === 'Activo').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Departamentos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(personal.map(p => p.departamento_id).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Puestos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(personal.map(p => p.puesto_id).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar personal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredPersonal.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay personal registrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza agregando el primer miembro de tu equipo'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => handleOpenModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Personal
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}>
            {filteredPersonal.map((person) => (
              <PersonalCard
                key={person.id}
                person={person}
                onEdit={() => handleEdit(person)}
                onDelete={() => handleDelete(person.id)}
                onClick={() => handleCardClick(person)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <PersonalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        person={selectedPerson}
        isSaving={isSaving}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar personal?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el personal seleccionado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PersonalListing;
