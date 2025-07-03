package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByFecha(LocalDate fecha);
    List<Cita> findByPacienteId(Long pacienteId);
    
    @Query("SELECT c FROM Cita c LEFT JOIN FETCH c.paciente LEFT JOIN FETCH c.usuario WHERE c.fecha = :fecha")
    List<Cita> findByFechaWithPaciente(LocalDate fecha);
    
    @Query("SELECT c FROM Cita c LEFT JOIN FETCH c.paciente LEFT JOIN FETCH c.usuario")
    List<Cita> findAllWithPaciente();
} 