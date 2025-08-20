package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.HistoriaClinica;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.HistoriaClinicaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HistoriaClinicaServiceTest {

    @Mock
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private HistoriaClinicaService historiaClinicaService;

    private Paciente paciente;
    private Usuario usuario;
    private HistoriaClinica historiaClinica;
    private HistoriaClinica historiaClinicaActualizada;

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

        historiaClinica = new HistoriaClinica();
        historiaClinica.setId(1L);
        historiaClinica.setPaciente(paciente);
        historiaClinica.setUsuario(usuario);
        historiaClinica.setMotivoConsulta("Dolor dental");
        historiaClinica.setCepilladoDental("2 veces al día");
        historiaClinica.setCepilladoEncias("Sí");
        historiaClinica.setCepilladoLingual("No");
        historiaClinica.setObservacionesHigienicas("Buena higiene");
        historiaClinica.setUsaHiloDental(true);
        historiaClinica.setHigieneProtesica(false);
        historiaClinica.setFumador(false);
        historiaClinica.setConsumeCafe(true);
        historiaClinica.setConsumeTe(false);
        historiaClinica.setConsumeMate(false);
        historiaClinica.setConsumeAlcohol(false);
        historiaClinica.setConsumeDrogas(false);
        historiaClinica.setEnfermedadesActuales("Ninguna");
        historiaClinica.setMedicamentos("Ninguno");
        historiaClinica.setAlergias("Ninguna");
        historiaClinica.setPosologia("No aplica");
        historiaClinica.setAntecedentesFamiliares("Diabetes en familia");
        historiaClinica.setEnTratamiento(false);
        historiaClinica.setTomaBifosfonatos(false);
        historiaClinica.setApreciacionGeneral("Bueno");
        historiaClinica.setApreciacionGeneralDetalle("Paciente en buen estado general");
        historiaClinica.setExamenRegional("Normal");
        historiaClinica.setExamenRegionalDetalle("Sin alteraciones");
        historiaClinica.setExamenRegionalDetalles("Examen regional normal");
        historiaClinica.setExamenLocal("Caries en diente 16");
        historiaClinica.setExamenLocalDetalle("Caries profunda");
        historiaClinica.setContinenteDetalles("Detalles del continente");
        historiaClinica.setFechaCreacion(LocalDateTime.of(2024, 1, 15, 10, 0));
        historiaClinica.setFechaActualizacion(LocalDateTime.of(2024, 1, 15, 10, 0));

        historiaClinicaActualizada = new HistoriaClinica();
        historiaClinicaActualizada.setMotivoConsulta("Dolor dental intenso");
        historiaClinicaActualizada.setCepilladoDental("3 veces al día");
        historiaClinicaActualizada.setObservacionesHigienicas("Higiene mejorada");
    }

    @Test
    void testObtenerTodas_Success() {
        // Arrange
        List<HistoriaClinica> historias = Arrays.asList(historiaClinica);
        when(historiaClinicaRepository.findAll()).thenReturn(historias);

        // Act
        List<HistoriaClinica> resultado = historiaClinicaService.obtenerTodas();

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(historiaClinica, resultado.get(0));
        verify(historiaClinicaRepository).findAll();
    }

    @Test
    void testObtenerPorId_Success() {
        // Arrange
        when(historiaClinicaRepository.findById(1L)).thenReturn(Optional.of(historiaClinica));

        // Act
        Optional<HistoriaClinica> resultado = historiaClinicaService.obtenerPorId(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(historiaClinica, resultado.get());
        verify(historiaClinicaRepository).findById(1L);
    }

    @Test
    void testObtenerPorId_NoEncontrado() {
        // Arrange
        when(historiaClinicaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<HistoriaClinica> resultado = historiaClinicaService.obtenerPorId(1L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(historiaClinicaRepository).findById(1L);
    }

    @Test
    void testObtenerPorPaciente_Success() {
        // Arrange
        List<HistoriaClinica> historias = Arrays.asList(historiaClinica);
        when(historiaClinicaRepository.findByPacienteIdOrderByFechaCreacionDesc(1L)).thenReturn(historias);

        // Act
        List<HistoriaClinica> resultado = historiaClinicaService.obtenerPorPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(historiaClinica, resultado.get(0));
        verify(historiaClinicaRepository).findByPacienteIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void testObtenerMasReciente_Success() {
        // Arrange
        when(historiaClinicaRepository.findFirstByPacienteIdOrderByFechaCreacionDesc(1L)).thenReturn(Optional.of(historiaClinica));

        // Act
        Optional<HistoriaClinica> resultado = historiaClinicaService.obtenerMasReciente(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(historiaClinica, resultado.get());
        verify(historiaClinicaRepository).findFirstByPacienteIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void testObtenerPorPacienteYFecha_Success() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(historiaClinicaRepository.findByPacienteIdAndFecha(1L, fecha)).thenReturn(Optional.of(historiaClinica));

        // Act
        Optional<HistoriaClinica> resultado = historiaClinicaService.obtenerPorPacienteYFecha(1L, fecha);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(historiaClinica, resultado.get());
        verify(historiaClinicaRepository).findByPacienteIdAndFecha(1L, fecha);
    }

    @Test
    void testObtenerMasRecientePorPacienteYFecha_Success() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(historiaClinicaRepository.findMostRecentByPacienteIdAndFecha(1L, fecha)).thenReturn(Optional.of(historiaClinica));

        // Act
        Optional<HistoriaClinica> resultado = historiaClinicaService.obtenerMasRecientePorPacienteYFecha(1L, fecha);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(historiaClinica, resultado.get());
        verify(historiaClinicaRepository).findMostRecentByPacienteIdAndFecha(1L, fecha);
    }

    @Test
    void testObtenerFechasDisponibles_Success() {
        // Arrange
        List<String> fechas = Arrays.asList("2024-01-15", "2024-01-20");
        when(historiaClinicaRepository.findFechasDisponiblesByPacienteId(1L)).thenReturn(fechas);

        // Act
        List<String> resultado = historiaClinicaService.obtenerFechasDisponibles(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("2024-01-15", resultado.get(0));
        assertEquals("2024-01-20", resultado.get(1));
        verify(historiaClinicaRepository).findFechasDisponiblesByPacienteId(1L);
    }

    @Test
    void testExisteHistoriaClinica_True() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(historiaClinicaRepository.existsByPacienteIdAndFecha(1L, fecha)).thenReturn(true);

        // Act
        boolean resultado = historiaClinicaService.existeHistoriaClinica(1L, fecha);

        // Assert
        assertTrue(resultado);
        verify(historiaClinicaRepository).existsByPacienteIdAndFecha(1L, fecha);
    }

    @Test
    void testExisteHistoriaClinica_False() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(historiaClinicaRepository.existsByPacienteIdAndFecha(1L, fecha)).thenReturn(false);

        // Act
        boolean resultado = historiaClinicaService.existeHistoriaClinica(1L, fecha);

        // Assert
        assertFalse(resultado);
        verify(historiaClinicaRepository).existsByPacienteIdAndFecha(1L, fecha);
    }

    @Test
    void testContarPorPaciente_Success() {
        // Arrange
        when(historiaClinicaRepository.countByPacienteId(1L)).thenReturn(5L);

        // Act
        long resultado = historiaClinicaService.contarPorPaciente(1L);

        // Assert
        assertEquals(5L, resultado);
        verify(historiaClinicaRepository).countByPacienteId(1L);
    }

    @Test
    void testGuardar_Success() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(historiaClinicaRepository.save(any(HistoriaClinica.class))).thenReturn(historiaClinica);

        // Act
        HistoriaClinica resultado = historiaClinicaService.guardar(historiaClinica);

        // Assert
        assertNotNull(resultado);
        assertNotNull(resultado.getFechaCreacion());
        assertNotNull(resultado.getFechaActualizacion());
        verify(pacienteRepository).findById(1L);
        verify(historiaClinicaRepository).save(historiaClinica);
    }

    @Test
    void testGuardar_PacienteNulo() {
        // Arrange
        historiaClinica.setPaciente(null);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            historiaClinicaService.guardar(historiaClinica);
        });

        assertEquals("El paciente es requerido", exception.getMessage());
        verify(pacienteRepository, never()).findById(any());
        verify(historiaClinicaRepository, never()).save(any());
    }

    @Test
    void testGuardar_PacienteIdNulo() {
        // Arrange
        historiaClinica.getPaciente().setId(null);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            historiaClinicaService.guardar(historiaClinica);
        });

        assertEquals("El paciente es requerido", exception.getMessage());
        verify(pacienteRepository, never()).findById(any());
        verify(historiaClinicaRepository, never()).save(any());
    }

    @Test
    void testGuardar_PacienteNoExiste() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            historiaClinicaService.guardar(historiaClinica);
        });

        assertEquals("El paciente no existe", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(historiaClinicaRepository, never()).save(any());
    }

    @Test
    void testGuardar_SinUsuario() {
        // Arrange
        historiaClinica.setUsuario(null);
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(historiaClinicaRepository.save(any(HistoriaClinica.class))).thenReturn(historiaClinica);

        // Act
        HistoriaClinica resultado = historiaClinicaService.guardar(historiaClinica);

        // Assert
        assertNotNull(resultado);
        assertEquals(usuario, resultado.getUsuario());
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(historiaClinicaRepository).save(historiaClinica);
    }

    @Test
    void testActualizar_Success() {
        // Arrange
        when(historiaClinicaRepository.findById(1L)).thenReturn(Optional.of(historiaClinica));
        when(historiaClinicaRepository.save(any(HistoriaClinica.class))).thenReturn(historiaClinica);

        // Act
        HistoriaClinica resultado = historiaClinicaService.actualizar(1L, historiaClinicaActualizada);

        // Assert
        assertNotNull(resultado);
        assertEquals("Dolor dental intenso", resultado.getMotivoConsulta());
        assertEquals("3 veces al día", resultado.getCepilladoDental());
        assertEquals("Higiene mejorada", resultado.getObservacionesHigienicas());
        assertNotNull(resultado.getFechaActualizacion());
        verify(historiaClinicaRepository).findById(1L);
        verify(historiaClinicaRepository).save(historiaClinica);
    }

    @Test
    void testActualizar_NoEncontrada() {
        // Arrange
        when(historiaClinicaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            historiaClinicaService.actualizar(1L, historiaClinicaActualizada);
        });

        assertEquals("Historia clínica no encontrada", exception.getMessage());
        verify(historiaClinicaRepository).findById(1L);
        verify(historiaClinicaRepository, never()).save(any());
    }

    @Test
    void testEliminar_Success() {
        // Arrange
        when(historiaClinicaRepository.existsById(1L)).thenReturn(true);
        doNothing().when(historiaClinicaRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> historiaClinicaService.eliminar(1L));

        // Assert
        verify(historiaClinicaRepository).existsById(1L);
        verify(historiaClinicaRepository).deleteById(1L);
    }

    @Test
    void testEliminar_NoEncontrada() {
        // Arrange
        when(historiaClinicaRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            historiaClinicaService.eliminar(1L);
        });

        assertEquals("Historia clínica no encontrada", exception.getMessage());
        verify(historiaClinicaRepository).existsById(1L);
        verify(historiaClinicaRepository, never()).deleteById(any());
    }

    @Test
    void testCrearOActualizar_CrearNueva() {
        // Arrange
        historiaClinica.setId(null); // Nueva historia clínica
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(historiaClinicaRepository.save(any(HistoriaClinica.class))).thenReturn(historiaClinica);

        // Act
        HistoriaClinica resultado = historiaClinicaService.crearOActualizar(historiaClinica);

        // Assert
        assertNotNull(resultado);
        verify(pacienteRepository).findById(1L);
        verify(historiaClinicaRepository).save(historiaClinica);
    }

    @Test
    void testCrearOActualizar_ActualizarExistente() {
        // Arrange
        when(historiaClinicaRepository.findById(1L)).thenReturn(Optional.of(historiaClinica));
        when(historiaClinicaRepository.save(any(HistoriaClinica.class))).thenReturn(historiaClinica);

        // Act
        HistoriaClinica resultado = historiaClinicaService.crearOActualizar(historiaClinica);

        // Assert
        assertNotNull(resultado);
        verify(historiaClinicaRepository).findById(1L);
        verify(historiaClinicaRepository).save(historiaClinica);
    }

    @Test
    void testGuardar_ConUsuarioExistente() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(historiaClinicaRepository.save(any(HistoriaClinica.class))).thenReturn(historiaClinica);

        // Act
        HistoriaClinica resultado = historiaClinicaService.guardar(historiaClinica);

        // Assert
        assertNotNull(resultado);
        assertEquals(usuario, resultado.getUsuario());
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository, never()).findById(any());
        verify(historiaClinicaRepository).save(historiaClinica);
    }
}
