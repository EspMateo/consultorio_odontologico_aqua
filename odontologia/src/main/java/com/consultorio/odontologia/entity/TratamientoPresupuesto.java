package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(name = "precio", nullable = false)
    private Integer precio;

    @Column(name = "abonado", nullable = false)
    private Integer abonado;

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
    public TratamientoPresupuesto(String nombre, Integer precio, Integer abonado, Boolean pagado) {
        this.nombre = nombre;
        this.precio = precio;
        this.abonado = abonado;
        this.pagado = pagado;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaUltimaActualizacion = LocalDateTime.now();
    }

    // Método para calcular la deuda restante
    public Integer getDeuda() {
        return precio - abonado;
    }

    // Método para verificar si está completamente pagado
    public Boolean isCompletamentePagado() {
        return abonado >= precio;
    }

    // Método para actualizar el pago
    public void actualizarPago(Integer nuevoAbonado) {
        this.abonado = nuevoAbonado;
        this.fechaUltimaActualizacion = LocalDateTime.now();
        this.pagado = (abonado >= precio);
    }
} 