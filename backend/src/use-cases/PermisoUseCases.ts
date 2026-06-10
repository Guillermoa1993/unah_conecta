// ============================================================
// CASOS DE USO: Permisos — Capa: Use Cases
// ============================================================

import { PermisoRepository } from '../domain/repositories/PermisoRepository';
import { Permiso, CreatePermisoDTO, UpdatePermisoDTO, RolPermiso } from '../domain/entities/Permiso';

export class GetAllPermisos {
  constructor(private repo: PermisoRepository) {}
  async execute(): Promise<Permiso[]> {
    return this.repo.findAll();
  }
}

export class GetPermisosByModulo {
  constructor(private repo: PermisoRepository) {}
  async execute(modulo: string): Promise<Permiso[]> {
    return this.repo.findByModulo(modulo);
  }
}

export class GetPermisoById {
  constructor(private repo: PermisoRepository) {}
  async execute(id: number): Promise<Permiso> {
    const permiso = await this.repo.findById(id);
    if (!permiso) throw new Error(`Permiso con id ${id} no encontrado.`);
    return permiso;
  }
}

export class CreatePermiso {
  constructor(private repo: PermisoRepository) {}
  async execute(data: CreatePermisoDTO): Promise<Permiso> {
    if (!data.nombrePermiso?.trim()) throw new Error('El nombre del permiso es obligatorio.');
    if (!data.modulo?.trim())        throw new Error('El módulo es obligatorio.');
    const existing = await this.repo.findByName(data.nombrePermiso.trim());
    if (existing) throw new Error(`Ya existe un permiso con el nombre "${data.nombrePermiso}".`);
    return this.repo.create({
      nombrePermiso: data.nombrePermiso.trim(),
      modulo:        data.modulo.trim(),
      descripcion:   data.descripcion?.trim(),
    });
  }
}

export class UpdatePermiso {
  constructor(private repo: PermisoRepository) {}
  async execute(id: number, data: UpdatePermisoDTO): Promise<Permiso> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new Error(`Permiso con id ${id} no encontrado.`);
    if (data.nombrePermiso && data.nombrePermiso.trim() !== exists.nombrePermiso) {
      const dup = await this.repo.findByName(data.nombrePermiso.trim());
      if (dup && dup.idPermisos !== id) throw new Error(`Ya existe un permiso con el nombre "${data.nombrePermiso}".`);
    }
    const updated = await this.repo.update(id, data);
    if (!updated) throw new Error('No se pudo actualizar el permiso.');
    return updated;
  }
}

export class DeletePermiso {
  constructor(private repo: PermisoRepository) {}
  async execute(id: number): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new Error(`Permiso con id ${id} no encontrado.`);
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new Error('No se pudo eliminar el permiso.');
  }
}

export class GetPermisosByRol {
  constructor(private repo: PermisoRepository) {}
  async execute(idRol: number): Promise<RolPermiso[]> {
    return this.repo.getPermisosByRol(idRol);
  }
}

export class AsignarPermisoARol {
  constructor(private repo: PermisoRepository) {}
  async execute(idRol: number, idPermiso: number): Promise<void> {
    if (!idRol || !idPermiso) throw new Error('idRol e idPermiso son obligatorios.');
    await this.repo.asignarPermisoARol(idRol, idPermiso);
  }
}

export class QuitarPermisoDeRol {
  constructor(private repo: PermisoRepository) {}
  async execute(idRol: number, idPermiso: number): Promise<void> {
    await this.repo.quitarPermisoDeRol(idRol, idPermiso);
  }
}

export class GetRolesConPermisos {
  constructor(private repo: PermisoRepository) {}
  async execute(): Promise<RolPermiso[]> {
    return this.repo.getRolesConPermisos();
  }
}
