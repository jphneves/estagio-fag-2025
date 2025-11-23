'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import UserFormModal from '@/components/UserFormModal';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  roles: Array<{ id: number; name: string }>;
}

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const canCreate = hasPermission('users', 'CREATE');
  const canUpdate = hasPermission('users', 'UPDATE');
  const canDelete = hasPermission('users', 'DELETE');

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function loadRoles() {
    try {
      const response = await api.get('/api/roles');
      setRoles(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar roles:', err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await api.delete(`/api/users/${id}`);
      await loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao deletar usuário');
    }
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setShowModal(true);
  }

  function handleNew() {
    setEditingUser(null);
    setShowModal(true);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Usuários
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie os usuários do sistema
          </p>
        </div>
        {canCreate && (
          <button
            onClick={handleNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Novo Usuário
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              {(canUpdate || canDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.roles.map(r => r.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                {(canUpdate || canDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {canUpdate && (
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Editar
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Deletar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSave={loadUsers}
        user={editingUser}
        roles={roles}
      />
    </div>
  );
}
