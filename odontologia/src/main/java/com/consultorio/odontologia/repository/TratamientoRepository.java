package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TratamientoRepository extends JpaRepository<Tratamiento, Long> {
    
    /**
     * Busca todos los tratamientos de un paciente específico
     */
    List<Tratamiento> findByPacienteIdOrderByFechaInicioDesc(Long pacienteId);
    
    /**
     * Busca el tratamiento activo de un paciente
     */
    Optional<Tratamiento> findByPacienteIdAndActivoTrue(Long pacienteId);
    
    /**
     * Busca todos los tratamientos activos de un paciente
     */
    List<Tratamiento> findByPacienteIdAndActivoTrueOrderByFechaInicioDesc(Long pacienteId);
    
    /**
     * Busca todos los tratamientos inactivos de un paciente
     */
    List<Tratamiento> findByPacienteIdAndActivoFalseOrderByFechaInicioDesc(Long pacienteId);
    
    /**
     * Cuenta cuántos tratamientos activos tiene un paciente
     */
    long countByPacienteIdAndActivoTrue(Long pacienteId);
    
    /**
     * Cuenta todos los tratamientos de un paciente
     */
    long countByPacienteId(Long pacienteId);
    
    /**
     * Busca tratamientos por nombre (búsqueda parcial)
     */
    @Query("SELECT t FROM Tratamiento t WHERE t.paciente.id = :pacienteId AND LOWER(t.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Tratamiento> findByPacienteIdAndNombreContainingIgnoreCase(@Param("pacienteId") Long pacienteId, @Param("nombre") String nombre);
} 