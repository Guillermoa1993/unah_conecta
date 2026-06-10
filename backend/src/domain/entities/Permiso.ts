// ============================================================
// ENTIDAD: Permiso — Capa: Domain
// ============================================================

export interface Permiso {
  idPermisos: number;
  nombrePermiso: string;
  modulo: string;
  descripcion: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreatePermisoDTO {
  nombrePermiso: string;
  modulo: string;
  descripcion?: string;
}

export interface UpdatePermisoDTO {
  nombrePermiso?: string;
  modulo?: string;
  descripcion?: string;
  activo?: boolean;
}

// Para la tabla rol_permisos
export interface RolPermiso {
  idRol: number;
  idPermiso: number;
  nombreRol?: string;
  nombrePermiso?: string;
  modulo?: string;
}
