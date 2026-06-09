-- ============================================================
-- CONECTAPUMAS — Módulos: Acceso + Admin
-- Migración 002: 9 tablas nuevas
-- PostgreSQL
-- Autenticación: Microsoft OAuth2 (SSO) sin contraseña
-- ============================================================

-- ============================================================
-- MÓDULO DE ACCESO — Login y enrolamiento
-- ============================================================

CREATE TABLE IF NOT EXISTS tipo_usuario (
    id_tipo_usuario SERIAL      PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL,
    descripcion     VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS estado_usuario (
    id_estado SERIAL      PRIMARY KEY,
    nombre    VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario           SERIAL       PRIMARY KEY,
    numero_cuenta        VARCHAR(20)  NOT NULL UNIQUE,
    correo_institucional VARCHAR(150) NOT NULL UNIQUE,
    correo_personal      VARCHAR(150),
    microsoft_oid        VARCHAR(255) NOT NULL UNIQUE,
    primer_nombre        VARCHAR(60)  NOT NULL,
    segundo_nombre       VARCHAR(60),
    primer_apellido      VARCHAR(60)  NOT NULL,
    segundo_apellido     VARCHAR(60),
    numero_identidad     VARCHAR(20),
    telefono             VARCHAR(20),
    id_tipo_usuario      INTEGER      NOT NULL
                         REFERENCES tipo_usuario(id_tipo_usuario),
    id_estado            INTEGER      NOT NULL
                         REFERENCES estado_usuario(id_estado),
    ultimo_login         TIMESTAMP,
    fecha_creacion       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Token generado por tu sistema tras validar con Microsoft
CREATE TABLE IF NOT EXISTS sesion (
    id_sesion    SERIAL       PRIMARY KEY,
    id_usuario   INTEGER      NOT NULL
                 REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token        VARCHAR(255) NOT NULL UNIQUE,
    fecha_inicio TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Se llena una sola vez al enrolarse (primer login)
CREATE TABLE IF NOT EXISTS ficha_estudiante (
    id_ficha              SERIAL       PRIMARY KEY,
    id_usuario            INTEGER      NOT NULL UNIQUE
                          REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    nombre_carrera        VARCHAR(150) NOT NULL,
    nombre_facultad       VARCHAR(150) NOT NULL,
    anio_ingreso          INTEGER,
    indice_global         NUMERIC(5,2),
    horas_voae_acumuladas NUMERIC(6,2) NOT NULL DEFAULT 0
);

-- ============================================================
-- MÓDULO ADMIN — Parámetros y gestor de notificaciones
-- ============================================================

CREATE TABLE IF NOT EXISTS parametros (
    id_clave SERIAL       PRIMARY KEY,
    clave    VARCHAR(100) NOT NULL UNIQUE,
    valor    VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tipo_notificacion (
    id_tipo_notificacion SERIAL       PRIMARY KEY,
    nombre               VARCHAR(100) NOT NULL,
    descripcion          VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id_notificacion      SERIAL       PRIMARY KEY,
    id_usuario           INTEGER      NOT NULL
                         REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_tipo_notificacion INTEGER      NOT NULL
                         REFERENCES tipo_notificacion(id_tipo_notificacion),
    titulo               VARCHAR(200) NOT NULL,
    mensaje              VARCHAR(500) NOT NULL,
    leida                BOOLEAN      NOT NULL DEFAULT FALSE,
    fecha_lectura        TIMESTAMP,
    fecha_creacion       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bitacora (
    id_bitacora     SERIAL       PRIMARY KEY,
    id_usuario      INTEGER      NOT NULL
                    REFERENCES usuario(id_usuario),
    id_notificacion INTEGER
                    REFERENCES notificaciones(id_notificacion),
    accion          VARCHAR(100) NOT NULL,
    tabla_afectada  VARCHAR(100),
    registro_id     INTEGER,
    descripcion     VARCHAR(255),
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(255),
    fecha           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_usuario_correo   ON usuario(correo_institucional);
CREATE INDEX IF NOT EXISTS idx_usuario_oid      ON usuario(microsoft_oid);
CREATE INDEX IF NOT EXISTS idx_usuario_tipo     ON usuario(id_tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuario_estado   ON usuario(id_estado);
CREATE INDEX IF NOT EXISTS idx_sesion_usuario   ON sesion(id_usuario);
CREATE INDEX IF NOT EXISTS idx_sesion_token     ON sesion(token);
CREATE INDEX IF NOT EXISTS idx_ficha_usuario    ON ficha_estudiante(id_usuario);
CREATE INDEX IF NOT EXISTS idx_notif_usuario    ON notificaciones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_notif_leida      ON notificaciones(leida) WHERE leida = FALSE;
CREATE INDEX IF NOT EXISTS idx_notif_tipo       ON notificaciones(id_tipo_notificacion);
CREATE INDEX IF NOT EXISTS idx_bitacora_usuario ON bitacora(id_usuario);
CREATE INDEX IF NOT EXISTS idx_bitacora_fecha   ON bitacora(fecha);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO tipo_usuario (nombre, descripcion)
SELECT * FROM (VALUES
    ('Estudiante',       'Estudiante activo de la UNAH'),
    ('Docente',          'Docente o catedrático'),
    ('Administrativo',   'Personal administrativo'),
    ('Coordinador VOAE', 'Personal de la VOAE')
) AS v(nombre, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM tipo_usuario LIMIT 1);

INSERT INTO estado_usuario (nombre)
SELECT * FROM (VALUES
    ('Activo'),
    ('Bloqueado'),
    ('Inactivo')
) AS v(nombre)
WHERE NOT EXISTS (SELECT 1 FROM estado_usuario LIMIT 1);

INSERT INTO tipo_notificacion (nombre, descripcion)
SELECT * FROM (VALUES
    ('Evento aprobado',        'Notificación de aprobación de evento'),
    ('Evento rechazado',       'Notificación de rechazo de evento'),
    ('Inscripción confirmada', 'Confirmación de inscripción a evento'),
    ('Certificado disponible', 'Certificado de participación listo'),
    ('Recordatorio de evento', 'Recordatorio de evento próximo')
) AS v(nombre, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM tipo_notificacion LIMIT 1);

INSERT INTO parametros (clave, valor)
SELECT * FROM (VALUES
    ('dominio_correo_1',        'unah.hn'),
    ('dominio_correo_2',        'unah.edu.hn'),
    ('horas_voae_meta_default', '100'),
    ('token_expiracion_horas',  '8')
) AS v(clave, valor)
WHERE NOT EXISTS (SELECT 1 FROM parametros LIMIT 1);
