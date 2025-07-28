package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {

    // Buscar presupuestos por paciente
    List<Presupuesto> findByPacienteIdOrderByFechaRegistroDesc(Long pacienteId);

    // Buscar presupuesto por paciente y fecha
    @Query("SELECT p FROM Presupuesto p WHERE p.paciente.id = :pacienteId AND p.fechaRegistro = :fecha")
    Presupuesto findByPacienteIdAndFechaRegistro(@Param("pacienteId") Long pacienteId, @Param("fecha") LocalDate fecha);

    // Buscar fechas disponibles para un paciente
    @Query("SELECT DISTINCT p.fechaRegistro FROM Presupuesto p WHERE p.paciente.id = :pacienteId ORDER BY p.fechaRegistro DESC")
    List<LocalDate> findFechasDisponiblesByPacienteId(@Param("pacienteId") Long pacienteId);

    // Verificar si existe un presupuesto para un paciente en una fecha específica
    boolean existsByPacienteIdAndFechaRegistro(Long pacienteId, LocalDate fechaRegistro);

    // Contar presupuestos por paciente
    long countByPacienteId(Long pacienteId);
} 