import VendedoresListing from '@/components/crm/VendedoresListing';
import React from 'react';

const VendedoresPage = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Vendedores</h1>
                <p className="text-gray-600 mt-2">
                    Administra tu equipo comercial y sus métricas
                </p>
            </div>

            <VendedoresListing />
        </div>
    );
};

export default VendedoresPage;
