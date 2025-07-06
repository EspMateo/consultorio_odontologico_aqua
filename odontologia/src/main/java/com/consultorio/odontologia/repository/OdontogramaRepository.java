package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Odontograma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OdontogramaRepository extends JpaRepository<Odontograma, Long> {
    
    // Buscar todos los odontogramas de un paciente ordenados por fecha (más reciente primero)
    List<Odontograma> findByPacienteIdOrderByFechaCreacionDesc(Long pacienteId);
    
    // Buscar un odontograma específico por paciente y fecha
    Optional<Odontograma> findByPacienteIdAndFechaCreacion(Long pacienteId, LocalDateTime fechaCreacion);
    
    // Buscar odontogramas por tipo de dentición
    List<Odontograma> findByPacienteIdAndTipoDenticion(Long pacienteId, String tipoDenticion);
    
    // Contar odontogramas de un paciente
    long countByPacienteId(Long pacienteId);
} 