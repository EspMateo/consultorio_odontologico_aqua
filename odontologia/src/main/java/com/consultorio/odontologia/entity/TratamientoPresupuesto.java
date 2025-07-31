package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tratamientos_presupuesto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoPresupuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "abonado", nullable = false, precision = 10, scale = 2)
    private BigDecimal abonado;

    @Column(name = "pagado", nullable = false)
    private Boolean pagado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "presupuesto_id", nullable = false)
    @JsonIgnore
    private Presupuesto presupuesto;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_ultima_actualizacion")
    private LocalDateTime fechaUltimaActualizacion;

    // Constructor sin ID para crear nuevos tratamientos
    public TratamientoPresupuesto(String nombre, BigDecimal precio, BigDecimal abonado, Boolean pagado) {
        this.nombre = nombre;
        this.precio = precio;
        this.abonado = abonado;
        this.pagado = pagado;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaUltimaActualizacion = LocalDateTime.now();
    }

    // Constructor sobrecargado para compatibilidad con Integer
    public TratamientoPresupuesto(String nombre, Integer precio, Integer abonado, Boolean pagado) {
        this.nombre = nombre;
        this.precio = BigDecimal.valueOf(precio);
        this.abonado = BigDecimal.valueOf(abonado);
        this.pagado = pagado;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaUltimaActualizacion = LocalDateTime.now();
    }

    // Método para calcular la deuda restante
    public BigDecimal getDeuda() {
        return precio.subtract(abonado);
    }

    // Método para verificar si está completamente pagado
    public Boolean isCompletamentePagado() {
        return abonado.compareTo(precio) >= 0;
    }

    // Método para actualizar el pago
    public void actualizarPago(BigDecimal nuevoAbonado) {
        this.abonado = nuevoAbonado;
        this.fechaUltimaActualizacion = LocalDateTime.now();
        this.pagado = (abonado.compareTo(precio) >= 0);
    }

    // Método sobrecargado para compatibilidad con Integer
    public void actualizarPago(Integer nuevoAbonado) {
        actualizarPago(BigDecimal.valueOf(nuevoAbonado));
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

    public Presupuesto getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(Presupuesto presupuesto) {
        this.presupuesto = presupuesto;
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