import CRMDashboard from '@/components/crm/CRMDashboard';
import ClienteAgroSingle from '@/components/crm/ClienteAgroSingle';
import OportunidadAgroSingle from '@/components/crm/OportunidadAgroSingle';
import TestClientes from '@/components/crm/TestClientes';
import VendedoresListing from '@/components/crm/VendedoresListing';
import AnalisisRiesgoListing from '@/components/crm/AnalisisRiesgoListing';
import TestSimpleComponent from '@/components/TestSimpleComponent';
import CalidadMenu from '@/components/menu/CalidadMenu';
import MainMenuCards from '@/components/menu/MainMenuCards';
import ProcesosMenu from '@/components/menu/ProcesosMenu';
import RRHHMenu from '@/components/menu/RRHHMenu';
import CRMLayout from '@/layouts/CRMLayout';
import ActividadesAgroPage from '@/pages/CRM/ActividadesAgroPage';
import ClientesAgroPage from '@/pages/CRM/ClientesAgroPage';
import ContactosPage from '@/pages/CRM/ContactosPage';
import OportunidadesAgroPage from '@/pages/CRM/OportunidadesAgroPage';
import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import MenuCardsLayout from "../components/layout/MenuCardsLayout";
import SecondLevelLayout from "../components/layout/SecondLevelLayout";
import useAuthStore from "../store/authStore";
import ProtectedRoute, { OrganizationAdminRoute } from "./ProtectedRoute";

// Páginas de Acceso Directo Temporal
import AccessDirectoCRM from '../pages/AccessDirectoCRM';
import AccessDirectoCalidad from '../pages/AccessDirectoCalidad';
import AccessDirectoProcesos from '../pages/AccessDirectoProcesos';
import AccessDirectoRRHH from '../pages/AccessDirectoRRHH';
import DevBypass from '../pages/DevBypass';

// IMPORTACIÓN DIRECTA PARA DEPURACIÓN - TEMPORALMENTE DESHABILITADA
// import DocumentosListing from "../components/documentos/DocumentosListing";

// --- Componente de Carga ---
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
      <p className="text-white text-lg">Cargando componente...</p>
      <p className="text-gray-400 text-sm mt-2">Si esto tarda más de 10 segundos, hay un problema</p>
    </div>
  </div>
);

// --- Componentes Lazy Loaded ---

// Autenticación
const LoginPage = lazy(() => import("../pages/Registroylogeo/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Registroylogeo/RegisterPage"));

// Páginas Web (Landing)
const WebHome = lazy(() => import("../pages/Web/WebHome"));
const WebFeatures = lazy(() => import("../pages/Web/WebFeatures"));
const WebContact = lazy(() => import("../pages/Web/WebContact"));

// Documentación - IMPORTACIÓN DIRECTA PARA DEBUG
import DocumentacionHome from "../pages/Documentacion/DocumentacionHome";
import DocumentacionLayout from "../pages/Documentacion/DocumentacionLayout";
const CasosUsoPage = lazy(() => import("../pages/Documentacion/CasosUsoPage"));
const ManualUsuarioPage = lazy(() => import("../pages/Documentacion/funcional/ManualUsuarioPage"));
const SoportePage = lazy(() => import("../pages/Documentacion/funcional/SoportePage"));
const ArquitecturaPage = lazy(() => import("../pages/Documentacion/ArquitecturaPage"));
const BaseDatosPage = lazy(() => import("../pages/Documentacion/tecnica/BaseDatosPage"));
// const DesarrolloPage = lazy(() => import("../pages/Documentacion/tecnica/DesarrolloPage"));

// Menu Piramidal ISO 9001
const ProcesosISO = lazy(() => import("../pages/ProcesosISO"));
const AdministracionPage = lazy(() => import("../pages/Documentacion/tecnica/AdministracionPage"));
const ConfiguracionEntornos = lazy(() => import("../pages/Documentacion/ConfiguracionEntornos"));
const ApiDocsPage = lazy(() => import("../pages/Documentacion/ApiDocsPage"));
const GuiasPage = lazy(() => import("../pages/Documentacion/GuiasPage"));

// Páginas Principales (desde pages)
// const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage")); // COMENTADO PARA PRUEBAS
const CalendarPage = lazy(() => import("../pages/Calendar/CalendarPage"));

// Gestión de Calidad
const HallazgosPage = lazy(() => import("../pages/Hallazgos/HallazgosPage"));
const AccionesPage = lazy(() => import("../pages/Acciones/AccionesPage"));
const CapacitacionesPage = lazy(() => import("../pages/Capacitaciones/CapacitacionesPage"));
const MejorasPage = lazy(() => import("../pages/Mejoras/MejorasPage"));
const ComunicacionesPage = lazy(() => import("../pages/ComunicacionesPage"));
const MedicionesPage = lazy(() => import("../pages/MedicionesPage"));
const ConfiguracionPage = lazy(() => import("../pages/ConfiguracionPage"));
const PlanificacionDireccionPage = lazy(() => import("../pages/PlanificacionDireccionPage"));
const PlanificacionEstrategicaPage = lazy(() => import("../pages/PlanificacionEstrategicaPage"));
const RevisionDireccionPage = lazy(() => import("../pages/RevisionDireccionPage"));
const ObjetivosMetasPage = lazy(() => import("../pages/ObjetivosMetasPage"));
const MinutasPage = lazy(() => import("../pages/MinutasPage"));
const TratamientosPage = lazy(() => import("../pages/TratamientosPage"));
const VerificacionesPage = lazy(() => import("../pages/VerificacionesPage"));
const AMFEPage = lazy(() => import("../pages/AMFE/AMFEPage"));

// Gestión de Usuarios (desde pages)
const UsersPage = lazy(() => import("../pages/UsersPage"));
const UsuariosSingle = lazy(() => import("../pages/UsuariosSingle"));

// Administración
const OrganizationAdminPage = lazy(() => import("../pages/Admin/OrganizationAdminPage"));

// Super Admin
const SuperAdminLayout = lazy(() => import("../components/super-admin/SuperAdminLayout"));
const SuperAdminDashboard = lazy(() => import("../pages/SuperAdmin/SuperAdminDashboard"));
const SuperAdminOrganizations = lazy(() => import("../pages/SuperAdmin/OrganizationsManagement"));

// Componentes usados como páginas (desde components)
const DepartamentosPage = lazy(() => import("../components/departamentos/DepartamentosListing"));
const PuestosPage = lazy(() => import("../components/puestos/PuestosListing"));
const PersonalPage = lazy(() => import("../components/personal/PersonalListing"));
const PersonalSingle = lazy(() => import("../components/personal/PersonalSingle"));
const ProcesosPage = lazy(() => import("../components/procesos/ProcesosListing"));
const ProcesoSingle = lazy(() => import("../components/procesos/ProcesoSingle"));
const DocumentosPage = lazy(() => import("../components/documentos/DocumentosListing"));
const DocumentoSingle = lazy(() => import("../components/documentos/DocumentoSingle"));
const NormasPage = lazy(() => import("../components/normas/NormasList"));
const NormaSingleView = lazy(() => import("../components/normas/NormaSingleView"));
const ObjetivosCalidadPage = lazy(() => import("../components/procesos/ObjetivosListing"));
const IndicadoresPage = lazy(() => import("../components/procesos/IndicadoresListing"));
const IndicadorSingle = lazy(() => import("../components/procesos/IndicadorSingle"));

const ProductosPage = lazy(() => import("../components/productos/ProductosListing"));
// NUEVO: Componente con TypeScript y DataTable genérico
const ProductosListingNEW = lazy(() => import("../components/productos/ProductosListingNEW"));
const EncuestasPage = lazy(() => import("../components/encuestas/EncuestasListing"));
const ResponderEncuesta = lazy(() => import("../components/encuestas/ResponderEncuesta"));
const SatisfaccionClientePage = lazy(() => import("../pages/SatisfaccionClientePage"));
const TicketsPage = lazy(() => import("../components/tickets/TicketsListing"));

// Páginas de Planes
const PlanesPage = lazy(() => import("../components/planes/PlanesListing"));

// Programaciones de Evaluación de Competencias (Temporalmente deshabilitado)
// const EvalcompeProgramacionListing = lazy(() => import('../components/competencias/EvalcompeProgramacionListing'));
// const EvalcompeProgramacionSingle = lazy(() => import('../components/competencias/EvalcompeProgramacionSingle'));

// Competencias
const CompetenciasListing = lazy(() => import('../pages/Competencias/CompetenciasListing'));
const CompetenciaSingle = lazy(() => import('../pages/Competencias/CompetenciaSingle'));
const SGCHierarchyPage = lazy(() => import('../components/sgc/SGCHierarchyView'));

// Evaluaciones de Competencias Individuales
const EvaluacionesDashboard = lazy(() => import('../pages/EvaluacionCompetencias/EvaluacionesDashboardSimple'));
const EvaluacionesIndividualesList = lazy(() => import('../pages/EvaluacionCompetencias/EvaluacionesIndividualesList'));
const EvaluacionesIndividualesPage = lazy(() => import('../pages/EvaluacionCompetencias/EvaluacionesIndividualesPage'));

// Evaluaciones de Programas (Temporalmente deshabilitado)
// const ProgramacionCompetenciasList = lazy(() => import('../pages/Evaluaciones-programas/ProgramacionCompetenciasList'));
// const ProgramacionCompetenciasModal = lazy(() => import('../pages/Evaluaciones-programas/ProgramacionCompetenciasModal'));


// Base de Datos y Esquemas
const DatabaseSchemaPage = lazy(() => import("../pages/DatabaseSchemaPage"));

// Política de Calidad
const PoliticaCalidadPage = lazy(() => import("../pages/PoliticaCalidadPage"));


const AppRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  console.log('🛣️ AppRoutes - Renderizando, isAuthenticated:', isAuthenticated);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/encuestas/responder/:id" element={<ResponderEncuesta />} />

        {/* Rutas Web (Landing) */}
        <Route path="/" element={<WebHome />} />
        <Route path="/caracteristicas" element={<WebFeatures />} />
        <Route path="/contacto" element={<WebContact />} />

        {/* Rutas Protegidas de la aplicación (con /app prefix) */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  {/* Dashboard - COMENTADO PARA PRUEBAS */}
                  {/* <Route path="tablero" element={<DashboardPage />} /> */}

                  {/* Menú Principal de Tarjetas */}
                  <Route path="menu-cards" element={
                    <MenuCardsLayout>
                      <MainMenuCards />
                    </MenuCardsLayout>
                  } />

                  {/* Menús Especializados por Módulo */}
                  <Route path="calidad" element={
                    <SecondLevelLayout moduleType="calidad" onBackToMainMenu={() => navigate('/app/menu-cards')}>
                      <CalidadMenu onBackToMainMenu={() => navigate('/app/menu-cards')} />
                    </SecondLevelLayout>
                  } />
                  <Route path="rrhh" element={
                    <SecondLevelLayout moduleType="rrhh" onBackToMainMenu={() => navigate('/app/menu-cards')}>
                      <RRHHMenu onBackToMainMenu={() => navigate('/app/menu-cards')} />
                    </SecondLevelLayout>
                  } />
                  <Route path="procesos" element={
                    <SecondLevelLayout moduleType="procesos" onBackToMainMenu={() => navigate('/app/menu-cards')}>
                      <ProcesosMenu onBackToMainMenu={() => navigate('/app/menu-cards')} />
                    </SecondLevelLayout>
                  } />


                  {/* Páginas principales */}
                  <Route path="calendario" element={<CalendarPage />} />
                  <Route path="comunicaciones" element={<ComunicacionesPage />} />
                  <Route path="mediciones" element={<MedicionesPage />} />
                  <Route path="configuracion" element={<ConfiguracionPage />} />
                  <Route path="planificacion-revision" element={<PlanificacionDireccionPage />} />
                  <Route path="tratamientos" element={<TratamientosPage />} />
                  <Route path="verificaciones" element={<VerificacionesPage />} />

                  {/* Planificación y Revisión */}
                  <Route path="planificacion-estrategica" element={<PlanificacionEstrategicaPage />} />
                  <Route path="revision-direccion" element={<RevisionDireccionPage />} />
                  <Route path="objetivos-metas" element={<ObjetivosMetasPage />} />
                  <Route path="minutas" element={<MinutasPage />} />

                  {/* Recursos Humanos */}
                  <Route path="departamentos" element={<DepartamentosPage />} />
                  <Route path="puestos" element={<PuestosPage />} />
                  <Route path="personal/:id" element={<PersonalSingle />} />
                  <Route path="personal" element={<PersonalPage />} />

                  {/* Sistema de Gestión */}
                  <Route path="procesos" element={<ProcesosPage />} />
                  <Route path="procesos/:id" element={<ProcesoSingle />} />
                  <Route path="politica-calidad" element={<PoliticaCalidadPage />} />
                  <Route path="documentos" element={<DocumentosPage />} />
                  <Route path="documentos/:id" element={<DocumentoSingle />} />
                  <Route path="normas" element={<NormasPage />} />
                  <Route path="normas/:id" element={<NormaSingleView />} />
                  <Route path="objetivos-calidad" element={<ObjetivosCalidadPage />} />
                  <Route path="indicadores" element={<IndicadoresPage />} />
                  <Route path="indicadores/:id" element={<IndicadorSingle />} />

                  {/* AMFE */}
                  <Route path="amfe" element={<AMFEPage />} />

                  {/* Gestión de Calidad - Hallazgos y Mejoras */}
                  <Route path="hallazgos" element={<HallazgosPage />} />
                  <Route path="acciones" element={<AccionesPage />} />
                  <Route path="capacitaciones" element={<CapacitacionesPage />} />
                  <Route path="mejoras" element={<MejorasPage />} />

                  {/* Menu Piramidal ISO 9001 */}
                  <Route path="procesos-iso" element={<ProcesosISO />} />

                  {/* Otros */}
                  <Route path="productos" element={<ProductosPage />} />

                  {/* RUTA DE PRUEBA: Nuevo componente con TypeScript */}
                  <Route path="productos-test" element={<ProductosListingNEW />} />

                  <Route path="tickets" element={<TicketsPage />} />
                  <Route path="encuestas" element={<EncuestasPage />} />
                  <Route path="satisfaccion-cliente" element={<SatisfaccionClientePage />} />
                  {/* Rutas de Evaluación de Competencias (Temporalmente deshabilitado) */}
                  {/* <Route path="evalcompe-programacion" element={<EvalcompeProgramacionListing />} /> */}
                  {/* <Route path="evalcompe-programacion/:id" element={<EvalcompeProgramacionSingle />} /> */}
                  <Route path="competencias" element={<CompetenciasListing />} />
                  <Route path="competencias/:id" element={<CompetenciaSingle />} />

                  {/* Evaluaciones de Competencias Individuales */}
                  <Route path="evaluaciones-individuales" element={<EvaluacionesIndividualesPage />} />
                  <Route path="evaluaciones-individuales-list" element={<EvaluacionesIndividualesList />} />
                  <Route path="evaluaciones-dashboard" element={<EvaluacionesDashboard />} />

                  {/* Evaluaciones de Programas (Temporalmente deshabilitado) */}
                  {/* <Route path="evaluacion-competencias" element={<ProgramacionCompetenciasList />} /> */}
                  {/* <Route path="evaluacion-competencias-modal" element={<ProgramacionCompetenciasModal />} /> */}

                  {/* Administración */}
                  <Route path="usuarios" element={<UsersPage />} />
                  <Route path="usuarios-single" element={<UsuariosSingle />} />
                  <Route path="admin/organization" element={
                    <OrganizationAdminRoute>
                      <OrganizationAdminPage />
                    </OrganizationAdminRoute>
                  } />

                  {/* Documentación */}
                  <Route path="documentacion" element={<DocumentacionLayout />}>
                    <Route index element={<DocumentacionHome />} />
                    <Route path="casos-uso" element={<CasosUsoPage />} />
                    <Route path="manual-usuario" element={<ManualUsuarioPage />} />
                    <Route path="soporte" element={<SoportePage />} />
                    <Route path="arquitectura" element={<ArquitecturaPage />} />
                    <Route path="base-datos" element={<BaseDatosPage />} />
                    <Route path="administracion" element={<AdministracionPage />} />
                    <Route path="configuracion-entornos" element={<ConfiguracionEntornos />} />
                    <Route path="api" element={<ApiDocsPage />} />
                    <Route path="guias" element={<GuiasPage />} />
                  </Route>

                  {/* Base de Datos y Esquemas */}
                  {/* <Route path="database-schema" element={
                    <SuperAdminRoute>
                      <DatabaseSchemaPage />
                    </SuperAdminRoute>
                  } /> */}

                  {/* Prueba de renderizado */}
                  <Route path="test-simple" element={<TestSimpleComponent />} />

                  {/* Planes y Suscripciones */}
                  <Route path="planes" element={<PlanesPage />} />

                  {/* Jerarquía SGC */}
                  <Route path="sgc-hierarchy" element={<SGCHierarchyPage />} />



                  {/* Redirección por defecto dentro del layout */}
                  <Route path="/" element={<Navigate to="/app/menu-cards" replace />} />
                  <Route path="*" element={<Navigate to="/app/menu-cards" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* CRM - Gestión de Clientes (Layout independiente) */}
        <Route path="/app/crm/*" element={
          <ProtectedRoute>
            <CRMLayout>
              <Routes>
                <Route index element={<CRMDashboard />} />
                <Route path="contactos" element={<ContactosPage />} />
                <Route path="clientes" element={<ClientesAgroPage />} />
                <Route path="clientes/:id" element={<ClienteAgroSingle />} />
                <Route path="oportunidades" element={<OportunidadesAgroPage />} />
                <Route path="oportunidades/:id" element={<OportunidadAgroSingle />} />
                <Route path="actividades" element={<ActividadesAgroPage />} />
                <Route path="test-clientes" element={<TestClientes />} />
                <Route path="vendedores" element={<VendedoresListing />} />
                <Route path="satisfaccion" element={<SatisfaccionClientePage />} />
                <Route path="reportes" element={<CRMDashboard />} />
                <Route path="analytics" element={<CRMDashboard />} />
                <Route path="analisis-riesgo" element={<AnalisisRiesgoListing />} />
              </Routes>
            </CRMLayout>
          </ProtectedRoute>
        } />



        {/* Rutas Super Admin */}
        <Route path="/super-admin/*" element={
          <ProtectedRoute>
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="organizations" element={<SuperAdminOrganizations />} />
        </Route>

        {/* Rutas de Acceso Directo Temporal */}
        <Route path="/access-crm" element={<AccessDirectoCRM />} />
        <Route path="/access-rrhh" element={<AccessDirectoRRHH />} />
        <Route path="/access-procesos" element={<AccessDirectoProcesos />} />
        <Route path="/access-calidad" element={<AccessDirectoCalidad />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
