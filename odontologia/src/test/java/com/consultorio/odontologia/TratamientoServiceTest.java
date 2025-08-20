package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.TratamientoDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Tratamiento;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.TratamientoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TratamientoServiceTest {

    @Mock
    private TratamientoRepository tratamientoRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private TratamientoService tratamientoService;

    private Paciente paciente;
    private Tratamiento tratamiento;
    private TratamientoDTO tratamientoDTO;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");

        tratamiento = new Tratamiento();
        tratamiento.setId(1L);
        tratamiento.setPaciente(paciente);
        tratamiento.setNombre("Limpieza dental");
        tratamiento.setDescripcion("Limpieza profunda de dientes y encías");
        tratamiento.setDuracion("1 hora");
        tratamiento.setFechaInicio(LocalDate.of(2024, 1, 15));
        tratamiento.setFechaFin(LocalDate.of(2024, 1, 15));
        tratamiento.setSeguimiento("Revisión en 6 meses");
        tratamiento.setActivo(true);

        tratamientoDTO = new TratamientoDTO();
        tratamientoDTO.setPacienteId(1L);
        tratamientoDTO.setNombre("Limpieza dental");
        tratamientoDTO.setDescripcion("Limpieza profunda de dientes y encías");
        tratamientoDTO.setDuracion("1 hora");
        tratamientoDTO.setFechaInicio(LocalDate.of(2024, 1, 15));
        tratamientoDTO.setFechaFin(LocalDate.of(2024, 1, 15));
        tratamientoDTO.setSeguimiento("Revisión en 6 meses");
        tratamientoDTO.setActivo(true);
    }

    @Test
    void testCrearTratamiento_Success() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(tratamientoRepository.save(any(Tratamiento.class))).thenReturn(tratamiento);

        // Act
        Tratamiento resultado = tratamientoService.crearTratamiento(tratamientoDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("Limpieza dental", resultado.getNombre());
        assertEquals("Limpieza profunda de dientes y encías", resultado.getDescripcion());
        assertEquals(paciente, resultado.getPaciente());
        assertEquals(true, resultado.isActivo());

        verify(pacienteRepository).findById(1L);
        verify(tratamientoRepository).save(any(Tratamiento.class));
    }

    @Test
    void testCrearTratamiento_PacienteNoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tratamientoService.crearTratamiento(tratamientoDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(tratamientoRepository, never()).save(any());
    }

    @Test
    void testObtenerTratamientosPorPaciente_Success() {
        // Arrange
        List<Tratamiento> tratamientos = Arrays.asList(tratamiento);
        when(tratamientoRepository.findByPacienteIdOrderByFechaInicioDesc(1L)).thenReturn(tratamientos);

        // Act
        List<Tratamiento> resultado = tratamientoService.obtenerTratamientosPorPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(tratamiento, resultado.get(0));
        verify(tratamientoRepository).findByPacienteIdOrderByFechaInicioDesc(1L);
    }

    @Test
    void testObtenerTratamientoActivo_Success() {
        // Arrange
        when(tratamientoRepository.findByPacienteIdAndActivoTrue(1L)).thenReturn(Optional.of(tratamiento));

        // Act
        Optional<Tratamiento> resultado = tratamientoService.obtenerTratamientoActivo(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(tratamiento, resultado.get());
        verify(tratamientoRepository).findByPacienteIdAndActivoTrue(1L);
    }

    @Test
    void testObtenerTratamientoActivo_NoEncontrado() {
        // Arrange
        when(tratamientoRepository.findByPacienteIdAndActivoTrue(1L)).thenReturn(Optional.empty());

        // Act
        Optional<Tratamiento> resultado = tratamientoService.obtenerTratamientoActivo(1L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(tratamientoRepository).findByPacienteIdAndActivoTrue(1L);
    }

    @Test
    void testObtenerTratamientoPorId_Success() {
        // Arrange
        when(tratamientoRepository.findById(1L)).thenReturn(Optional.of(tratamiento));

        // Act
        Tratamiento resultado = tratamientoService.obtenerTratamientoPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(tratamiento, resultado);
        verify(tratamientoRepository).findById(1L);
    }

    @Test
    void testObtenerTratamientoPorId_NoEncontrado() {
        // Arrange
        when(tratamientoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tratamientoService.obtenerTratamientoPorId(1L);
        });

        assertEquals("Tratamiento no encontrado", exception.getMessage());
        verify(tratamientoRepository).findById(1L);
    }

    @Test
    void testActualizarTratamiento_Success() {
        // Arrange
        TratamientoDTO dtoActualizado = new TratamientoDTO();
        dtoActualizado.setNombre("Limpieza dental avanzada");
        dtoActualizado.setDescripcion("Limpieza profunda con ultrasonido");

        when(tratamientoRepository.findById(1L)).thenReturn(Optional.of(tratamiento));
        when(tratamientoRepository.save(any(Tratamiento.class))).thenReturn(tratamiento);

        // Act
        Tratamiento resultado = tratamientoService.actualizarTratamiento(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(tratamientoRepository).findById(1L);
        verify(tratamientoRepository).save(tratamiento);
    }

    @Test
    void testActualizarTratamiento_NoEncontrado() {
        // Arrange
        when(tratamientoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tratamientoService.actualizarTratamiento(1L, tratamientoDTO);
        });

        assertEquals("Tratamiento no encontrado", exception.getMessage());
        verify(tratamientoRepository).findById(1L);
        verify(tratamientoRepository, never()).save(any());
    }

    @Test
    void testDesactivarTratamiento_Success() {
        // Arrange
        when(tratamientoRepository.findById(1L)).thenReturn(Optional.of(tratamiento));
        when(tratamientoRepository.save(any(Tratamiento.class))).thenReturn(tratamiento);

        // Act
        assertDoesNotThrow(() -> tratamientoService.desactivarTratamiento(1L));

        // Assert
        verify(tratamientoRepository).findById(1L);
        verify(tratamientoRepository).save(tratamiento);
        assertFalse(tratamiento.isActivo());
    }

    @Test
    void testActivarTratamiento_Success() {
        // Arrange
        tratamiento.setActivo(false);
        when(tratamientoRepository.findById(1L)).thenReturn(Optional.of(tratamiento));
        when(tratamientoRepository.save(any(Tratamiento.class))).thenReturn(tratamiento);

        // Act
        assertDoesNotThrow(() -> tratamientoService.activarTratamiento(1L));

        // Assert
        verify(tratamientoRepository).findById(1L);
        verify(tratamientoRepository).save(tratamiento);
        assertTrue(tratamiento.isActivo());
    }

    @Test
    void testEliminarTratamiento_Success() {
        // Arrange
        when(tratamientoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(tratamientoRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> tratamientoService.eliminarTratamiento(1L));

        // Assert
        verify(tratamientoRepository).existsById(1L);
        verify(tratamientoRepository).deleteById(1L);
    }

    @Test
    void testEliminarTratamiento_NoEncontrado() {
        // Arrange
        when(tratamientoRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tratamientoService.eliminarTratamiento(1L);
        });

        assertEquals("Tratamiento no encontrado", exception.getMessage());
        verify(tratamientoRepository).existsById(1L);
        verify(tratamientoRepository, never()).deleteById(any());
    }

    @Test
    void testBuscarTratamientosPorNombre_Success() {
        // Arrange
        List<Tratamiento> tratamientos = Arrays.asList(tratamiento);
        when(tratamientoRepository.findByPacienteIdAndNombreContainingIgnoreCase(1L, "limpieza"))
                .thenReturn(tratamientos);

        // Act
        List<Tratamiento> resultado = tratamientoService.buscarTratamientosPorNombre(1L, "limpieza");

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(tratamiento, resultado.get(0));
        verify(tratamientoRepository).findByPacienteIdAndNombreContainingIgnoreCase(1L, "limpieza");
    }

    @Test
    void testObtenerEstadisticasTratamientos_Success() {
        // Arrange
        when(tratamientoRepository.countByPacienteId(1L)).thenReturn(5L);
        when(tratamientoRepository.countByPacienteIdAndActivoTrue(1L)).thenReturn(3L);

        // Act
        Map<String, Object> resultado = tratamientoService.obtenerEstadisticasTratamientos(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(5L, resultado.get("totalTratamientos"));
        assertEquals(3L, resultado.get("tratamientosActivos"));
        assertEquals(2L, resultado.get("tratamientosInactivos"));
        assertEquals(1L, resultado.get("pacienteId"));

        verify(tratamientoRepository).countByPacienteId(1L);
        verify(tratamientoRepository).countByPacienteIdAndActivoTrue(1L);
    }

    @Test
    void testDesactivarTratamientosActivos_Success() {
        // Arrange
        List<Tratamiento> tratamientosActivos = Arrays.asList(tratamiento);
        when(tratamientoRepository.findByPacienteIdAndActivoTrueOrderByFechaInicioDesc(1L))
                .thenReturn(tratamientosActivos);
        when(tratamientoRepository.saveAll(anyList())).thenReturn(tratamientosActivos);

        // Act
        assertDoesNotThrow(() -> tratamientoService.desactivarTratamientosActivos(1L));

        // Assert
        verify(tratamientoRepository).findByPacienteIdAndActivoTrueOrderByFechaInicioDesc(1L);
        verify(tratamientoRepository).saveAll(tratamientosActivos);
        assertFalse(tratamiento.isActivo());
    }

    @Test
    void testActualizarTratamiento_ConCamposNulos() {
        // Arrange
        TratamientoDTO dtoConCamposNulos = new TratamientoDTO();
        dtoConCamposNulos.setNombre(null);
        dtoConCamposNulos.setDescripcion(null);

        when(tratamientoRepository.findById(1L)).thenReturn(Optional.of(tratamiento));
        when(tratamientoRepository.save(any(Tratamiento.class))).thenReturn(tratamiento);

        // Act
        Tratamiento resultado = tratamientoService.actualizarTratamiento(1L, dtoConCamposNulos);

        // Assert
        assertNotNull(resultado);
        verify(tratamientoRepository).findById(1L);
        verify(tratamientoRepository).save(tratamiento);
    }

    @Test
    void testActualizarTratamiento_ConTodosLosCampos() {
        // Arrange
        TratamientoDTO dtoCompleto = new TratamientoDTO();
        dtoCompleto.setNombre("Nuevo nombre");
        dtoCompleto.setDescripcion("Nueva descripción");
        dtoCompleto.setDuracion("2 horas");
        dtoCompleto.setFechaInicio(LocalDate.of(2024, 2, 1));
        dtoCompleto.setFechaFin(LocalDate.of(2024, 2, 15));
        dtoCompleto.setSeguimiento("Nuevo seguimiento");

        when(tratamientoRepository.findById(1L)).thenReturn(Optional.of(tratamiento));
        when(tratamientoRepository.save(any(Tratamiento.class))).thenReturn(tratamiento);

        // Act
        Tratamiento resultado = tratamientoService.actualizarTratamiento(1L, dtoCompleto);

        // Assert
        assertNotNull(resultado);
        verify(tratamientoRepository).findById(1L);
        verify(tratamientoRepository).save(tratamiento);
    }
}
