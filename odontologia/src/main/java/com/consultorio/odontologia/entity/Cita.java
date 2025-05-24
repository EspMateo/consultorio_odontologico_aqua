package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;


@Entity
@Table(name = "Citas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pacienteId")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "usuarioId") // clave foránea en la tabla 'cita'
    private Usuario usuario; // odontólogo asignado a esta cita

    private Date fecha;


}
