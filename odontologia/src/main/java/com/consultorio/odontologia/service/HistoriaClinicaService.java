package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.HistoriaClinica;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.HistoriaClinicaRepository;
import org.hibernate.boot.model.source.spi.HibernateTypeSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class HistoriaClinicaService {

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    public Optional<HistoriaClinica> buscarHistoriaClinica (Long id){
        return historiaClinicaRepository.findById(id);
    }

    public HistoriaClinica save(HistoriaClinica hc) {
        return historiaClinicaRepository.save(hc);

    }

}
