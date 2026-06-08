// ============================================================
// REPOSITORIO (INTERFAZ): RoleRepository
// Capa: Domain
// Contrato que define qué operaciones existen para Roles.
// No sabe nada de PostgreSQL — eso es detalle de infraestructura.
// ============================================================

import { Role, CreateRoleDTO, UpdateRoleDTO } from '../entities/Role';

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: number): Promise<Role | null>;
  findByName(nombre: string): Promise<Role | null>;
  create(data: CreateRoleDTO): Promise<Role>;
  update(id: number, data: UpdateRoleDTO): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
}
