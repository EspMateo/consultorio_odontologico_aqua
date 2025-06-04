package com.consultorio.odontologia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaDTO {
    private Long id;
    private Long pacienteId;
    private String fecha;
    private String hora;
    private String motivo;
    private Long usuarioId;
} 