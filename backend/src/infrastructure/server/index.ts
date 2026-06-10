import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// ── 📁 REUTICACIÓN CORRECTA DE DIRECTORIOS (Arquitectura Limpia) ──

// ── Repositorios (Infrastructure) ───────────────────────────
import { PostgresHealthRepository } from '../repositories/PostgresHealthRepository';
import { PostgresRoleRepository } from '../repositories/PostgresRoleRepository';
import { PostgresPermissionRepository } from '../repositories/PostgresPermissionRepository';

// ── Casos de Uso (Use Cases) ────────────────────────────────
import { GetHealthReport } from '../../use-cases/GetHealthReport';
import {
  GetAllRoles,
  GetRoleById,
  CreateRole,
  UpdateRole,
  DeleteRole,
} from '../../use-cases/RoleUseCases';
import {
  GetAllPermissions,
  GetPermissionById,
  CreatePermission,
  UpdatePermission,
  DeletePermission,
} from '../../use-cases/PermissionUseCases';

// ── Controladores (Interfaces / Controllers) ────────────────
import { HealthController } from '../../interfaces/controllers/HealthController';
import { RoleController } from '../../interfaces/controllers/RoleController';
import { PermissionController } from '../../interfaces/controllers/PermissionController';

const app = express();

// Convertimos a número para evitar errores de sobrecarga de métodos en Express y Docker
const PORT = Number(process.env.PORT) || 5000;

// CONFIGURACIÓN CORS: Acepta tanto solicitudes locales como de red
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ── Inyección de dependencias: Health ───────────────────────
const healthRepository = new PostgresHealthRepository();
const getHealthReport  = new GetHealthReport(healthRepository);
const healthController = new HealthController(getHealthReport);

// ── Inyección de dependencias: Roles ────────────────────────
const roleRepository = new PostgresRoleRepository();
const roleController = new RoleController(
  new GetAllRoles(roleRepository),
  new GetRoleById(roleRepository),
  new CreateRole(roleRepository),
  new UpdateRole(roleRepository),
  new DeleteRole(roleRepository)
);

// ── Inyección de dependencias: Permisos ─────────────────────
const permissionRepository = new PostgresPermissionRepository();
const permissionController = new PermissionController(
  new GetAllPermissions(permissionRepository),
  new GetPermissionById(permissionRepository),
  new CreatePermission(permissionRepository),
  new UpdatePermission(permissionRepository),
  new DeletePermission(permissionRepository)
);

// ── Rutas de la API ─────────────────────────────────────────

// Rutas: Health
app.get('/api/health', (req, res) => healthController.handle(req, res));

// Rutas: Roles
app.get   ('/api/roles',     (req, res) => roleController.getAll(req, res));
app.get   ('/api/roles/:id', (req, res) => roleController.getById(req, res));
app.post  ('/api/roles',     (req, res) => roleController.create(req, res));
app.put   ('/api/roles/:id', (req, res) => roleController.update(req, res));
app.delete('/api/roles/:id', (req, res) => roleController.delete(req, res));

// Rutas: Permisos
app.get   ('/api/permissions',     (req, res) => permissionController.getAll(req, res));
app.get   ('/api/permissions/:id', (req, res) => permissionController.getById(req, res));
app.post  ('/api/permissions',     (req, res) => permissionController.create(req, res));
app.put   ('/api/permissions/:id', (req, res) => permissionController.update(req, res));
app.delete('/api/permissions/:id', (req, res) => permissionController.delete(req, res));

// CONFIGURACIÓN DE ESCUCHA: Escuchando en la interfaz global '0.0.0.0' requerida por Docker containers
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor de UNAH Conecta corriendo con éxito en http://localhost:${PORT}`);
  console.log(`  ➔ http://localhost:${PORT}/api/health      → Estado del sistema`);
  console.log(`  ➔ http://localhost:${PORT}/api/roles       → CRUD de Roles listo`);
  console.log(`  ➔ http://localhost:${PORT}/api/permissions → CRUD de Permisos listo\n`);
});