package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Periodontograma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PeriodontogramaRepository extends JpaRepository<Periodontograma, Long> {
    
    // Buscar todos los periodontogramas de un paciente
    List<Periodontograma> findByPacienteIdOrderByFechaCreacionDesc(Long pacienteId);
    
    // Buscar periodontograma por paciente y fecha específica
    Optional<Periodontograma> findByPacienteIdAndFechaRegistro(Long pacienteId, String fechaRegistro);
    
    // Buscar el periodontograma más reciente de un paciente
    @Query("SELECT p FROM Periodontograma p WHERE p.paciente.id = :pacienteId ORDER BY p.fechaCreacion DESC")
    Optional<Periodontograma> findMostRecentByPacienteId(@Param("pacienteId") Long pacienteId);
    
    // Verificar si existe un periodontograma para un paciente en una fecha específica
    boolean existsByPacienteIdAndFechaRegistro(Long pacienteId, String fechaRegistro);
    
    // Obtener fechas disponibles para un paciente
    @Query("SELECT p.fechaRegistro FROM Periodontograma p WHERE p.paciente.id = :pacienteId ORDER BY p.fechaRegistro DESC")
    List<String> findFechasByPacienteId(@Param("pacienteId") Long pacienteId);
} 