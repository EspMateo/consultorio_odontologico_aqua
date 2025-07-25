package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {
    
    // Obtener todas las historias clínicas de un paciente ordenadas por fecha
    List<HistoriaClinica> findByPacienteIdOrderByFechaCreacionDesc(Long pacienteId);
    
    // Obtener la historia clínica más reciente de un paciente
    Optional<HistoriaClinica> findFirstByPacienteIdOrderByFechaCreacionDesc(Long pacienteId);
    
    // Obtener historia clínica por paciente y fecha específica
    @Query(value = "SELECT * FROM historia_clinica h WHERE h.paciente_id = :pacienteId AND CAST(h.fecha_creacion AS DATE) = :fecha ORDER BY h.fecha_creacion DESC LIMIT 1", nativeQuery = true)
    Optional<HistoriaClinica> findByPacienteIdAndFecha(@Param("pacienteId") Long pacienteId, @Param("fecha") LocalDate fecha);
    
    // Obtener la historia clínica más reciente de un paciente por fecha
    @Query(value = "SELECT * FROM historia_clinica h WHERE h.paciente_id = :pacienteId AND CAST(h.fecha_creacion AS DATE) = :fecha ORDER BY h.fecha_creacion DESC LIMIT 1", nativeQuery = true)
    Optional<HistoriaClinica> findMostRecentByPacienteIdAndFecha(@Param("pacienteId") Long pacienteId, @Param("fecha") LocalDate fecha);
    
    // Obtener fechas disponibles para un paciente
    @Query(value = "SELECT DISTINCT CAST(h.fecha_creacion AS DATE) FROM historia_clinica h WHERE h.paciente_id = :pacienteId ORDER BY CAST(h.fecha_creacion AS DATE) DESC", nativeQuery = true)
    List<String> findFechasDisponiblesByPacienteId(@Param("pacienteId") Long pacienteId);
    
    // Verificar si existe historia clínica para paciente y fecha
    @Query(value = "SELECT COUNT(*) > 0 FROM historia_clinica h WHERE h.paciente_id = :pacienteId AND CAST(h.fecha_creacion AS DATE) = :fecha", nativeQuery = true)
    boolean existsByPacienteIdAndFecha(@Param("pacienteId") Long pacienteId, @Param("fecha") LocalDate fecha);
    
    // Contar historias clínicas por paciente
    long countByPacienteId(Long pacienteId);
} 