package com.consultorio.odontologia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoPresupuestoDTO {

    private Long id;
    private String nombre;
    private BigDecimal precio;
    private BigDecimal abonado;
    private Boolean pagado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaUltimaActualizacion;

    // Método para calcular la deuda restante
    public BigDecimal getDeuda() {
        return precio.subtract(abonado);
    }

    // Método para verificar si está completamente pagado
    public Boolean isCompletamentePagado() {
        return abonado.compareTo(precio) >= 0;
    }

    // Constructor sin fechas para compatibilidad
    public TratamientoPresupuestoDTO(Long id, String nombre, BigDecimal precio, BigDecimal abonado, Boolean pagado) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.abonado = abonado;
        this.pagado = pagado;
    }

    // Constructor sobrecargado para compatibilidad con Integer
    public TratamientoPresupuestoDTO(Long id, String nombre, Integer precio, Integer abonado, Boolean pagado) {
        this.id = id;
        this.nombre = nombre;
        this.precio = BigDecimal.valueOf(precio);
        this.abonado = BigDecimal.valueOf(abonado);
        this.pagado = pagado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public BigDecimal getAbonado() {
        return abonado;
    }

    public void setAbonado(BigDecimal abonado) {
        this.abonado = abonado;
    }

    public Boolean getPagado() {
        return pagado;
    }

    public void setPagado(Boolean pagado) {
        this.pagado = pagado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaUltimaActualizacion() {
        return fechaUltimaActualizacion;
    }

    public void setFechaUltimaActualizacion(LocalDateTime fechaUltimaActualizacion) {
        this.fechaUltimaActualizacion = fechaUltimaActualizacion;
    }
}