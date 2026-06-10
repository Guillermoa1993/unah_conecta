-- ============================================================
-- MÓDULO DE SEGURIDAD - UNAH CONECTA
-- Tablas: permisos + rol_permisos
-- ============================================================

CREATE TABLE IF NOT EXISTS permisos (
  id_permisos    SERIAL PRIMARY KEY,
  nombre_permiso VARCHAR(100) NOT NULL UNIQUE,
  modulo         VARCHAR(50)  NOT NULL,
  descripcion    TEXT,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permisos_modulo ON permisos(modulo);
CREATE INDEX IF NOT EXISTS idx_permisos_activo ON permisos(activo);

CREATE TABLE IF NOT EXISTS rol_permisos (
  id_rol     INTEGER REFERENCES roles(id)           ON DELETE CASCADE,
  id_permiso INTEGER REFERENCES permisos(id_permisos) ON DELETE CASCADE,
  PRIMARY KEY (id_rol, id_permiso)
);

CREATE INDEX IF NOT EXISTS idx_rol_permisos_rol     ON rol_permisos(id_rol);
CREATE INDEX IF NOT EXISTS idx_rol_permisos_permiso ON rol_permisos(id_permiso);

-- Datos iniciales
INSERT INTO permisos (nombre_permiso, modulo, descripcion) VALUES
  ('ver_roles',       'seguridad', 'Puede visualizar la lista de roles del sistema'),
  ('crear_roles',     'seguridad', 'Puede crear nuevos roles en el sistema'),
  ('editar_roles',    'seguridad', 'Puede modificar roles existentes'),
  ('eliminar_roles',  'seguridad', 'Puede eliminar roles del sistema'),
  ('ver_permisos',    'seguridad', 'Puede visualizar permisos del sistema'),
  ('crear_permisos',  'seguridad', 'Puede crear nuevos permisos'),
  ('editar_permisos', 'seguridad', 'Puede modificar permisos existentes'),
  ('eliminar_permisos','seguridad','Puede eliminar permisos del sistema'),
  ('ver_usuarios',    'usuarios',  'Puede visualizar la lista de usuarios'),
  ('crear_usuarios',  'usuarios',  'Puede registrar nuevos usuarios'),
  ('editar_usuarios', 'usuarios',  'Puede modificar datos de usuarios'),
  ('eliminar_usuarios','usuarios', 'Puede eliminar usuarios del sistema'),
  ('ver_cursos',      'cursos',    'Puede visualizar cursos disponibles'),
  ('crear_cursos',    'cursos',    'Puede publicar nuevos cursos'),
  ('editar_cursos',   'cursos',    'Puede modificar cursos existentes'),
  ('eliminar_cursos', 'cursos',    'Puede eliminar cursos del sistema'),
  ('ver_bitacora',    'seguridad', 'Puede consultar el registro de actividad'),
  ('gestionar_backup','seguridad', 'Puede generar y consultar respaldos')
ON CONFLICT (nombre_permiso) DO NOTHING;

-- Asignar todos los permisos al Administrador (id=1)
INSERT INTO rol_permisos (id_rol, id_permiso)
  SELECT 1, id_permisos FROM permisos
ON CONFLICT DO NOTHING;

-- Asignar permisos básicos al Docente (id=2)
INSERT INTO rol_permisos (id_rol, id_permiso)
  SELECT 2, id_permisos FROM permisos
  WHERE nombre_permiso IN ('ver_cursos','crear_cursos','editar_cursos','ver_usuarios')
ON CONFLICT DO NOTHING;

-- Asignar permisos básicos al Estudiante (id=3)
INSERT INTO rol_permisos (id_rol, id_permiso)
  SELECT 3, id_permisos FROM permisos
  WHERE nombre_permiso IN ('ver_cursos','ver_usuarios')
ON CONFLICT DO NOTHING;

-- Asignar permisos al Moderador (id=4)
INSERT INTO rol_permisos (id_rol, id_permiso)
  SELECT 4, id_permisos FROM permisos
  WHERE nombre_permiso IN ('ver_cursos','editar_cursos','ver_usuarios','ver_roles','ver_permisos')
ON CONFLICT DO NOTHING;

-- Asignar permisos al Auditor (id=5)
INSERT INTO rol_permisos (id_rol, id_permiso)
  SELECT 5, id_permisos FROM permisos
  WHERE nombre_permiso IN ('ver_roles','ver_permisos','ver_usuarios','ver_bitacora')
ON CONFLICT DO NOTHING;
