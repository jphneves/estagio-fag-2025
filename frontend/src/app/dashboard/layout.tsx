'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { 
      name: 'Usuários', 
      href: '/dashboard/users', 
      icon: '👥',
      show: hasPermission('users', 'READ')
    },
    { 
      name: 'Roles', 
      href: '/dashboard/roles', 
      icon: '🔐',
      show: hasPermission('roles', 'READ')
    },
    { 
      name: 'Permissões', 
      href: '/dashboard/permissions', 
      icon: '🔑',
      show: hasPermission('permissions', 'READ')
    },
  ].filter(item => item.show !== false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="px-2 sm:px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              {/* Botão de colapsar sidebar */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                >
                  {sidebarCollapsed ? (
                    // Side-right (expandir)
                    <g>
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                      <line
                        x1="15"
                        y1="3"
                        x2="15"
                        y2="21"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                    </g>
                  ) : (
                    // Side-left (recolher)
                    <g>
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                      <line
                        x1="9"
                        y1="3"
                        x2="9"
                        y2="21"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                    </g>
                  )}
                </svg>
              </button>
              
              {/* Título */}
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sistema RBAC/ACL
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.roles.map((r: any) => typeof r === 'string' ? r : r.name).join(', ')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-800 shadow-sm transition-all duration-300`}>
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }
                  `}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <span className={`text-lg ${sidebarCollapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                  {!sidebarCollapsed && item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
