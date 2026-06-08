import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// ── Health ──────────────────────────────────────────────────
import { PostgresHealthRepository } from '../repositories/PostgresHealthRepository';
import { GetHealthReport } from '../../use-cases/GetHealthReport';
import { HealthController } from '../../interfaces/controllers/HealthController';

// ── Roles ───────────────────────────────────────────────────
import { PostgresRoleRepository } from '../repositories/PostgresRoleRepository';
import {
  GetAllRoles,
  GetRoleById,
  CreateRole,
  UpdateRole,
  DeleteRole,
} from '../../use-cases/RoleUseCases';
import { RoleController } from '../../interfaces/controllers/RoleController';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Configuración de CORS Obligatoria para Docker ───────────
app.use(cors({
  origin: 'http://localhost:5173', // Permite el acceso al Frontend de Vite
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

// ── Rutas: Health ───────────────────────────────────────────
app.get('/api/health', (req, res) => healthController.handle(req, res));

// ── Rutas: Roles (CRUD completo) ────────────────────────────
app.get   ('/api/roles',     (req, res) => roleController.getAll(req, res));
app.get   ('/api/roles/:id', (req, res) => roleController.getById(req, res));
app.post  ('/api/roles',     (req, res) => roleController.create(req, res));
app.put   ('/api/roles/:id', (req, res) => roleController.update(req, res));
app.delete('/api/roles/:id', (req, res) => roleController.delete(req, res));

// ── Inicialización del Servidor ─────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor de UNAH Conecta corriendo en http://localhost:${PORT}`);
  console.log(`  ➔ http://localhost:${PORT}/api/health      → Estado del sistema`);
  console.log(`  ➔ http://localhost:${PORT}/api/roles       → CRUD de Roles listo\n`);
});