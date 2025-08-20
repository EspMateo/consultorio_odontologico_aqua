package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PeriodontogramaDTO;
import com.consultorio.odontologia.entity.Periodontograma;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PeriodontogramaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PeriodontogramaServiceTest {

    @Mock
    private PeriodontogramaRepository periodontogramaRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PeriodontogramaService periodontogramaService;

    private Paciente paciente;
    private Periodontograma periodontograma;
    private PeriodontogramaDTO periodontogramaDTO;
    private Map<String, Object> datosPeriodontograma;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");

        periodontograma = new Periodontograma();
        periodontograma.setId(1L);
        periodontograma.setPaciente(paciente);
        periodontograma.setFechaRegistro("2024-01-15");
        periodontograma.setObservaciones("Observaciones del periodontograma");
        periodontograma.setFechaCreacion(LocalDateTime.of(2024, 1, 15, 10, 0));
        periodontograma.setDatosPeriodontograma("{\"diente\":\"1\",\"bolsas\":\"3mm\"}");

        periodontogramaDTO = new PeriodontogramaDTO();
        periodontogramaDTO.setId(1L);
        periodontogramaDTO.setPacienteId(1L);
        periodontogramaDTO.setFechaRegistro("2024-01-15");
        periodontogramaDTO.setObservaciones("Observaciones del periodontograma");

        datosPeriodontograma = new HashMap<>();
        datosPeriodontograma.put("diente", "1");
        datosPeriodontograma.put("bolsas", "3mm");
        periodontogramaDTO.setDatosPeriodontograma(datosPeriodontograma);
    }

    @Test
    void testGuardarPeriodontograma_Success() throws Exception {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"diente\":\"1\",\"bolsas\":\"3mm\"}");
        when(periodontogramaRepository.save(any(Periodontograma.class))).thenReturn(periodontograma);

        // Act
        PeriodontogramaDTO resultado = periodontogramaService.guardarPeriodontograma(periodontogramaDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(pacienteRepository).findById(1L);
        verify(objectMapper).writeValueAsString(datosPeriodontograma);
        verify(periodontogramaRepository).save(any(Periodontograma.class));
    }

    @Test
    void testGuardarPeriodontograma_PacienteNoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.guardarPeriodontograma(periodontogramaDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(periodontogramaRepository, never()).save(any());
    }

    @Test
    void testGuardarPeriodontograma_SinDatosPeriodontograma() throws Exception {
        // Arrange
        periodontogramaDTO.setDatosPeriodontograma(null);
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(periodontogramaRepository.save(any(Periodontograma.class))).thenReturn(periodontograma);

        // Act
        PeriodontogramaDTO resultado = periodontogramaService.guardarPeriodontograma(periodontogramaDTO);

        // Assert
        assertNotNull(resultado);
        verify(pacienteRepository).findById(1L);
        verify(objectMapper, never()).writeValueAsString(any());
        verify(periodontogramaRepository).save(any(Periodontograma.class));
    }

    @Test
    void testActualizarPeriodontograma_Success() throws Exception {
        // Arrange
        PeriodontogramaDTO dtoActualizado = new PeriodontogramaDTO();
        dtoActualizado.setFechaRegistro("2024-02-01");
        dtoActualizado.setObservaciones("Observaciones actualizadas");
        dtoActualizado.setDatosPeriodontograma(datosPeriodontograma);

        when(periodontogramaRepository.findById(1L)).thenReturn(Optional.of(periodontograma));
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"diente\":\"1\",\"bolsas\":\"3mm\"}");
        when(periodontogramaRepository.save(any(Periodontograma.class))).thenReturn(periodontograma);

        // Act
        PeriodontogramaDTO resultado = periodontogramaService.actualizarPeriodontograma(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(periodontogramaRepository).findById(1L);
        verify(objectMapper).writeValueAsString(datosPeriodontograma);
        verify(periodontogramaRepository).save(periodontograma);
    }

    @Test
    void testActualizarPeriodontograma_NoEncontrado() {
        // Arrange
        when(periodontogramaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.actualizarPeriodontograma(1L, periodontogramaDTO);
        });

        assertEquals("Periodontograma no encontrado", exception.getMessage());
        verify(periodontogramaRepository).findById(1L);
        verify(periodontogramaRepository, never()).save(any());
    }

    @Test
    void testObtenerPorId_Success() throws Exception {
        // Arrange
        when(periodontogramaRepository.findById(1L)).thenReturn(Optional.of(periodontograma));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(datosPeriodontograma);

        // Act
        PeriodontogramaDTO resultado = periodontogramaService.obtenerPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(periodontogramaRepository).findById(1L);
        verify(objectMapper).readValue("{\"diente\":\"1\",\"bolsas\":\"3mm\"}", Map.class);
    }

    @Test
    void testObtenerPorId_NoEncontrado() {
        // Arrange
        when(periodontogramaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.obtenerPorId(1L);
        });

        assertEquals("Periodontograma no encontrado", exception.getMessage());
        verify(periodontogramaRepository).findById(1L);
    }

    @Test
    void testObtenerPorPacienteYFecha_Success() throws Exception {
        // Arrange
        String fecha = "2024-01-15";
        when(periodontogramaRepository.findByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(Optional.of(periodontograma));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(datosPeriodontograma);

        // Act
        PeriodontogramaDTO resultado = periodontogramaService.obtenerPorPacienteYFecha(1L, fecha);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(periodontogramaRepository).findByPacienteIdAndFechaRegistro(1L, fecha);
        verify(objectMapper).readValue("{\"diente\":\"1\",\"bolsas\":\"3mm\"}", Map.class);
    }

    @Test
    void testObtenerPorPacienteYFecha_NoEncontrado() {
        // Arrange
        String fecha = "2024-01-15";
        when(periodontogramaRepository.findByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.obtenerPorPacienteYFecha(1L, fecha);
        });

        assertEquals("Periodontograma no encontrado", exception.getMessage());
        verify(periodontogramaRepository).findByPacienteIdAndFechaRegistro(1L, fecha);
    }

    @Test
    void testObtenerMasReciente_Success() throws Exception {
        // Arrange
        when(periodontogramaRepository.findMostRecentByPacienteId(1L)).thenReturn(Optional.of(periodontograma));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(datosPeriodontograma);

        // Act
        PeriodontogramaDTO resultado = periodontogramaService.obtenerMasReciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(periodontogramaRepository).findMostRecentByPacienteId(1L);
        verify(objectMapper).readValue("{\"diente\":\"1\",\"bolsas\":\"3mm\"}", Map.class);
    }

    @Test
    void testObtenerMasReciente_NoEncontrado() {
        // Arrange
        when(periodontogramaRepository.findMostRecentByPacienteId(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.obtenerMasReciente(1L);
        });

        assertEquals("No se encontraron periodontogramas para este paciente", exception.getMessage());
        verify(periodontogramaRepository).findMostRecentByPacienteId(1L);
    }

    @Test
    void testObtenerFechasDisponibles_Success() {
        // Arrange
        List<String> fechas = Arrays.asList("2024-01-15", "2024-01-20");
        when(periodontogramaRepository.findFechasByPacienteId(1L)).thenReturn(fechas);

        // Act
        List<String> resultado = periodontogramaService.obtenerFechasDisponibles(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("2024-01-15", resultado.get(0));
        assertEquals("2024-01-20", resultado.get(1));
        verify(periodontogramaRepository).findFechasByPacienteId(1L);
    }

    @Test
    void testExistePeriodontograma_True() {
        // Arrange
        when(periodontogramaRepository.existsByPacienteIdAndFechaRegistro(1L, "2024-01-15")).thenReturn(true);

        // Act
        boolean resultado = periodontogramaService.existePeriodontograma(1L, "2024-01-15");

        // Assert
        assertTrue(resultado);
        verify(periodontogramaRepository).existsByPacienteIdAndFechaRegistro(1L, "2024-01-15");
    }

    @Test
    void testExistePeriodontograma_False() {
        // Arrange
        when(periodontogramaRepository.existsByPacienteIdAndFechaRegistro(1L, "2024-01-15")).thenReturn(false);

        // Act
        boolean resultado = periodontogramaService.existePeriodontograma(1L, "2024-01-15");

        // Assert
        assertFalse(resultado);
        verify(periodontogramaRepository).existsByPacienteIdAndFechaRegistro(1L, "2024-01-15");
    }

    @Test
    void testObtenerTodasPorPaciente_Success() throws Exception {
        // Arrange
        List<Periodontograma> periodontogramas = Arrays.asList(periodontograma);
        when(periodontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(1L)).thenReturn(periodontogramas);
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(datosPeriodontograma);

        // Act
        List<PeriodontogramaDTO> resultado = periodontogramaService.obtenerTodasPorPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(1L, resultado.get(0).getId());
        verify(periodontogramaRepository).findByPacienteIdOrderByFechaCreacionDesc(1L);
        verify(objectMapper).readValue("{\"diente\":\"1\",\"bolsas\":\"3mm\"}", Map.class);
    }

    @Test
    void testEliminarPeriodontograma_Success() {
        // Arrange
        when(periodontogramaRepository.existsById(1L)).thenReturn(true);
        doNothing().when(periodontogramaRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> periodontogramaService.eliminarPeriodontograma(1L));

        // Assert
        verify(periodontogramaRepository).existsById(1L);
        verify(periodontogramaRepository).deleteById(1L);
    }

    @Test
    void testEliminarPeriodontograma_NoEncontrado() {
        // Arrange
        when(periodontogramaRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.eliminarPeriodontograma(1L);
        });

        assertEquals("Periodontograma no encontrado con ID: 1", exception.getMessage());
        verify(periodontogramaRepository).existsById(1L);
        verify(periodontogramaRepository, never()).deleteById(any());
    }

    @Test
    void testGuardarPeriodontograma_ConErrorEnObjectMapper() throws Exception {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(objectMapper.writeValueAsString(any())).thenThrow(new RuntimeException("Error en ObjectMapper"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.guardarPeriodontograma(periodontogramaDTO);
        });

        assertTrue(exception.getMessage().contains("Error en ObjectMapper"));
        verify(pacienteRepository).findById(1L);
        verify(objectMapper).writeValueAsString(datosPeriodontograma);
        verify(periodontogramaRepository, never()).save(any());
    }

    @Test
    void testObtenerPorId_ConErrorEnObjectMapper() throws Exception {
        // Arrange
        when(periodontogramaRepository.findById(1L)).thenReturn(Optional.of(periodontograma));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenThrow(new RuntimeException("Error en ObjectMapper"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodontogramaService.obtenerPorId(1L);
        });

        assertTrue(exception.getMessage().contains("Error en ObjectMapper"));
        verify(periodontogramaRepository).findById(1L);
        verify(objectMapper).readValue("{\"diente\":\"1\",\"bolsas\":\"3mm\"}", Map.class);
    }
}
