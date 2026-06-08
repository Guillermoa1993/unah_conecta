// ============================================================
// CASOS DE USO: Roles
// Capa: Use Cases (Application)
// Contiene TODA la lógica de negocio para gestión de roles.
// No sabe nada de HTTP ni de SQL — solo de reglas de negocio.
// ============================================================

import { RoleRepository } from '../domain/repositories/RoleRepository';
import { Role, CreateRoleDTO, UpdateRoleDTO } from '../domain/entities/Role';

// ─── Obtener todos los roles ───────────────────────────────
export class GetAllRoles {
  constructor(private repo: RoleRepository) {}

  async execute(): Promise<Role[]> {
    return this.repo.findAll();
  }
}

// ─── Obtener un rol por ID ─────────────────────────────────
export class GetRoleById {
  constructor(private repo: RoleRepository) {}

  async execute(id: number): Promise<Role> {
    const role = await this.repo.findById(id);
    if (!role) throw new Error(`Rol con id ${id} no encontrado.`);
    return role;
  }
}

// ─── Crear un nuevo rol ────────────────────────────────────
export class CreateRole {
  constructor(private repo: RoleRepository) {}

  async execute(data: CreateRoleDTO): Promise<Role> {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre del rol es obligatorio.');
    }

    // Verificar que no exista otro con el mismo nombre
    const existing = await this.repo.findByName(data.nombre.trim());
    if (existing) {
      throw new Error(`Ya existe un rol con el nombre "${data.nombre}".`);
    }

    return this.repo.create({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim(),
    });
  }
}

// ─── Actualizar un rol ─────────────────────────────────────
export class UpdateRole {
  constructor(private repo: RoleRepository) {}

  async execute(id: number, data: UpdateRoleDTO): Promise<Role> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new Error(`Rol con id ${id} no encontrado.`);

    // Si cambian el nombre, verificar que no esté en uso por otro rol
    if (data.nombre && data.nombre.trim() !== exists.nombre) {
      const duplicate = await this.repo.findByName(data.nombre.trim());
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Ya existe un rol con el nombre "${data.nombre}".`);
      }
    }

    const updated = await this.repo.update(id, data);
    if (!updated) throw new Error('No se pudo actualizar el rol.');
    return updated;
  }
}

// ─── Eliminar un rol ───────────────────────────────────────
export class DeleteRole {
  constructor(private repo: RoleRepository) {}

  async execute(id: number): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new Error(`Rol con id ${id} no encontrado.`);

    const deleted = await this.repo.delete(id);
    if (!deleted) throw new Error('No se pudo eliminar el rol.');
  }
}
