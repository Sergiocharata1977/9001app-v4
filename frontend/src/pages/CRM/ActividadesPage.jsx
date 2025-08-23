import ActividadesListing from '@/components/crm/ActividadesListing';
import React from 'react';

const ActividadesPage = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Actividades</h1>
                <p className="text-gray-600 mt-2">
                    Administra las actividades comerciales y seguimientos
                </p>
            </div>

            <ActividadesListing />
        </div>
    );
};

export default ActividadesPage;
