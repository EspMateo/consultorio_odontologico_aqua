package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Periodoncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PeriodonciaRepository extends JpaRepository<Periodoncia, Long> {
    
    // Buscar todas las periodoncias de un paciente
    List<Periodoncia> findByPacienteIdOrderByFechaRegistroDesc(Long pacienteId);
    
    // Buscar periodoncia por paciente y fecha específica
    Optional<Periodoncia> findByPacienteIdAndFechaRegistro(Long pacienteId, LocalDate fechaRegistro);
    
    // Buscar la periodoncia más reciente de un paciente
    @Query("SELECT p FROM Periodoncia p WHERE p.paciente.id = :pacienteId ORDER BY p.fechaRegistro DESC")
    Optional<Periodoncia> findMostRecentByPacienteId(@Param("pacienteId") Long pacienteId);
    
    // Verificar si existe una periodoncia para un paciente en una fecha específica
    boolean existsByPacienteIdAndFechaRegistro(Long pacienteId, LocalDate fechaRegistro);
    
    // Obtener fechas disponibles para un paciente
    @Query("SELECT p.fechaRegistro FROM Periodoncia p WHERE p.paciente.id = :pacienteId ORDER BY p.fechaRegistro DESC")
    List<LocalDate> findFechasByPacienteId(@Param("pacienteId") Long pacienteId);
} 