package com.consultorio.odontologia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoPresupuestoDTO {

    private Long id;
    private String nombre;
    private Integer precio;
    private Integer abonado;
    private Boolean pagado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaUltimaActualizacion;

    // Método para calcular la deuda restante
    public Integer getDeuda() {
        return precio - abonado;
    }

    // Método para verificar si está completamente pagado
    public Boolean isCompletamentePagado() {
        return abonado >= precio;
    }

    // Constructor sin fechas para compatibilidad
    public TratamientoPresupuestoDTO(Long id, String nombre, Integer precio, Integer abonado, Boolean pagado) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.abonado = abonado;
        this.pagado = pagado;
    }
} 