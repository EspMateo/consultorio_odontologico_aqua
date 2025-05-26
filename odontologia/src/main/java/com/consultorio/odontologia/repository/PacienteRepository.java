package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    boolean existsByCI(Long CI);
} 