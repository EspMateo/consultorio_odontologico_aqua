package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "presupuestos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Presupuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @JsonIgnore
    private Paciente paciente;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    @OneToMany(mappedBy = "presupuesto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TratamientoPresupuesto> tratamientos;

    // Constructor sin ID para crear nuevos presupuestos
    public Presupuesto(Paciente paciente, LocalDate fechaRegistro) {
        this.paciente = paciente;
        this.fechaRegistro = fechaRegistro;
        this.tratamientos = new ArrayList<>();
    }

    // Métodos helper para la relación bidireccional
    public void addTratamiento(TratamientoPresupuesto tratamiento) {
        if (tratamientos == null) {
            tratamientos = new ArrayList<>();
        }
        tratamientos.add(tratamiento);
        tratamiento.setPresupuesto(this);
    }

    public void removeTratamiento(TratamientoPresupuesto tratamiento) {
        if (tratamientos != null) {
            tratamientos.remove(tratamiento);
        }
        tratamiento.setPresupuesto(null);
    }
} 