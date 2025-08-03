-- Script para crear la tabla de diagnósticos
-- Ejecutar este script en la base de datos

CREATE TABLE IF NOT EXISTS diagnosticos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    diagnostico TEXT NOT NULL,
    pronostico TEXT NOT NULL,
    observaciones TEXT,
    fecha_diagnostico DATE NOT NULL,
    paciente_id BIGINT NOT NULL,
    usuario_id BIGINT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_diagnosticos_paciente_id ON diagnosticos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_fecha_diagnostico ON diagnosticos(fecha_diagnostico);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_usuario_id ON diagnosticos(usuario_id); 