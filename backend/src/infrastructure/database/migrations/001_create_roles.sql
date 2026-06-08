-- ============================================================
-- MÓDULO DE SEGURIDAD - UNAH CONECTA
-- Tabla: roles
-- Autor: Módulo de Seguridad
-- Fecha: 2026
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_roles_nombre ON roles(nombre);
CREATE INDEX IF NOT EXISTS idx_roles_activo  ON roles(activo);

-- Datos iniciales (seed)
INSERT INTO roles (nombre, descripcion) VALUES
  ('Administrador',  'Acceso total al sistema. Gestiona usuarios, roles y configuraciones.'),
  ('Docente',        'Puede crear y gestionar cursos avalados por la UNAH.'),
  ('Estudiante',     'Puede inscribirse y participar en cursos disponibles.'),
  ('Moderador',      'Revisa y aprueba contenidos antes de su publicación.'),
  ('Auditor',        'Solo lectura. Accede a bitácoras y reportes del sistema.')
ON CONFLICT (nombre) DO NOTHING;
