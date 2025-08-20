package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.CitaDTO;
import com.consultorio.odontologia.entity.Cita;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.CitaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.UsuarioRepository;
import com.consultorio.odontologia.service.util.DTOConverter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CitaServiceTest {

    @Mock
    private CitaRepository citaRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private CitaService citaService;

    private Paciente paciente;
    private Usuario usuario;
    private Cita cita;
    private CitaDTO citaDTO;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setName("Dr. García");
        usuario.setEmail("dr.garcia@consultorio.com");

        cita = new Cita();
        cita.setId(1L);
        cita.setPaciente(paciente);
        cita.setFecha(LocalDate.of(2024, 1, 15));
        cita.setHora(LocalTime.of(9, 0));
        cita.setMotivo("Consulta general");
        cita.setUsuario(usuario);

        citaDTO = new CitaDTO();
        citaDTO.setPaciente(paciente);
        citaDTO.setFecha("2024-01-15");
        citaDTO.setHora("09:00");
        citaDTO.setMotivo("Consulta general");
        citaDTO.setUsuarioId(1L);
    }

    @Test
    void testCrearCita_Success() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(citaRepository.save(any(Cita.class))).thenReturn(cita);

        // Act
        Cita resultado = citaService.crearCita(citaDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals(paciente, resultado.getPaciente());
        assertEquals(LocalDate.of(2024, 1, 15), resultado.getFecha());
        assertEquals(LocalTime.of(9, 0), resultado.getHora());
        assertEquals("Consulta general", resultado.getMotivo());
        assertEquals(usuario, resultado.getUsuario());

        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(citaRepository).save(any(Cita.class));
    }

    @Test
    void testCrearCita_PacienteNoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            citaService.crearCita(citaDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository, never()).findById(any());
        verify(citaRepository, never()).save(any());
    }

    @Test
    void testCrearCita_UsuarioNoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            citaService.crearCita(citaDTO);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(citaRepository, never()).save(any());
    }

    @Test
    void testObtenerTodasLasCitas_Success() {
        // Arrange
        List<Cita> citas = Arrays.asList(cita);
        when(citaRepository.findAllWithPaciente()).thenReturn(citas);

        // Act
        List<CitaDTO> resultado = citaService.obtenerTodasLasCitas();

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(citaRepository).findAllWithPaciente();
    }

    @Test
    void testObtenerCitasPorFecha_Success() {
        // Arrange
        String fecha = "2024-01-15";
        List<Cita> citas = Arrays.asList(cita);
        when(citaRepository.findByFechaWithPaciente(LocalDate.of(2024, 1, 15))).thenReturn(citas);

        // Act
        List<CitaDTO> resultado = citaService.obtenerCitasPorFecha(fecha);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(citaRepository).findByFechaWithPaciente(LocalDate.of(2024, 1, 15));
    }

    @Test
    void testEliminarCita_Success() {
        // Arrange
        when(citaRepository.findById(1L)).thenReturn(Optional.of(cita));
        doNothing().when(citaRepository).delete(cita);

        // Act
        assertDoesNotThrow(() -> citaService.eliminarCita(1L));

        // Assert
        verify(citaRepository).findById(1L);
        verify(citaRepository).delete(cita);
    }

    @Test
    void testEliminarCita_NoEncontrada() {
        // Arrange
        when(citaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            citaService.eliminarCita(1L);
        });

        assertEquals("Cita no encontrada con ID: 1", exception.getMessage());
        verify(citaRepository).findById(1L);
        verify(citaRepository, never()).delete(any());
    }

    @Test
    void testActualizarCita_Success() {
        // Arrange
        CitaDTO dtoActualizado = new CitaDTO();
        dtoActualizado.setPaciente(paciente);
        dtoActualizado.setFecha("2024-01-16");
        dtoActualizado.setHora("10:00");
        dtoActualizado.setMotivo("Seguimiento");
        dtoActualizado.setUsuarioId(1L);

        when(citaRepository.findById(1L)).thenReturn(Optional.of(cita));
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(citaRepository.save(any(Cita.class))).thenReturn(cita);

        // Act
        Cita resultado = citaService.actualizarCita(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(citaRepository).findById(1L);
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(citaRepository).save(cita);
    }

    @Test
    void testActualizarCita_CitaNoEncontrada() {
        // Arrange
        when(citaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            citaService.actualizarCita(1L, citaDTO);
        });

        assertEquals("Cita no encontrada con ID: 1", exception.getMessage());
        verify(citaRepository).findById(1L);
        verify(pacienteRepository, never()).findById(any());
        verify(usuarioRepository, never()).findById(any());
        verify(citaRepository, never()).save(any());
    }

    @Test
    void testActualizarCita_PacienteNoEncontrado() {
        // Arrange
        when(citaRepository.findById(1L)).thenReturn(Optional.of(cita));
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            citaService.actualizarCita(1L, citaDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(citaRepository).findById(1L);
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository, never()).findById(any());
        verify(citaRepository, never()).save(any());
    }

    @Test
    void testActualizarCita_UsuarioNoEncontrado() {
        // Arrange
        when(citaRepository.findById(1L)).thenReturn(Optional.of(cita));
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            citaService.actualizarCita(1L, citaDTO);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(citaRepository).findById(1L);
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(citaRepository, never()).save(any());
    }
}
