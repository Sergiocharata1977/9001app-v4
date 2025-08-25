import ClientesListing from '@/components/crm/ClientesListing';
import React from 'react';

const ClientesPage = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
                <p className="text-gray-600 mt-2">
                    Administra tus clientes y prospectos de manera eficiente
                </p>
            </div>

            <ClientesListing />
        </div>
    );
};

export default ClientesPage;
