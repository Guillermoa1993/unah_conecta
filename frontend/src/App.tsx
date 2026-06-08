import { useState } from 'react';
import RolesPage from './pages/RolesPage';

// Navegación simple sin react-router (no requiere instalación extra)
type Page = 'home' | 'roles';

function App() {
  const [page, setPage] = useState<Page>('home');

  return (
    <div>
      {/* Barra de navegación global */}
      <nav className="fixed top-0 left-0 right-0 z-[200] bg-slate-950 border-b border-slate-800 h-14 flex items-center px-6 gap-6">
        <div className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-slate-950 text-xs">UC</div>
          <span className="font-black text-base bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">UNAH Conecta</span>
        </div>
        <button
          onClick={() => setPage('home')}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer
            ${page === 'home' ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          🏠 Inicio
        </button>
        <button
          onClick={() => setPage('roles')}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer
            ${page === 'roles' ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          🔐 Roles
        </button>
      </nav>

      {/* Contenido de la página */}
      <div className="pt-14">
        {page === 'roles' ? (
          <RolesPage />
        ) : (
          <HomePage onNavigate={setPage} />
        )}
      </div>
    </div>
  );
}

// ── Página de Inicio (la original, adaptada) ──────────────
function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-black text-center mb-4">
          Módulo de <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Seguridad</span>
        </h1>
        <p className="text-slate-400 text-center max-w-xl mb-12">
          Selecciona un módulo del sistema de seguridad del portal UNAH Conecta.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-3xl">
          {[
            { icon: '👑', label: 'Roles',      desc: 'Define los roles del sistema',            page: 'roles' as Page, ready: true },
            { icon: '🔑', label: 'Permisos',   desc: 'Asigna permisos por rol',                 page: 'home' as Page,  ready: false },
            { icon: '📋', label: 'Bitácora',   desc: 'Registro de actividad del sistema',       page: 'home' as Page,  ready: false },
            { icon: '👤', label: 'Usuarios',   desc: 'Gestión de cuentas de usuario',           page: 'home' as Page,  ready: false },
            { icon: '💾', label: 'Respaldos',  desc: 'Historial de backups de la base de datos',page: 'home' as Page,  ready: false },
            { icon: '🛡️', label: 'ACL / RBAC', desc: 'Control de acceso por listas y roles',   page: 'home' as Page,  ready: false },
          ].map(m => (
            <button
              key={m.label}
              onClick={() => m.ready && onNavigate(m.page)}
              className={`relative bg-slate-900 border rounded-2xl p-6 text-left transition-all
                ${m.ready
                  ? 'border-amber-500/30 hover:border-amber-500/60 cursor-pointer hover:bg-slate-900/80'
                  : 'border-slate-800 opacity-50 cursor-not-allowed'}`}
            >
              {!m.ready && (
                <span className="absolute top-3 right-3 text-[9px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-mono">PRÓXIMO</span>
              )}
              {m.ready && (
                <span className="absolute top-3 right-3 text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-mono">LISTO</span>
              )}
              <span className="text-3xl mb-3 block">{m.icon}</span>
              <h3 className="font-bold text-white mb-1">{m.label}</h3>
              <p className="text-xs text-slate-400">{m.desc}</p>
            </button>
          ))}
        </div>
      </main>
      <footer className="border-t border-slate-900 py-5 text-center text-xs text-slate-600">
        © 2026 UNAH Conecta — Universidad Nacional Autónoma de Honduras
      </footer>
    </div>
  );
}

export default App;
