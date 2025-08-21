import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminLayout from '../components/layout/SuperAdminLayout';
import SuperAdminDashboard from '../pages/SuperAdmin/SuperAdminDashboard';
import OrganizationsManagement from '../pages/SuperAdmin/OrganizationsManagement';
import GlobalUsers from '../pages/SuperAdmin/GlobalUsers';
import SystemFeatures from '../pages/SuperAdmin/SystemFeatures';
import DatabaseSchema from '../pages/SuperAdmin/DatabaseSchema';
import SystemStats from '../pages/SuperAdmin/SystemStats';
import SystemMonitoring from '../pages/SuperAdmin/SystemMonitoring';
import AgentCoordination from '../pages/SuperAdmin/AgentCoordination';
import AgentWorkflowDemo from '../pages/SuperAdmin/AgentWorkflowDemo';
import WorkflowStages from '../pages/SuperAdmin/WorkflowStages';
import AutoPlannerIntegration from '../pages/SuperAdmin/AutoPlannerIntegration';
import CoordinacionAgentesViewer from '../components/admin/CoordinacionAgentesViewer';
import SystemConfig from '../pages/SuperAdmin/SystemConfig';
import SystemLogs from '../pages/SuperAdmin/SystemLogs';
import BackupRestore from '../pages/SuperAdmin/BackupRestore';
import RolesPermissions from '../pages/SuperAdmin/RolesPermissions';
import AccessAudit from '../pages/SuperAdmin/AccessAudit';
import PlansManagement from '../pages/SuperAdmin/PlansManagement';
import MaintenanceMode from '../pages/SuperAdmin/MaintenanceMode';
import ProjectStructure from '../pages/SuperAdmin/ProjectStructure';
import FileStructure from '../pages/SuperAdmin/FileStructure';

const SuperAdminRoutes = () => {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/stats" element={<SystemStats />} />
        <Route path="/monitoring" element={<SystemMonitoring />} />
        <Route path="/coordination" element={<AgentCoordination />} />
                            <Route path="/coordinacion-documento" element={<CoordinacionAgentesViewer />} />
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
