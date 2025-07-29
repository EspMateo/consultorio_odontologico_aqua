-- Script para crear la tabla de tratamientos
-- Ejecutar este script en la base de datos

CREATE TABLE IF NOT EXISTS tratamientos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    seguimiento VARCHAR(100),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    paciente_id BIGINT NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tratamientos_paciente_id ON tratamientos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_tratamientos_activo ON tratamientos(activo);
CREATE INDEX IF NOT EXISTS idx_tratamientos_fecha_inicio ON tratamientos(fecha_inicio); 