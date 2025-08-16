import React, { useState } from 'react';
import { AMFERecord } from '../../types/amfe';

interface AMFEReportsProps {
  records: AMFERecord[];
  onExportCSV: () => void;
}

const AMFEReports: React.FC<AMFEReportsProps> = ({ records, onExportCSV }) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedProcess, setSelectedProcess] = useState<string>('all');

  // Filtrar registros según selección
  const filteredRecords = records.filter(record => {
    if (selectedYear !== 'all' && record.year.toString() !== selectedYear) return false;
    if (selectedProcess !== 'all' && record.process !== selectedProcess) return false;
    return true;
  });

  // Calcular estadísticas
  const total = filteredRecords.length;
  const averageNPR = total > 0 ? filteredRecords.reduce((sum, r) => sum + r.npr, 0) / total : 0;
  
  const byRiskLevel = filteredRecords.reduce((acc, record) => {
    acc[record.riskLevel] = (acc[record.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byStatus = filteredRecords.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topRisks = [...filteredRecords]
    .sort((a, b) => b.npr - a.npr)
    .slice(0, 5);

  const byProcess = filteredRecords.reduce((acc, record) => {
    if (!acc[record.process]) {
      acc[record.process] = { total: 0, critical: 0, high: 0, averageNPR: 0 };
    }
    acc[record.process].total++;
    if (record.riskLevel === 'critical') acc[record.process].critical++;
    if (record.riskLevel === 'high') acc[record.process].high++;
    acc[record.process].averageNPR += record.npr;
    return acc;
  }, {} as Record<string, { total: number; critical: number; high: number; averageNPR: number }>);

  // Obtener opciones para filtros
  const years = Array.from(new Set(records.map(r => r.year))).sort((a, b) => b - a);
  const processes = Array.from(new Set(records.map(r => r.process))).sort();

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

  return (
    <div className="space-y-6">
      {/* Filtros y exportación */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los años</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proceso</label>
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los procesos</option>
                {processes.map(process => (
                  <option key={process} value={process}>{process}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Ejecutivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Registros</p>
            <p className="text-2xl font-bold text-blue-900">{total}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">NPR Promedio</p>
            <p className="text-2xl font-bold text-red-900">{Math.round(averageNPR * 100) / 100}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">Riesgos Críticos</p>
            <p className="text-2xl font-bold text-orange-900">{byRiskLevel['critical'] || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Completados</p>
            <p className="text-2xl font-bold text-green-900">{byStatus['completed'] || 0}</p>
          </div>
        </div>
      </div>

      {/* Top 5 riesgos más altos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Riesgos Más Altos</h3>
        <div className="space-y-3">
          {topRisks.map((record, index) => (
            <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-semibold text-red-600">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{record.process} - {record.function}</p>
                  <p className="text-sm text-gray-600">{record.failureMode}</p>
                  <p className="text-xs text-gray-500">Responsable: {record.responsible}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-red-600">{record.npr}</p>
                  <p className="text-xs text-gray-500">NPR</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(record.riskLevel)}`}>
                  {record.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución por nivel de riesgo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Nivel de Riesgo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(byRiskLevel).map(([level, count]) => (
            <div key={level} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(level)}`}>
                  {getRiskLevelText(level)}
                </span>
                <span className="text-lg font-semibold text-gray-900">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    level === 'low' ? 'bg-green-500' :
                    level === 'medium' ? 'bg-yellow-500' :
                    level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {total > 0 ? ((count / total) * 100).toFixed(1) : 0}% del total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución por estado */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
                <span className="text-lg font-semibold text-gray-900">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    status === 'pending' ? 'bg-yellow-500' :
                    status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {total > 0 ? ((count / total) * 100).toFixed(1) : 0}% del total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen por proceso */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen por Proceso</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Críticos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Altos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPR Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completados
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(byProcess).map(([process, data]) => {
                const processRecords = filteredRecords.filter(r => r.process === process);
                const completed = processRecords.filter(r => r.status === 'completed').length;
                
                return (
                  <tr key={process}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {process}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {data.critical}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                      {data.high}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(data.averageNPR / data.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {completed}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
        <div className="space-y-4">
          {byRiskLevel['critical'] > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">⚠️ Atención Crítica</h4>
              <p className="text-red-700">
                Existen {byRiskLevel['critical']} riesgos críticos que requieren atención inmediata. 
                Priorice la implementación de acciones correctivas para estos casos.
              </p>
            </div>
          )}
          
          {byRiskLevel['high'] > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">🔍 Monitoreo Alto</h4>
              <p className="text-orange-700">
                Hay {byRiskLevel['high']} riesgos altos que deben ser monitoreados de cerca. 
                Considere implementar controles adicionales.
              </p>
            </div>
          )}

          {byStatus['pending'] > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">⏰ Acciones Pendientes</h4>
              <p className="text-yellow-700">
                {byStatus['pending']} acciones están pendientes de implementación. 
                Revise los plazos y asigne responsabilidades.
              </p>
            </div>
          )}

          {averageNPR > 100 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📊 NPR Promedio Alto</h4>
              <p className="text-blue-700">
                El NPR promedio de {Math.round(averageNPR * 100) / 100} indica un nivel de riesgo general elevado. 
                Considere revisar los controles existentes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AMFEReports;
