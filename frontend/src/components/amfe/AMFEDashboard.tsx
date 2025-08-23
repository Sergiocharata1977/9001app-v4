import React, { useState, useEffect } from 'react';
import { AMFERecord } from '../../types/amfe';

interface AMFEDashboardProps {
  records: AMFERecord[];
}

const AMFEDashboard: React.FC<AMFEDashboardProps> = ({ records }) => {
  const [stats, setStats] = useState({
    total: 0,
    byRiskLevel: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    averageNPR: 0,
    topRisks: [] as AMFERecord[]
  });

  useEffect(() => {
    const total = records.length;
    
    const byRiskLevel = records.reduce((acc, record) => {
      acc[record.riskLevel] = (acc[record.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byStatus = records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const averageNPR = total > 0 ? records.reduce((sum, record) => sum + record.npr, 0) / total : 0;
    
    const topRisks = [...records]
      .sort((a, b) => b.npr - a.npr)
      .slice(0, 5);
    
    setStats({
      total,
      byRiskLevel,
      byStatus,
      averageNPR: Math.round(averageNPR * 100) / 100,
      topRisks
    });
  }, [records]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Bajo';
      case 'medium': return 'Medio';
      case 'high': return 'Alto';
      case 'critical': return 'Crítico';
      default: return level;
    }
  };

  // Calcular porcentajes para gráficos
  const riskLevelPercentages = Object.entries(stats.byRiskLevel).map(([level, count]) => ({
    level,
    count,
    percentage: stats.total > 0 ? (count / stats.total) * 100 : 0
  }));

  const statusPercentages = Object.entries(stats.byStatus).map(([status, count]) => ({
    status,
    count,
    percentage: stats.total > 0 ? (count / stats.total) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">NPR Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageNPR}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.byStatus['in-progress'] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.byStatus['completed'] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por nivel de riesgo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Nivel de Riesgo</h3>
          <div className="space-y-3">
            {riskLevelPercentages.map(({ level, count, percentage }) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(level)}`}>
                    {getRiskLevelText(level)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">({count})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        level === 'low' ? 'bg-green-500' :
                        level === 'medium' ? 'bg-yellow-500' :
                        level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por estado */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <div className="space-y-3">
            {statusPercentages.map(({ status, count, percentage }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                    {getStatusText(status)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">({count})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'pending' ? 'bg-yellow-500' :
                        status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 riesgos más altos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Riesgos Más Altos</h3>
        <div className="space-y-4">
          {stats.topRisks.map((record, index) => (
            <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-semibold text-red-600">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{record.process} - {record.function}</p>
                  <p className="text-sm text-gray-600 max-w-md truncate">{record.failureMode}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-red-600">{record.npr}</p>
                  <p className="text-xs text-gray-500">NPR</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(record.riskLevel)}`}>
                  {getRiskLevelText(record.riskLevel)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de procesos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen por Proceso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(
            records.reduce((acc, record) => {
              if (!acc[record.process]) {
                acc[record.process] = { total: 0, critical: 0, high: 0, averageNPR: 0 };
              }
              acc[record.process].total++;
              if (record.riskLevel === 'critical') acc[record.process].critical++;
              if (record.riskLevel === 'high') acc[record.process].high++;
              acc[record.process].averageNPR += record.npr;
              return acc;
            }, {} as Record<string, { total: number; critical: number; high: number; averageNPR: number }>)
          ).map(([process, data]) => (
            <div key={process} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{process}</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">Total: {data.total}</p>
                <p className="text-red-600">Críticos: {data.critical}</p>
                <p className="text-orange-600">Altos: {data.high}</p>
                <p className="text-blue-600">NPR Promedio: {Math.round(data.averageNPR / data.total)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AMFEDashboard;
