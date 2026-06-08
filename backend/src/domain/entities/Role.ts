// ============================================================
// ENTIDAD: Role
// Capa: Domain
// Representa un rol del sistema de seguridad de UNAH Conecta
// ============================================================

export interface Role {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

// DTO para crear un rol (sin id ni timestamps)
export interface CreateRoleDTO {
  nombre: string;
  descripcion?: string;
}

// DTO para actualizar un rol
export interface UpdateRoleDTO {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}
