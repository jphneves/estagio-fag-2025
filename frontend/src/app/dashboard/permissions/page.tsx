'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Permission {
  id: number;
  resource: string;
  action: string;
  description: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPermissions();
  }, []);

  async function loadPermissions() {
    try {
      setLoading(true);
      const response = await api.get('/api/permissions');
      setPermissions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar permissões');
    } finally {
      setLoading(false);
    }
  }

  // Agrupar permissões por recurso
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Permissões
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Visualize todas as permissões disponíveis no sistema
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Object.entries(groupedPermissions).map(([resource, perms]) => (
          <div key={resource} className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white capitalize">
                {resource}
              </h3>
              <div className="mt-4 space-y-2">
                {perms.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {permission.action}
                      </span>
                      {permission.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      permission.action === 'CREATE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      permission.action === 'READ' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                      permission.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {permission.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
