package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PacienteDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class PacienteService {
    private static final Logger logger = LoggerFactory.getLogger(PacienteService.class);

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente registrarPaciente(PacienteDTO pacienteDTO) {
        Paciente paciente = new Paciente();
        if (pacienteDTO.getCedula() != null && !pacienteDTO.getCedula().trim().isEmpty()) {
            try {
                paciente.setCI(Long.parseLong(pacienteDTO.getCedula().trim()));
            } catch (NumberFormatException e) {
                throw new RuntimeException("La cédula debe ser un número válido");
            }
        } else {
            throw new RuntimeException("La cédula es obligatoria");
        }

        paciente.setName(pacienteDTO.getNombre());
        paciente.setLastname(pacienteDTO.getApellido());
        paciente.setGender(pacienteDTO.getSexo());
        paciente.setTelephone(pacienteDTO.getNumero() != null && !pacienteDTO.getNumero().isEmpty() ? Integer.parseInt(pacienteDTO.getNumero()) : 0);
        paciente.setEmail(pacienteDTO.getEmail());
        paciente.setDiagnosis(pacienteDTO.getConsulta());
        paciente.setGeneralMedicalHistory(pacienteDTO.getDireccion());
        paciente.setReleaseSummary(pacienteDTO.getFecha());
        paciente.setMedication("");
        paciente.setDentalHistory("");
        return pacienteRepository.save(paciente);
    }

    public List<Paciente> obtenerTodosLosPacientes() {
        return pacienteRepository.findAll();
    }

    public Paciente obtenerPacientePorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
    }

    public List<Paciente> buscarPacientes(String nombre, String apellido, String cedula) {
        List<Paciente> todosLosPacientes = pacienteRepository.findAll();
        
        return todosLosPacientes.stream()
            .filter(paciente -> {
                boolean coincideNombre = nombre != null && !nombre.isEmpty() && 
                                         (paciente.getName() != null && paciente.getName().toLowerCase().contains(nombre.toLowerCase()));
                boolean coincideApellido = apellido != null && !apellido.isEmpty() && 
                                          (paciente.getLastname() != null && paciente.getLastname().toLowerCase().contains(apellido.toLowerCase()));
                boolean coincideCedula = cedula != null && !cedula.isEmpty() && 
                                        (paciente.getCI() != null && paciente.getCI().toString().contains(cedula));

                // Si no se proporciona ningún término de búsqueda, mostrar todos los pacientes.
                // Si se proporciona, que coincida en al menos uno de los campos.
                return (nombre == null || nombre.isEmpty()) && (apellido == null || apellido.isEmpty()) && (cedula == null || cedula.isEmpty()) || 
                       coincideNombre || coincideApellido || coincideCedula;
            })
            .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarPaciente(Long id) {
        logger.info("Iniciando proceso de eliminación del paciente con ID: {}", id);
        
        try {
            if (id == null) {
                throw new IllegalArgumentException("El ID del paciente no puede ser nulo");
            }

            Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Intento de eliminar paciente no existente con ID: {}", id);
                    return new RuntimeException("Paciente no encontrado");
                });




            logger.info("Eliminando paciente con ID: {}", id);
            pacienteRepository.deleteById(id);
            logger.info("Paciente eliminado exitosamente con ID: {}", id);
        } catch (Exception e) {
            logger.error("Error al eliminar paciente con ID: {} - Error: {}", id, e.getMessage());
            throw new RuntimeException("Error al eliminar el paciente: " + e.getMessage());
        }
    }

    @Transactional
    public Paciente actualizarPaciente(Long id, PacienteDTO pacienteDTO) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        if (pacienteDTO.getCedula() != null && !pacienteDTO.getCedula().trim().isEmpty()) {
            try {
                paciente.setCI(Long.parseLong(pacienteDTO.getCedula().trim()));
            } catch (NumberFormatException e) {
                throw new RuntimeException("La cédula debe ser un número válido");
            }
        }

        if (pacienteDTO.getNombre() != null) paciente.setName(pacienteDTO.getNombre());
        if (pacienteDTO.getApellido() != null) paciente.setLastname(pacienteDTO.getApellido());
        if (pacienteDTO.getSexo() != null) paciente.setGender(pacienteDTO.getSexo());
        if (pacienteDTO.getNumero() != null && !pacienteDTO.getNumero().isEmpty()) {
            paciente.setTelephone(Integer.parseInt(pacienteDTO.getNumero()));
        }
        if (pacienteDTO.getEmail() != null) paciente.setEmail(pacienteDTO.getEmail());
        if (pacienteDTO.getConsulta() != null) paciente.setDiagnosis(pacienteDTO.getConsulta());
        if (pacienteDTO.getDireccion() != null) paciente.setGeneralMedicalHistory(pacienteDTO.getDireccion());
        if (pacienteDTO.getFecha() != null) paciente.setReleaseSummary(pacienteDTO.getFecha());

        return pacienteRepository.save(paciente);
    }

    public Optional<Paciente> findById(Long id) {
        return pacienteRepository.findById(id);
    }
}