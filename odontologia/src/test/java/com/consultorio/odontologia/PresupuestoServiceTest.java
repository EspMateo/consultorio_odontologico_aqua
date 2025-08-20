package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PresupuestoDTO;
import com.consultorio.odontologia.dto.TratamientoPresupuestoDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Presupuesto;
import com.consultorio.odontologia.entity.TratamientoPresupuesto;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.PresupuestoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PresupuestoServiceTest {

    @Mock
    private PresupuestoRepository presupuestoRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private PresupuestoService presupuestoService;

    private Paciente paciente;
    private Presupuesto presupuesto;
    private PresupuestoDTO presupuestoDTO;
    private TratamientoPresupuesto tratamientoPresupuesto;
    private TratamientoPresupuestoDTO tratamientoPresupuestoDTO;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");

        presupuesto = new Presupuesto();
        presupuesto.setId(1L);
        presupuesto.setPaciente(paciente);
        presupuesto.setFechaRegistro(LocalDate.of(2024, 1, 15));

        tratamientoPresupuesto = new TratamientoPresupuesto();
        tratamientoPresupuesto.setId(1L);
        tratamientoPresupuesto.setNombre("Limpieza dental");
        tratamientoPresupuesto.setPrecio(new BigDecimal("100.00"));
        tratamientoPresupuesto.setAbonado(new BigDecimal("50.00"));
        tratamientoPresupuesto.setPagado(false);

        presupuesto.addTratamiento(tratamientoPresupuesto);

        presupuestoDTO = new PresupuestoDTO();
        presupuestoDTO.setId(1L);
        presupuestoDTO.setPacienteId(1L);
        presupuestoDTO.setPacienteNombre("Juan");
        presupuestoDTO.setPacienteApellido("Pérez");
        presupuestoDTO.setFechaRegistro(LocalDate.of(2024, 1, 15));

        tratamientoPresupuestoDTO = new TratamientoPresupuestoDTO();
        tratamientoPresupuestoDTO.setId(1L);
        tratamientoPresupuestoDTO.setNombre("Limpieza dental");
        tratamientoPresupuestoDTO.setPrecio(new BigDecimal("100.00"));
        tratamientoPresupuestoDTO.setAbonado(new BigDecimal("50.00"));
        tratamientoPresupuestoDTO.setPagado(false);

        presupuestoDTO.setTratamientos(Arrays.asList(tratamientoPresupuestoDTO));
    }

    @Test
    void testCrearPresupuesto_Success() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(presupuestoRepository.save(any(Presupuesto.class))).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.crearPresupuesto(presupuestoDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals(1L, resultado.getPacienteId());
        assertEquals("Juan", resultado.getPacienteNombre());
        assertEquals("Pérez", resultado.getPacienteApellido());

        verify(pacienteRepository).findById(1L);
        verify(presupuestoRepository).save(any(Presupuesto.class));
    }

    @Test
    void testCrearPresupuesto_PacienteNoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presupuestoService.crearPresupuesto(presupuestoDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(presupuestoRepository, never()).save(any());
    }

    @Test
    void testCrearPresupuesto_SinTratamientos() {
        // Arrange
        presupuestoDTO.setTratamientos(null);
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(presupuestoRepository.save(any(Presupuesto.class))).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.crearPresupuesto(presupuestoDTO);

        // Assert
        assertNotNull(resultado);
        verify(pacienteRepository).findById(1L);
        verify(presupuestoRepository).save(any(Presupuesto.class));
    }

    @Test
    void testActualizarPresupuesto_Success() {
        // Arrange
        PresupuestoDTO dtoActualizado = new PresupuestoDTO();
        dtoActualizado.setFechaRegistro(LocalDate.of(2024, 2, 1));
        dtoActualizado.setTratamientos(Arrays.asList(tratamientoPresupuestoDTO));

        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));
        when(presupuestoRepository.save(any(Presupuesto.class))).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.actualizarPresupuesto(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository).save(presupuesto);
    }

    @Test
    void testActualizarPresupuesto_NoEncontrado() {
        // Arrange
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presupuestoService.actualizarPresupuesto(1L, presupuestoDTO);
        });

        assertEquals("Presupuesto no encontrado", exception.getMessage());
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository, never()).save(any());
    }

    @Test
    void testObtenerPresupuestoPorId_Success() {
        // Arrange
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));

        // Act
        PresupuestoDTO resultado = presupuestoService.obtenerPresupuestoPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(presupuestoRepository).findById(1L);
    }

    @Test
    void testObtenerPresupuestoPorId_NoEncontrado() {
        // Arrange
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presupuestoService.obtenerPresupuestoPorId(1L);
        });

        assertEquals("Presupuesto no encontrado", exception.getMessage());
        verify(presupuestoRepository).findById(1L);
    }

    @Test
    void testObtenerPresupuestoPorPacienteYFecha_Success() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(presupuestoRepository.findByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.obtenerPresupuestoPorPacienteYFecha(1L, fecha);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(presupuestoRepository).findByPacienteIdAndFechaRegistro(1L, fecha);
    }

    @Test
    void testObtenerPresupuestoPorPacienteYFecha_NoEncontrado() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(presupuestoRepository.findByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presupuestoService.obtenerPresupuestoPorPacienteYFecha(1L, fecha);
        });

        assertEquals("Presupuesto no encontrado para el paciente y fecha especificados", exception.getMessage());
        verify(presupuestoRepository).findByPacienteIdAndFechaRegistro(1L, fecha);
    }

    @Test
    void testObtenerPresupuestosPorPaciente_Success() {
        // Arrange
        List<Presupuesto> presupuestos = Arrays.asList(presupuesto);
        when(presupuestoRepository.findByPacienteIdOrderByFechaRegistroDesc(1L)).thenReturn(presupuestos);

        // Act
        List<PresupuestoDTO> resultado = presupuestoService.obtenerPresupuestosPorPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(presupuestoRepository).findByPacienteIdOrderByFechaRegistroDesc(1L);
    }

    @Test
    void testObtenerFechasDisponiblesPorPaciente_Success() {
        // Arrange
        List<LocalDate> fechas = Arrays.asList(LocalDate.of(2024, 1, 15), LocalDate.of(2024, 1, 20));
        when(presupuestoRepository.findFechasDisponiblesByPacienteId(1L)).thenReturn(fechas);

        // Act
        List<LocalDate> resultado = presupuestoService.obtenerFechasDisponiblesPorPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(presupuestoRepository).findFechasDisponiblesByPacienteId(1L);
    }

    @Test
    void testActualizarPagoTratamiento_Success() {
        // Arrange
        BigDecimal nuevoAbonado = new BigDecimal("75.00");
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));
        when(presupuestoRepository.save(any(Presupuesto.class))).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.actualizarPagoTratamiento(1L, 1L, nuevoAbonado);

        // Assert
        assertNotNull(resultado);
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository).save(presupuesto);
    }

    @Test
    void testActualizarPagoTratamiento_PresupuestoNoEncontrado() {
        // Arrange
        BigDecimal nuevoAbonado = new BigDecimal("75.00");
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presupuestoService.actualizarPagoTratamiento(1L, 1L, nuevoAbonado);
        });

        assertEquals("Presupuesto no encontrado", exception.getMessage());
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository, never()).save(any());
    }

    @Test
    void testActualizarPagoTratamiento_TratamientoNoEncontrado() {
        // Arrange
        BigDecimal nuevoAbonado = new BigDecimal("75.00");
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presupuestoService.actualizarPagoTratamiento(1L, 999L, nuevoAbonado);
        });

        assertEquals("Tratamiento no encontrado", exception.getMessage());
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository, never()).save(any());
    }

    @Test
    void testActualizarPagoTratamiento_ConInteger() {
        // Arrange
        Integer nuevoAbonado = 75;
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));
        when(presupuestoRepository.save(any(Presupuesto.class))).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.actualizarPagoTratamiento(1L, 1L, nuevoAbonado);

        // Assert
        assertNotNull(resultado);
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository).save(presupuesto);
    }

    @Test
    void testEliminarPresupuesto_Success() {
        // Arrange
        when(presupuestoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(presupuestoRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> presupuestoService.eliminarPresupuesto(1L));

        // Assert
        verify(presupuestoRepository).existsById(1L);
        verify(presupuestoRepository).deleteById(1L);
    }

    @Test
    void testEliminarPresupuesto_NoEncontrado() {
        // Arrange
        when(presupuestoRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presupuestoService.eliminarPresupuesto(1L);
        });

        assertEquals("Presupuesto no encontrado", exception.getMessage());
        verify(presupuestoRepository).existsById(1L);
        verify(presupuestoRepository, never()).deleteById(any());
    }

    @Test
    void testCalcularTotalIngresosPorFecha_Success() {
        // Arrange
        LocalDate fechaInicio = LocalDate.of(2024, 1, 1);
        LocalDate fechaFin = LocalDate.of(2024, 1, 31);
        List<Presupuesto> presupuestos = Arrays.asList(presupuesto);
        when(presupuestoRepository.findByFechaRegistroBetween(fechaInicio, fechaFin)).thenReturn(presupuestos);

        // Act
        BigDecimal resultado = presupuestoService.calcularTotalIngresosPorFecha(fechaInicio, fechaFin);

        // Assert
        assertNotNull(resultado);
        assertEquals(new BigDecimal("50.00"), resultado);
        verify(presupuestoRepository).findByFechaRegistroBetween(fechaInicio, fechaFin);
    }

    @Test
    void testCalcularTotalIngresosPendientesPorFecha_Success() {
        // Arrange
        LocalDate fechaInicio = LocalDate.of(2024, 1, 1);
        LocalDate fechaFin = LocalDate.of(2024, 1, 31);
        List<Presupuesto> presupuestos = Arrays.asList(presupuesto);
        when(presupuestoRepository.findByFechaRegistroBetween(fechaInicio, fechaFin)).thenReturn(presupuestos);

        // Act
        BigDecimal resultado = presupuestoService.calcularTotalIngresosPendientesPorFecha(fechaInicio, fechaFin);

        // Assert
        assertNotNull(resultado);
        assertEquals(new BigDecimal("50.00"), resultado); // 100 - 50
        verify(presupuestoRepository).findByFechaRegistroBetween(fechaInicio, fechaFin);
    }

    @Test
    void testObtenerPresupuestosPorFecha_Success() {
        // Arrange
        LocalDate fechaInicio = LocalDate.of(2024, 1, 1);
        LocalDate fechaFin = LocalDate.of(2024, 1, 31);
        List<Presupuesto> presupuestos = Arrays.asList(presupuesto);
        when(presupuestoRepository.findByFechaRegistroBetween(fechaInicio, fechaFin)).thenReturn(presupuestos);

        // Act
        List<PresupuestoDTO> resultado = presupuestoService.obtenerPresupuestosPorFecha(fechaInicio, fechaFin);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(presupuestoRepository).findByFechaRegistroBetween(fechaInicio, fechaFin);
    }

    @Test
    void testActualizarPresupuesto_ConFechaDiferente() {
        // Arrange
        PresupuestoDTO dtoConFechaDiferente = new PresupuestoDTO();
        dtoConFechaDiferente.setFechaRegistro(LocalDate.of(2024, 2, 1));
        dtoConFechaDiferente.setTratamientos(Arrays.asList(tratamientoPresupuestoDTO));

        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));
        when(presupuestoRepository.save(any(Presupuesto.class))).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.actualizarPresupuesto(1L, dtoConFechaDiferente);

        // Assert
        assertNotNull(resultado);
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository).save(presupuesto);
    }

    @Test
    void testActualizarPresupuesto_ConTratamientosNulos() {
        // Arrange
        PresupuestoDTO dtoSinTratamientos = new PresupuestoDTO();
        dtoSinTratamientos.setFechaRegistro(LocalDate.of(2024, 1, 15));
        dtoSinTratamientos.setTratamientos(null);

        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));
        when(presupuestoRepository.save(any(Presupuesto.class))).thenReturn(presupuesto);

        // Act
        PresupuestoDTO resultado = presupuestoService.actualizarPresupuesto(1L, dtoSinTratamientos);

        // Assert
        assertNotNull(resultado);
        verify(presupuestoRepository).findById(1L);
        verify(presupuestoRepository).save(presupuesto);
    }
}
