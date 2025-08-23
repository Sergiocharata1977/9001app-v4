import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CoordinacionAgentesViewer from '../components/admin/CoordinacionAgentesViewer';
import LogTareasViewer from '../components/admin/LogTareasViewer';
import SuperAdminLayout from '../components/layout/SuperAdminLayout';
import AccessAudit from '../pages/SuperAdmin/AccessAudit';
import AgentCoordination from '../pages/SuperAdmin/AgentCoordination';
import AgentWorkflowDemo from '../pages/SuperAdmin/AgentWorkflowDemo';
import AutoPlannerIntegration from '../pages/SuperAdmin/AutoPlannerIntegration';
import BackupRestore from '../pages/SuperAdmin/BackupRestore';
import DatabaseSchema from '../pages/SuperAdmin/DatabaseSchema';
import FileStructure from '../pages/SuperAdmin/FileStructure';
import GlobalUsers from '../pages/SuperAdmin/GlobalUsers';
import MaintenanceMode from '../pages/SuperAdmin/MaintenanceMode';
import OrganizationsManagement from '../pages/SuperAdmin/OrganizationsManagement';
import PlansManagement from '../pages/SuperAdmin/PlansManagement';
import ProjectStructure from '../pages/SuperAdmin/ProjectStructure';
import RolesPermissions from '../pages/SuperAdmin/RolesPermissions';
import SuperAdminDashboard from '../pages/SuperAdmin/SuperAdminDashboard';
import SystemConfig from '../pages/SuperAdmin/SystemConfig';
import SystemFeatures from '../pages/SuperAdmin/SystemFeatures';
import SystemLogs from '../pages/SuperAdmin/SystemLogs';
import SystemMonitoring from '../pages/SuperAdmin/SystemMonitoring';
import SystemStats from '../pages/SuperAdmin/SystemStats';
import WorkflowStages from '../pages/SuperAdmin/WorkflowStages';

const SuperAdminRoutes = () => {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/stats" element={<SystemStats />} />
        <Route path="/monitoring" element={<SystemMonitoring />} />
        <Route path="/coordination" element={<AgentCoordination />} />
        <Route path="/coordinacion-documento" element={<CoordinacionAgentesViewer />} />
        <Route path="/log-tareas" element={<LogTareasViewer />} />
        <Route path="/workflow-demo" element={<AgentWorkflowDemo />} />
        <Route path="/workflow-stages" element={<WorkflowStages />} />
        <Route path="/auto-planner" element={<AutoPlannerIntegration />} />

        {/* Organizaciones */}
        <Route path="/organizations" element={<OrganizationsManagement />} />
        <Route path="/organizations/create" element={<OrganizationsManagement />} />
        <Route path="/plans" element={<PlansManagement />} />

        {/* Usuarios */}
        <Route path="/users" element={<GlobalUsers />} />
        <Route path="/roles" element={<RolesPermissions />} />
        <Route path="/audit" element={<AccessAudit />} />

        {/* Base de Datos */}
        <Route path="/database/schema" element={<DatabaseSchema />} />
        <Route path="/database/docs" element={<DatabaseSchema />} />
        <Route path="/database/backup" element={<BackupRestore />} />
        <Route path="/database/structure" element={<ProjectStructure />} />
        <Route path="/database/file-structure" element={<FileStructure />} />

        {/* Sistema */}
        <Route path="/config" element={<SystemConfig />} />
        <Route path="/features" element={<SystemFeatures />} />
        <Route path="/logs" element={<SystemLogs />} />
        <Route path="/maintenance" element={<MaintenanceMode />} />
      </Routes>
    </SuperAdminLayout>
  );
};

export default SuperAdminRoutes;
