// ============================================================
// REPOSITORIO (INTERFAZ): PermisoRepository — Capa: Domain
// ============================================================

import { Permiso, CreatePermisoDTO, UpdatePermisoDTO, RolPermiso } from '../entities/Permiso';

export interface PermisoRepository {
  findAll(): Promise<Permiso[]>;
  findById(id: number): Promise<Permiso | null>;
  findByModulo(modulo: string): Promise<Permiso[]>;
  findByName(nombre: string): Promise<Permiso | null>;
  create(data: CreatePermisoDTO): Promise<Permiso>;
  update(id: number, data: UpdatePermisoDTO): Promise<Permiso | null>;
  delete(id: number): Promise<boolean>;
  // Rol-Permisos
  getPermisosByRol(idRol: number): Promise<RolPermiso[]>;
  asignarPermisoARol(idRol: number, idPermiso: number): Promise<void>;
  quitarPermisoDeRol(idRol: number, idPermiso: number): Promise<void>;
  getRolesConPermisos(): Promise<RolPermiso[]>;
}
