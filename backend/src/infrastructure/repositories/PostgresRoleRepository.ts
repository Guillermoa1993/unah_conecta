// ============================================================
// REPOSITORIO (IMPLEMENTACIÓN): PostgresRoleRepository
// Capa: Infrastructure
// Implementa RoleRepository usando PostgreSQL (pool de pg)
// ============================================================

import { RoleRepository } from '../../domain/repositories/RoleRepository';
import { Role, CreateRoleDTO, UpdateRoleDTO } from '../../domain/entities/Role';
import pool from '../database/db';

// Convierte la fila de postgres (snake_case) a la entidad (camelCase)
function rowToRole(row: any): Role {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    activo: row.activo,
    creadoEn: row.creado_en,
    actualizadoEn: row.actualizado_en,
  };
}

export class PostgresRoleRepository implements RoleRepository {

  async findAll(): Promise<Role[]> {
    const res = await pool.query(
      'SELECT * FROM roles ORDER BY id ASC'
    );
    return res.rows.map(rowToRole);
  }

  async findById(id: number): Promise<Role | null> {
    const res = await pool.query(
      'SELECT * FROM roles WHERE id = $1',
      [id]
    );
    return res.rows.length > 0 ? rowToRole(res.rows[0]) : null;
  }

  async findByName(nombre: string): Promise<Role | null> {
    const res = await pool.query(
      'SELECT * FROM roles WHERE nombre ILIKE $1',
      [nombre]
    );
    return res.rows.length > 0 ? rowToRole(res.rows[0]) : null;
  }

  async create(data: CreateRoleDTO): Promise<Role> {
    const res = await pool.query(
      `INSERT INTO roles (nombre, descripcion)
       VALUES ($1, $2)
       RETURNING *`,
      [data.nombre, data.descripcion ?? null]
    );
    return rowToRole(res.rows[0]);
  }

  async update(id: number, data: UpdateRoleDTO): Promise<Role | null> {
    // Construir SET dinámico solo con los campos enviados
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.nombre !== undefined)      { fields.push(`nombre = $${idx++}`);       values.push(data.nombre); }
    if (data.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`);  values.push(data.descripcion); }
    if (data.activo !== undefined)      { fields.push(`activo = $${idx++}`);       values.push(data.activo); }

    if (fields.length === 0) return this.findById(id);

    fields.push(`actualizado_en = NOW()`);
    values.push(id);

    const res = await pool.query(
      `UPDATE roles SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return res.rows.length > 0 ? rowToRole(res.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const res = await pool.query(
      'DELETE FROM roles WHERE id = $1',
      [id]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
