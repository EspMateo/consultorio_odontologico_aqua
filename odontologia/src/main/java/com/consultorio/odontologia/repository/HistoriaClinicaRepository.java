package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {

    Optional<HistoriaClinica> findById(Long id);


}

