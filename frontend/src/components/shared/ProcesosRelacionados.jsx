import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCogs, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProcesosRelacionados = ({ 
  entidadTipo, 
  entidadId, 
  organizationId = 2,
  onUpdate 
}) => {
  const [procesos, setProcesos] = useState([]);
  const [procesosDisponibles, setProcesosDisponibles] = useState([]);
  const [tiposRelacion, setTiposRelacion] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProceso, setEditingProceso] = useState(null);
  const [formData, setFormData] = useState({
    proceso_id: '',
    tipo_relacion: 'involucra',
    descripcion: '',
    nivel_importancia: 'media',
    datos_adicionales: {}
  });

  // ===============================================
  // FUNCIONES DE CARGA DE DATOS
  // ===============================================

  const cargarProcesos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sgc/${entidadTipo}/${entidadId}/procesos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProcesos(data.data || []);
      } else {
        console.error('Error cargando procesos:', response.statusText);
      }
    } catch (error) {
      console.error('Error cargando procesos:', error);
      toast.error('Error al cargar los procesos relacionados');
    } finally {
      setLoading(false);
    }
  };

  const cargarProcesosDisponibles = async () => {
    try {
      const response = await fetch('/api/sgc/procesos/disponibles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProcesosDisponibles(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando procesos disponibles:', error);
    }
  };

  const cargarTiposRelacion = async () => {
    try {
      const response = await fetch('/api/sgc/procesos/tipos-relacion', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTiposRelacion(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando tipos de relación:', error);
    }
  };

  const cargarStats = async () => {
    try {
      const response = await fetch(`/api/sgc/${entidadTipo}/${entidadId}/procesos/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || {});
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  // ===============================================
  // FUNCIONES DE GESTIÓN
  // ===============================================

  const agregarProceso = async () => {
    try {
      const response = await fetch(`/api/sgc/${entidadTipo}/${entidadId}/procesos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Proceso relacionado agregado exitosamente');
        setShowModal(false);
        resetForm();
        await cargarProcesos();
        await cargarStats();
        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al agregar proceso');
      }
    } catch (error) {
      console.error('Error agregando proceso:', error);
      toast.error('Error al agregar proceso relacionado');
    }
  };

  const actualizarProceso = async () => {
    try {
      const response = await fetch(`/api/sgc/procesos/${editingProceso.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Proceso relacionado actualizado exitosamente');
        setShowModal(false);
        setEditingProceso(null);
        resetForm();
        await cargarProcesos();
        await cargarStats();
        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar proceso');
      }
    } catch (error) {
      console.error('Error actualizando proceso:', error);
      toast.error('Error al actualizar proceso relacionado');
    }
  };

  const eliminarProceso = async (procesoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este proceso relacionado?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sgc/procesos/${procesoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Proceso relacionado eliminado exitosamente');
        await cargarProcesos();
        await cargarStats();
        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar proceso');
      }
    } catch (error) {
      console.error('Error eliminando proceso:', error);
      toast.error('Error al eliminar proceso relacionado');
    }
  };

  // ===============================================
  // FUNCIONES AUXILIARES
  // ===============================================

  const resetForm = () => {
    setFormData({
      proceso_id: '',
      tipo_relacion: 'involucra',
      descripcion: '',
      nivel_importancia: 'media',
      datos_adicionales: {}
    });
  };

  const abrirModalEditar = (proceso) => {
    setEditingProceso(proceso);
    setFormData({
      proceso_id: proceso.proceso_id,
      tipo_relacion: proceso.tipo_relacion,
      descripcion: proceso.descripcion || '',
      nivel_importancia: proceso.nivel_importancia,
      datos_adicionales: proceso.datos_adicionales ? JSON.parse(proceso.datos_adicionales) : {}
    });
    setShowModal(true);
  };

  const abrirModalNuevo = () => {
    setEditingProceso(null);
    resetForm();
    setShowModal(true);
  };

  const getBadgeColor = (nivel) => {
    switch (nivel) {
      case 'alta': return 'danger';
      case 'media': return 'warning';
      case 'baja': return 'success';
      default: return 'secondary';
    }
  };

  const getTipoRelacionNombre = (tipo) => {
    const tipoObj = tiposRelacion.find(t => t.id === tipo);
    return tipoObj ? tipoObj.nombre : tipo;
  };

  // ===============================================
  // EFECTOS
  // ===============================================

  useEffect(() => {
    if (entidadTipo && entidadId) {
      cargarProcesos();
      cargarStats();
    }
  }, [entidadTipo, entidadId]);

  useEffect(() => {
    cargarProcesosDisponibles();
    cargarTiposRelacion();
  }, []);

  // ===============================================
  // RENDERIZADO
  // ===============================================

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {/* Header con estadísticas */}
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <FaCogs className="me-2" />
            Procesos Relacionados
          </h6>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={abrirModalNuevo}
          >
            <FaPlus className="me-1" />
            Agregar Proceso
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="row text-center">
            <div className="col">
              <h5>{stats.total_procesos || 0}</h5>
              <small className="text-muted">Total</small>
            </div>
            <div className="col">
              <h5 className="text-danger">{stats.alta_importancia || 0}</h5>
              <small className="text-muted">Alta Importancia</small>
            </div>
            <div className="col">
              <h5 className="text-warning">{stats.media_importancia || 0}</h5>
              <small className="text-muted">Media Importancia</small>
            </div>
            <div className="col">
              <h5 className="text-success">{stats.baja_importancia || 0}</h5>
              <small className="text-muted">Baja Importancia</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Lista de procesos */}
      {procesos.length === 0 ? (
        <Alert variant="info">
          <FaChartBar className="me-2" />
          No hay procesos relacionados. Agrega el primer proceso para comenzar.
        </Alert>
      ) : (
        <div className="row">
          {procesos.map((proceso) => (
            <div key={proceso.id} className="col-md-6 col-lg-4 mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{proceso.proceso_nombre}</h6>
                    <div>
                      <Badge bg={getBadgeColor(proceso.nivel_importancia)}>
                        {proceso.nivel_importancia}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="card-text small text-muted mb-2">
                    {proceso.proceso_descripcion}
                  </p>
                  
                  <div className="mb-2">
                    <Badge bg="info" className="me-1">
                      {getTipoRelacionNombre(proceso.tipo_relacion)}
                    </Badge>
                    <Badge bg="secondary">
                      {proceso.proceso_tipo}
                    </Badge>
                  </div>
                  
                  {proceso.descripcion && (
                    <p className="card-text small mb-2">
                      {proceso.descripcion}
                    </p>
                  )}
                  
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => abrirModalEditar(proceso)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarProceso(proceso.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProceso ? 'Editar Proceso Relacionado' : 'Agregar Proceso Relacionado'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Proceso *</Form.Label>
              <Form.Select
                value={formData.proceso_id}
                onChange={(e) => setFormData({...formData, proceso_id: e.target.value})}
                required
              >
                <option value="">Seleccionar proceso...</option>
                {procesosDisponibles.map((proceso) => (
                  <option key={proceso.id} value={proceso.id}>
                    {proceso.nombre} - {proceso.tipo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Relación *</Form.Label>
              <Form.Select
                value={formData.tipo_relacion}
                onChange={(e) => setFormData({...formData, tipo_relacion: e.target.value})}
              >
                {tiposRelacion.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre} - {tipo.descripcion}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nivel de Importancia</Form.Label>
              <Form.Select
                value={formData.nivel_importancia}
                onChange={(e) => setFormData({...formData, nivel_importancia: e.target.value})}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Describe la relación con este proceso..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={editingProceso ? actualizarProceso : agregarProceso}
            disabled={!formData.proceso_id}
          >
            {editingProceso ? 'Actualizar' : 'Agregar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProcesosRelacionados;
