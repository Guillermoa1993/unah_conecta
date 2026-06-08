// ============================================================
// CONTROLADOR: RoleController
// Capa: Interfaces
// Recibe peticiones HTTP, llama al use-case correcto y responde.
// ============================================================

import { Request, Response } from 'express';
import {
  GetAllRoles,
  GetRoleById,
  CreateRole,
  UpdateRole,
  DeleteRole,
} from '../../use-cases/RoleUseCases';

export class RoleController {
  constructor(
    private getAllRoles: GetAllRoles,
    private getRoleById: GetRoleById,
    private createRole: CreateRole,
    private updateRole: UpdateRole,
    private deleteRole: DeleteRole,
  ) {}

  // GET /api/roles
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.getAllRoles.execute();
      res.status(200).json({ success: true, data: roles });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/roles/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(idParam ?? '', 10);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }
      const role = await this.getRoleById.execute(id);
      res.status(200).json({ success: true, data: role });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  // POST /api/roles
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, descripcion } = req.body;
      const role = await this.createRole.execute({ nombre, descripcion });
      res.status(201).json({ success: true, data: role });
    } catch (error: any) {
      const status = error.message.includes('obligatorio') || error.message.includes('Ya existe') ? 400 : 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  // PUT /api/roles/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(idParam ?? '', 10);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }
      const { nombre, descripcion, activo } = req.body;
      const role = await this.updateRole.execute(id, { nombre, descripcion, activo });
      res.status(200).json({ success: true, data: role });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/roles/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(idParam ?? '', 10);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }
      await this.deleteRole.execute(id);
      res.status(200).json({ success: true, message: 'Rol eliminado correctamente.' });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }
}
