'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Array<{
    id: number;
    resource: string;
    action: string;
  }>;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      setLoading(true);
      const response = await api.get('/api/roles');
      setRoles(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar roles');
    } finally {
      setLoading(false);
    }
  }

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
          Roles
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Visualize as roles disponíveis no sistema
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {role.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {role.description}
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Permissões ({role.permissions.length}):
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {role.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium capitalize">{permission.resource}</span>
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
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
          </div>
        ))}
      </div>
    </div>
  );
}
