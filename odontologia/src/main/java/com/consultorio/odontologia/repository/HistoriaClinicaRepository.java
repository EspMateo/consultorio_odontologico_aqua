package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {
    HistoriaClinica findByPacienteId(Long pacienteId);
} 