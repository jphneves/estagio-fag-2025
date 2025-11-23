'use client';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Tecnologias */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Next.js
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
              React
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Node.js
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              PostgreSQL
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
              TypeScript
            </span>
          </div>

          {/* Autor */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Feito por <span className="font-semibold text-gray-900 dark:text-white">João Pedro H Neves</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
