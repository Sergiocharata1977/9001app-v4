import React, { useState, useEffect } from 'react';
import { AMFERecord } from '../../types/amfe';
import { amfeService } from '../../services/amfeService';

const AMFEMain: React.FC = () => {
  const [records, setRecords] = useState<AMFERecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await amfeService.getAllRecords();
      setRecords(data);
    } catch (error) {
      console.error('Error cargando datos AMFE:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando sistema AMFE...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Sistema AMFE</h1>
      <p className="text-gray-600 mb-6">Análisis Modal de Fallos y Efectos</p>
      
      <div className="grid gap-4">
        {records.map((record) => (
          <div key={record.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{record.process}</h3>
            <p className="text-gray-600">{record.failureMode}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>NPR: {record.npr}</span>
              <span>Responsable: {record.responsible}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AMFEMain;
