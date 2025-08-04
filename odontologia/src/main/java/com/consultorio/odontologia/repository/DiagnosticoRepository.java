package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Diagnostico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiagnosticoRepository extends JpaRepository<Diagnostico, Long> {
    
    /**
     * Busca el diagnóstico más reciente de un paciente
     */
    Optional<Diagnostico> findFirstByPacienteIdOrderByFechaDiagnosticoDesc(Long pacienteId);
    
    /**
     * Busca todos los diagnósticos de un paciente ordenados por fecha
     */
    List<Diagnostico> findByPacienteIdOrderByFechaDiagnosticoDesc(Long pacienteId);
    
    /**
     * Busca diagnósticos por paciente y fecha específica
     */
    List<Diagnostico> findByPacienteIdAndFechaDiagnostico(Long pacienteId, java.time.LocalDate fechaDiagnostico);
    
    /**
     * Cuenta cuántos diagnósticos tiene un paciente
     */
    long countByPacienteId(Long pacienteId);
    
    /**
     * Busca diagnósticos por contenido del diagnóstico (búsqueda parcial)
     */
    @Query("SELECT d FROM Diagnostico d WHERE d.paciente.id = :pacienteId AND LOWER(d.diagnostico) LIKE LOWER(CONCAT('%', :contenido, '%'))")
    List<Diagnostico> findByPacienteIdAndDiagnosticoContainingIgnoreCase(@Param("pacienteId") Long pacienteId, @Param("contenido") String contenido);
    
    /**
     * Busca diagnósticos por contenido del pronóstico (búsqueda parcial)
     */
    @Query("SELECT d FROM Diagnostico d WHERE d.paciente.id = :pacienteId AND LOWER(d.pronostico) LIKE LOWER(CONCAT('%', :contenido, '%'))")
    List<Diagnostico> findByPacienteIdAndPronosticoContainingIgnoreCase(@Param("pacienteId") Long pacienteId, @Param("contenido") String contenido);
} 