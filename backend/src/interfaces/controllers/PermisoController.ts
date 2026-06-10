// ============================================================
// CONTROLADOR: PermisoController — Capa: Interfaces
// ============================================================

import { Request, Response } from 'express';
import {
  GetAllPermisos, GetPermisoById, GetPermisosByModulo,
  CreatePermiso, UpdatePermiso, DeletePermiso,
  GetPermisosByRol, AsignarPermisoARol, QuitarPermisoDeRol,
  GetRolesConPermisos,
} from '../../use-cases/PermisoUseCases';

export class PermisoController {
  constructor(
    private getAllPermisos:      GetAllPermisos,
    private getPermisoById:     GetPermisoById,
    private getPermisosByModulo: GetPermisosByModulo,
    private createPermiso:      CreatePermiso,
    private updatePermiso:      UpdatePermiso,
    private deletePermiso:      DeletePermiso,
    private getPermisosByRol:   GetPermisosByRol,
    private asignarPermisoARol: AsignarPermisoARol,
    private quitarPermisoDeRol: QuitarPermisoDeRol,
    private getRolesConPermisos: GetRolesConPermisos,
  ) {}

  // GET /api/permisos
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const permisos = await this.getAllPermisos.execute();
      res.status(200).json({ success: true, data: permisos });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // GET /api/permisos/modulo/:modulo
  async getByModulo(req: Request, res: Response): Promise<void> {
    try {
      const permisos = await this.getPermisosByModulo.execute(req.params.modulo);
      res.status(200).json({ success: true, data: permisos });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // GET /api/permisos/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido.' }); return; }
      const permiso = await this.getPermisoById.execute(id);
      res.status(200).json({ success: true, data: permiso });
    } catch (e: any) {
      res.status(e.message.includes('no encontrado') ? 404 : 500).json({ success: false, message: e.message });
    }
  }

  // POST /api/permisos
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombrePermiso, modulo, descripcion } = req.body;
      const permiso = await this.createPermiso.execute({ nombrePermiso, modulo, descripcion });
      res.status(201).json({ success: true, data: permiso });
    } catch (e: any) {
      res.status(e.message.includes('obligatorio') || e.message.includes('Ya existe') ? 400 : 500)
        .json({ success: false, message: e.message });
    }
  }

  // PUT /api/permisos/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido.' }); return; }
      const permiso = await this.updatePermiso.execute(id, req.body);
      res.status(200).json({ success: true, data: permiso });
    } catch (e: any) {
      res.status(e.message.includes('no encontrado') ? 404 : 400).json({ success: false, message: e.message });
    }
  }

  // DELETE /api/permisos/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido.' }); return; }
      await this.deletePermiso.execute(id);
      res.status(200).json({ success: true, message: 'Permiso eliminado correctamente.' });
    } catch (e: any) {
      res.status(e.message.includes('no encontrado') ? 404 : 500).json({ success: false, message: e.message });
    }
  }

  // GET /api/permisos/rol/:idRol
  async getByRol(req: Request, res: Response): Promise<void> {
    try {
      const idRol = parseInt(req.params.idRol);
      if (isNaN(idRol)) { res.status(400).json({ success: false, message: 'ID de rol inválido.' }); return; }
      const permisos = await this.getPermisosByRol.execute(idRol);
      res.status(200).json({ success: true, data: permisos });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // POST /api/permisos/rol/asignar
  async asignar(req: Request, res: Response): Promise<void> {
    try {
      const { idRol, idPermiso } = req.body;
      await this.asignarPermisoARol.execute(Number(idRol), Number(idPermiso));
      res.status(200).json({ success: true, message: 'Permiso asignado al rol correctamente.' });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  // DELETE /api/permisos/rol/quitar
  async quitar(req: Request, res: Response): Promise<void> {
    try {
      const { idRol, idPermiso } = req.body;
      await this.quitarPermisoDeRol.execute(Number(idRol), Number(idPermiso));
      res.status(200).json({ success: true, message: 'Permiso quitado del rol correctamente.' });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // GET /api/permisos/roles/todos
  async getAllRolesConPermisos(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.getRolesConPermisos.execute();
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
}
