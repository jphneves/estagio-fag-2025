'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bem-vindo ao sistema de gestão com RBAC e ACL
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card de Perfil */}
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">👤</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Seu Perfil
                  </dt>
                  <dd className="mt-1">
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Roles */}
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🔐</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Suas Roles
                  </dt>
                  <dd className="mt-1">
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {user?.roles.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.roles.map((r: any) => typeof r === 'string' ? r : r.name).join(', ')}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Permissões */}
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🔑</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Permissões Ativas
                  </dt>
                  <dd className="mt-1">
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {user?.permissions.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total de permissões
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Permissões */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Suas Permissões
          </h3>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {user?.permissions.map((permission, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                >
                  {permission.action} - {permission.resource}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
