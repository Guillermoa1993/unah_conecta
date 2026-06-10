import React, { useEffect, useState } from 'react';

interface PermissionData {
  id_permisos?: number;
  nombre_permiso: string;
  modulo: string;
  descripcion?: string; // Mantenido para retrocompatibilidad con datos locales
}

export const PermissionsView: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el Modal (Crear / Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionData | null>(null);
  const [nombrePermiso, setNombrePermiso] = useState('');
  const [modulo, setModulo] = useState('Roles');

  const API_URL = 'http://localhost:5000/api/permissions';

  // 🔄 Cargar Permisos desde el Backend o activar Contingencia
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) throw new Error('Error al obtener los datos del servidor');
      
      const data = await response.json();
      
      // Control de tolerancia por si el formato del backend varía
      if (Array.isArray(data)) {
        setPermissions(data);
      } else if (data && typeof data === 'object' && Array.isArray((data as any).permissions)) {
        setPermissions((data as any).permissions);
      } else {
        setPermissions([]);
      }
    } catch (err: any) {
      console.error("Error en fetchPermissions, activando contingencia:", err);
      setError(err.message || 'Error de conexión');
      
      // Datos quemados de respaldo institucionales (Modo Contingencia)
      setPermissions([
        { id_permisos: 1, nombre_permiso: 'leer_roles', modulo: 'Roles', descripcion: 'Permite visualizar el listado de roles del sistema.' },
        { id_permisos: 2, nombre_permiso: 'crear_roles', modulo: 'Roles', descripcion: 'Permite añadir nuevos roles operativos.' },
        { id_permisos: 3, nombre_permiso: 'modificar_permisos', modulo: 'Permisos', descripcion: 'Acceso total para editar la matriz ACL.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // 📝 Abrir Modal para Crear
  const handleOpenCreateModal = () => {
    setSelectedPermission(null);
    setNombrePermiso('');
    setModulo('Roles');
    setIsModalOpen(true);
  };

  // 📝 Abrir Modal para Editar
  const handleOpenEditModal = (perm: PermissionData) => {
    setSelectedPermission(perm);
    setNombrePermiso(perm.nombre_permiso);
    setModulo(perm.modulo);
    setIsModalOpen(true);
  };

  // 💾 Guardar o Actualizar Permiso
  const handleSavePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = selectedPermission?.id_permisos ? `${API_URL}/${selectedPermission.id_permisos}` : API_URL;
      const method = selectedPermission?.id_permisos ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_permiso: nombrePermiso, modulo: modulo }),
      });

      if (!response.ok) throw new Error('No se pudo guardar el permiso en la Base de Datos');

      setIsModalOpen(false);
      fetchPermissions();
    } catch (err: any) {
      alert(err.message || 'Error de red al procesar la solicitud');
    }
  };

  // 🗑️ Eliminar Permiso
  const handleDeletePermission = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este permiso permanentemente?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al intentar eliminar el registro');
        fetchPermissions();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] p-4 text-white animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800/60 pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              🔑 Módulo de Permisos
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Gestiona los accesos por funcionalidad de la plataforma UNAH Conecta.</p>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all text-sm transform hover:-translate-y-0.5"
          >
            + Nuevo Permiso
          </button>
        </div>

        {/* LOADING ANIME */}
        {loading && <div className="text-center py-12 text-gray-500 animate-pulse text-sm">Sincronizando matriz de accesos...</div>}
        
        {/* INDICADOR DE CONTINGENCIA LOCAL */}
        {error && (
          <div className="mb-6 rounded-xl border border-amber-900/40 bg-amber-950/10 p-4 text-center max-w-2xl mx-auto">
            <p className="text-amber-400 text-xs font-medium">
              ⚠️ Servidor desconectado ({error}). Se ha activado el Modo de Contingencia con permisos locales de respaldo.
            </p>
          </div>
        )}

        {/* REJILLA DE PERMISOS */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {permissions.map((perm) => (
              <div 
                key={perm.id_permisos || perm.nombre_permiso} 
                className="relative rounded-2xl border border-gray-800 bg-[#0c1220] p-6 shadow-xl hover:border-amber-500/30 transition-all group"
              >
                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {perm.modulo}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-[#151f33] text-amber-400 group-hover:scale-110 transition-transform text-md">
                    🔑
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors truncate max-w-[160px]">
                      {perm.nombre_permiso}
                    </h3>
                    <p className="text-gray-500 text-[11px] font-mono">ID: #{perm.id_permisos || 'TEMP'}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-xs mb-6 min-h-[3rem] leading-relaxed">
                  {perm.descripcion || `Permite realizar operaciones y ejecuciones específicas dentro del módulo institucional de ${perm.modulo}.`}
                </p>

                <div className="flex gap-2 items-center border-t border-gray-800/60 pt-4">
                  <button 
                    onClick={() => handleOpenEditModal(perm)}
                    className="flex-1 py-2 px-3 text-xs bg-[#161f32] text-white hover:bg-[#1f2c47] font-semibold rounded-xl transition-colors"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => perm.id_permisos && handleDeletePermission(perm.id_permisos)}
                    className="py-2 px-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold rounded-xl transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {permissions.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 italic text-sm border-2 border-dashed border-gray-800 rounded-2xl bg-[#0c1220]/30">
                No hay permisos creados todavía.
              </div>
            )}
          </div>
        )}

        {/* MODAL INTEGRADO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0b0f19] p-6 shadow-2xl text-white mx-4">
              <h3 className="text-lg font-bold mb-4 text-amber-400 flex items-center gap-1.5">
                {selectedPermission ? '✏️ Editar Permiso Estructural' : '🔑 Crear Nuevo Permiso'}
              </h3>
              <form onSubmit={handleSavePermission} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre del Permiso</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. leer_bitacora"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#131a26] border border-gray-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    value={nombrePermiso}
                    onChange={(e) => setNombrePermiso(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Módulo Destino</label>
                  <select
                    value={modulo}
                    onChange={(e) => setModulo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#131a26] border border-gray-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Roles">Roles</option>
                    <option value="Permisos">Permisos</option>
                    <option value="Usuarios">Usuarios</option>
                    <option value="Bitácora">Bitácora</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-800/80">
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold rounded-xl transition-colors shadow-lg"
                  >
                    {selectedPermission ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};