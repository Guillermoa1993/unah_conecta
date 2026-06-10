import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { RolesPage } from './pages/RolesPage';
import { PermissionsView } from './pages/PermissionsView';

// ── 🌗 CONFIGURACIÓN DE TEMAS DINÁMICOS (PALETA DE COLORES) ──
type Theme = 'unah-dark' | 'unah-deep' | 'unah-cyber';

interface ThemeConfig {
  bg: string;
  panel: string;
  border: string;
  accent: string;
  accentHover: string;
  textMuted: string;
}

const themePresets: Record<Theme, ThemeConfig> = {
  'unah-dark': {
    bg: 'bg-[#070a13]',
    panel: 'bg-[#0c1220]',
    border: 'border-gray-800/80',
    accent: 'bg-yellow-500 text-black',
    accentHover: 'hover:bg-yellow-600',
    textMuted: 'text-gray-400'
  },
  'unah-deep': {
    bg: 'bg-[#020617]',
    panel: 'bg-[#0f172a]',
    border: 'border-slate-800',
    accent: 'bg-blue-600 text-white',
    accentHover: 'hover:bg-blue-700',
    textMuted: 'text-slate-400'
  },
  'unah-cyber': {
    bg: 'bg-[#05050a]',
    panel: 'bg-[#0a0a14]',
    border: 'border-indigo-950/60',
    accent: 'bg-emerald-500 text-black',
    accentHover: 'hover:bg-emerald-600',
    textMuted: 'text-zinc-500'
  }
};

// ── 🏠 VISTA DE INICIO (ESTILO CAMPUS VIRTUAL) ──
const HomePage: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de Bienvenida Institucional */}
      <div className={`${theme.panel} border ${theme.border} rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block mb-2">Plataforma de Control</span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            Seguridad y permisos para tu equipo
          </h1>
          <p className={`${theme.textMuted} mt-3 text-sm md:text-base leading-relaxed`}>
            Bienvenido al panel centralizado de <span className="text-blue-400 font-semibold">UNAH Conecta</span>. Desde aquí puedes auditar el acceso, gestionar roles y administrar matrices de permisos relacionales para todo el ecosistema universitario.
          </p>
        </div>
      </div>

      {/* Grilla de Asignaturas / Módulos Operativos */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-yellow-500 rounded-sm block"></span>
          Mis Módulos Administrativos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta 1: Roles */}
          <div className={`${theme.panel} border ${theme.border} rounded-xl p-5 shadow-xl flex flex-col justify-between group hover:scale-[1.01] transition-all duration-200`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl p-2 bg-blue-500/10 rounded-lg text-blue-400">👥</span>
                <span className="text-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold px-2 py-0.5 rounded-md uppercase">Activo</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Roles de Usuario</h3>
              <p className={`${theme.textMuted} text-xs mt-2 mb-4 leading-relaxed`}>
                Configuración global de perfiles institucionales, herencia de funciones y asignación directa de responsabilidades de red.
              </p>
            </div>
            <Link to="/roles" className="w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg">
              Ingresar al Módulo
            </Link>
          </div>

          {/* Tarjeta 2: Permisos */}
          <div className={`${theme.panel} border ${theme.border} rounded-xl p-5 shadow-xl flex flex-col justify-between group hover:scale-[1.01] transition-all duration-200`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl p-2 bg-yellow-500/10 rounded-lg text-yellow-400">🔑</span>
                <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold px-2 py-0.5 rounded-md uppercase">Activo</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">Matriz de Permisos</h3>
              <p className={`${theme.textMuted} text-xs mt-2 mb-4 leading-relaxed`}>
                Gestión de acciones atómicas y controles ACL por módulos, protegiendo las peticiones hacia el núcleo del backend.
              </p>
            </div>
            <Link to="/permissions" className="w-full text-center py-2 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold rounded-lg transition-colors shadow-lg">
              Ingresar al Módulo
            </Link>
          </div>

          {/* Tarjeta 3: Usuarios */}
          <div className={`${theme.panel} border ${theme.border} rounded-xl p-5 shadow-xl flex flex-col justify-between opacity-60 border-dashed`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl p-2 bg-purple-500/10 rounded-lg text-purple-400">👤</span>
                <span className="text-[10px] bg-gray-800 text-gray-400 font-bold px-2 py-0.5 rounded-md uppercase">Espera</span>
              </div>
              <h3 className="text-lg font-bold text-white">Cuentas de Usuario</h3>
              <p className={`${theme.textMuted} text-xs mt-2 mb-4 leading-relaxed`}>
                Gestión integrada de identidades de estudiantes, docentes y personal de soporte con autenticación centralizada.
              </p>
            </div>
            <button disabled className="w-full py-2 bg-gray-800 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed">
              Próximamente
            </button>
          </div>
        </div>
      </div>

      {/* Secciones en Construcción (Bitácora, Respaldos, ACL) */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-orange-500 rounded-sm block"></span>
          Herramientas del Sistema (En Desarrollo)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bitácora */}
          <div className={`${theme.panel} border ${theme.border} p-4 rounded-xl flex items-center gap-4 opacity-50 hover:opacity-70 transition-opacity`}>
            <span className="text-2xl p-2 bg-orange-500/10 rounded-lg text-orange-400">📝</span>
            <div>
              <h4 className="text-sm font-bold text-white">Bitácora de Eventos</h4>
              <p className={`${theme.textMuted} text-[11px]`}>Logs y auditoría de transacciones.</p>
            </div>
          </div>
          {/* Respaldos */}
          <div className={`${theme.panel} border ${theme.border} p-4 rounded-xl flex items-center gap-4 opacity-50 hover:opacity-70 transition-opacity`}>
            <span className="text-2xl p-2 bg-cyan-500/10 rounded-lg text-cyan-400">💾</span>
            <div>
              <h4 className="text-sm font-bold text-white">Copias de Respaldo</h4>
              <p className={`${theme.textMuted} text-[11px]`}>Backups automatizados SQL/Docker.</p>
            </div>
          </div>
          {/* ACL */}
          <div className={`${theme.panel} border ${theme.border} p-4 rounded-xl flex items-center gap-4 opacity-50 hover:opacity-70 transition-opacity`}>
            <span className="text-2xl p-2 bg-emerald-500/10 rounded-lg text-emerald-400">🛡️</span>
            <div>
              <h4 className="text-sm font-bold text-white">Políticas ACL / RBAC</h4>
              <p className={`${theme.textMuted} text-[11px]`}>Reglas avanzadas basadas en tokens.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 💻 COMPONENTE MAESTRO APP ──
export default function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('unah-dark');
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const activeTheme = themePresets[currentTheme];

  // Verificación reactiva del estado del API
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        setApiConnected(res.ok);
      } catch {
        setApiConnected(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000); // Re-verificar cada 10s
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const themes: Theme[] = ['unah-dark', 'unah-deep', 'unah-cyber'];
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
  };

  return (
    <Router>
      <div className={`min-h-screen ${activeTheme.bg} text-white font-sans antialiased flex flex-col transition-colors duration-300`}>
        
        {/* BARRA SUPERIOR (HEADER TIPO CAMPUS VIRTUAL) */}
        <header className={`${activeTheme.panel} border-b ${activeTheme.border} h-16 px-6 sticky top-0 z-50 flex justify-between items-center backdrop-blur-md bg-opacity-95`}>
          {/* Logo y Eslogan */}
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 text-black font-black w-8 h-8 rounded-lg flex items-center justify-center text-xs shadow-md">
              UC
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-sm tracking-tight text-white block">UNAH Conecta</span>
              <span className="text-[9px] font-bold text-yellow-500 tracking-widest block -mt-1">PORTAL DE SEGURIDAD</span>
            </div>
          </div>

          {/* Indicador de API Dinámico e Interruptor de Tema */}
          <div className="flex items-center gap-4">
            {/* Indicador API Realtime */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#131b2e]/60 rounded-full border border-gray-800 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                apiConnected === null ? 'bg-amber-400' : apiConnected ? 'bg-emerald-400' : 'bg-red-500'
              }`}></span>
              <span className="text-[11px] text-gray-300 hidden md:inline">Servidor:</span>
              <span className="text-[10px] font-bold uppercase">
                {apiConnected === null ? 'Buscando...' : apiConnected ? 'API Conectada' : 'API Desconectada'}
              </span>
            </div>

            {/* Selector de Tema Dinámico */}
            <button 
              onClick={toggleTheme}
              className="p-2 bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 rounded-lg text-xs font-bold text-yellow-400 transition-colors flex items-center gap-1.5"
              title="Cambiar Paleta Visual"
            >
              🎨 <span className="hidden sm:inline text-white text-[11px]">Tema</span>
            </button>
          </div>
        </header>

        {/* ESTRUCTURA LATERAL Y DE CONTENIDO */}
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          
          {/* MENÚ DE NAVEGACIÓN LATERAL (SIDEBAR DEL CAMPUS) */}
          <aside className="w-full md:w-64 p-4 md:p-6 space-y-2 border-b md:border-b-0 md:border-r border-gray-800/40 md:min-h-[calc(100vh-4rem)]">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block px-3 mb-2">Navegación Principal</span>
            
            <SidebarLink to="/" label="Área Personal" icon="🏠" isHome />
            <SidebarLink to="/roles" label="Control de Roles" icon="👥" />
            <SidebarLink to="/permissions" label="Gestión de Permisos" icon="🔑" />
            
            <div className="pt-6">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block px-3 mb-2">Mi Cuenta</span>
              <div className="p-3 bg-gray-900/40 border border-gray-800/50 rounded-xl flex items-center gap-2.5">
                <div className="w-7 h-7 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold text-xs">
                  FC
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">F. Corrales</span>
                  <span className="text-[10px] text-gray-500 block truncate">Sistemas UNAH</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ÁREA DE CONTENIDO DINÁMICO */}
          <main className="flex-1 p-6 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage theme={activeTheme} />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/permissions" element={<PermissionsView />} />
              <Route path="*" element={<HomePage theme={activeTheme} />} />
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}

// ── 🎨 COMPONENTE AUXILIAR PARA LOS BOTONES DEL SIDEBAR ──
function SidebarLink({ to, label, icon, isHome = false }: { to: string; label: string; icon: string; isHome?: boolean }) {
  const location = useLocation();
  const isActive = isHome ? location.pathname === '/' : location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
        isActive 
          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-md font-bold' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
      )}
    </Link>
  );
}