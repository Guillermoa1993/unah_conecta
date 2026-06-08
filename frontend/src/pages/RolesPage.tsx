import { useState, useEffect } from 'react';

// ── Tipos ───────────────────────────────────────────────────
interface Role {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

interface FormState {
  nombre: string;
  descripcion: string;
}

const API = 'http://localhost:5000/api/roles';

const ROLE_ICONS: Record<string, string> = {
  Administrador: '👑',
  Docente:       '📚',
  Estudiante:    '🎓',
  Moderador:     '🛡️',
  Auditor:       '🔍',
};

function getRoleIcon(nombre: string) {
  return ROLE_ICONS[nombre] ?? '🔐';
}

// ── Componente principal ────────────────────────────────────
export default function RolesPage() {
  const [roles, setRoles]           = useState<Role[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [showModal, setShowModal]   = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form, setForm]             = useState<FormState>({ nombre: '', descripcion: '' });
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [toast, setToast]           = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const [search, setSearch]         = useState('');

  // ── Fetch ─────────────────────────────────────────────────
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setRoles(json.data);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  // ── Toast ─────────────────────────────────────────────────
  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Modal helpers ─────────────────────────────────────────
  const openCreate = () => {
    setEditingRole(null);
    setForm({ nombre: '', descripcion: '' });
    setShowModal(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setForm({ nombre: role.nombre, descripcion: role.descripcion ?? '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
  };

  // ── Guardar (crear o editar) ──────────────────────────────
  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      const method = editingRole ? 'PUT' : 'POST';
      const url    = editingRole ? `${API}/${editingRole.id}` : API;
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre.trim(), descripcion: form.descripcion.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast(editingRole ? 'Rol actualizado.' : 'Rol creado.', 'ok');
      closeModal();
      fetchRoles();
    } catch (e: any) {
      showToast(e.message ?? 'Error al guardar.', 'err');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle activo ─────────────────────────────────────────
  const toggleActivo = async (role: Role) => {
    try {
      const res  = await fetch(`${API}/${role.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !role.activo }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast(`Rol ${!role.activo ? 'activado' : 'desactivado'}.`, 'ok');
      fetchRoles();
    } catch (e: any) {
      showToast(e.message ?? 'Error.', 'err');
    }
  };

  // ── Eliminar ──────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      const res  = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('Rol eliminado.', 'ok');
      setDeleteId(null);
      fetchRoles();
    } catch (e: any) {
      showToast(e.message ?? 'Error al eliminar.', 'err');
      setDeleteId(null);
    }
  };

  // ── Filtrado ──────────────────────────────────────────────
  const filtered = roles.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (r.descripcion ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const activos   = roles.filter(r => r.activo).length;
  const inactivos = roles.filter(r => !r.activo).length;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 transition-all
          ${toast.type === 'ok' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'ok' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-slate-950 text-sm">UC</div>
            <div>
              <span className="font-black text-lg bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">UNAH Conecta</span>
              <span className="block text-[10px] text-slate-500 font-mono tracking-widest">MÓDULO DE SEGURIDAD</span>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-mono border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/5">
            🔐 Gestión de Roles
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Page title + stats */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-1">Roles del Sistema</h1>
          <p className="text-slate-400 text-sm">Define y administra los roles que controlan el acceso en el portal UNAH Conecta.</p>

          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
            {[
              { label: 'Total',     value: roles.length, color: 'text-white' },
              { label: 'Activos',   value: activos,      color: 'text-emerald-400' },
              { label: 'Inactivos', value: inactivos,    color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            ＋ Nuevo Rol
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse h-44" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-red-400 font-semibold">⚠️ {error}</p>
            <button onClick={fetchRoles} className="mt-4 text-sm text-amber-400 underline cursor-pointer">Reintentar</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">🔐</p>
            <p className="font-semibold">No se encontraron roles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(role => (
              <div
                key={role.id}
                className={`relative bg-slate-900 border rounded-2xl p-6 flex flex-col gap-4 transition-all hover:border-slate-700
                  ${role.activo ? 'border-slate-800' : 'border-slate-800/40 opacity-60'}`}
              >
                {/* Badge activo */}
                <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full
                  ${role.activo ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                  {role.activo ? 'ACTIVO' : 'INACTIVO'}
                </span>

                {/* Icon + nombre */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getRoleIcon(role.nombre)}</span>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{role.nombre}</h3>
                    <p className="text-xs text-slate-500 font-mono">ID: {role.id}</p>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-slate-400 leading-relaxed flex-1">
                  {role.descripcion ?? <span className="italic text-slate-600">Sin descripción.</span>}
                </p>

                {/* Fecha */}
                <p className="text-[11px] text-slate-600 font-mono">
                  Creado: {new Date(role.creadoEn).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => openEdit(role)}
                    className="flex-1 text-xs py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => toggleActivo(role)}
                    className="flex-1 text-xs py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                  >
                    {role.activo ? '🔕 Desactivar' : '✅ Activar'}
                  </button>
                  <button
                    onClick={() => setDeleteId(role.id)}
                    className="px-3 text-xs py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Crear / Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-7 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-1">
              {editingRole ? '✏️ Editar Rol' : '＋ Nuevo Rol'}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {editingRole ? `Modificando: ${editingRole.nombre}` : 'Completa los datos para crear un nuevo rol.'}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Nombre del Rol *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Administrador"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="¿Qué puede hacer este rol?"
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.nombre.trim()}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : null}
                {editingRole ? 'Guardar Cambios' : 'Crear Rol'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminación */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="text-lg font-black text-white mb-2">¿Eliminar este rol?</h3>
            <p className="text-sm text-slate-400 mb-6">Esta acción no se puede deshacer. El rol será eliminado permanentemente.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-all cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
