package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.GastoDTO;
import com.consultorio.odontologia.entity.Gasto;
import com.consultorio.odontologia.repository.GastoRepository;
import com.consultorio.odontologia.service.util.DTOConverter;
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
class GastoServiceTest {

    @Mock
    private GastoRepository gastoRepository;

    @InjectMocks
    private GastoService gastoService;

    private Gasto gasto;
    private GastoDTO gastoDTO;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        gasto = new Gasto();
        gasto.setId(1L);
        gasto.setDescripcion("Compra de material dental");
        gasto.setPrecio(new BigDecimal("150.00"));
        gasto.setCantidad(2);
        gasto.setFechaGasto(LocalDate.of(2024, 1, 15));
        gasto.setCategoria("Materiales");
        gasto.setProveedor("Dental Supply Co.");
        gasto.setObservaciones("Material de calidad premium");

        gastoDTO = new GastoDTO();
        gastoDTO.setDescripcion("Compra de material dental");
        gastoDTO.setPrecio(new BigDecimal("150.00"));
        gastoDTO.setCantidad(2);
        gastoDTO.setFechaGasto(LocalDate.of(2024, 1, 15));
        gastoDTO.setCategoria("Materiales");
        gastoDTO.setProveedor("Dental Supply Co.");
        gastoDTO.setObservaciones("Material de calidad premium");
    }

    @Test
    void testCrearGasto_Success() {
        // Arrange
        when(gastoRepository.save(any(Gasto.class))).thenReturn(gasto);

        // Act
        GastoDTO resultado = gastoService.crearGasto(gastoDTO);

        // Assert
        assertNotNull(resultado);
        verify(gastoRepository).save(any(Gasto.class));
    }

    @Test
    void testObtenerTodosLosGastos_Success() {
        // Arrange
        List<Gasto> gastos = Arrays.asList(gasto);
        when(gastoRepository.findAll()).thenReturn(gastos);

        // Act
        List<GastoDTO> resultado = gastoService.obtenerTodosLosGastos();

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(gastoRepository).findAll();
    }

    @Test
    void testObtenerGastosPorFecha_Success() {
        // Arrange
        LocalDate fechaInicio = LocalDate.of(2024, 1, 1);
        LocalDate fechaFin = LocalDate.of(2024, 1, 31);
        List<Gasto> gastos = Arrays.asList(gasto);
        when(gastoRepository.findByFechaGastoBetweenOrderByFechaGastoDesc(fechaInicio, fechaFin)).thenReturn(gastos);

        // Act
        List<GastoDTO> resultado = gastoService.obtenerGastosPorFecha(fechaInicio, fechaFin);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(gastoRepository).findByFechaGastoBetweenOrderByFechaGastoDesc(fechaInicio, fechaFin);
    }

    @Test
    void testObtenerGastosPorCategoria_Success() {
        // Arrange
        String categoria = "Materiales";
        List<Gasto> gastos = Arrays.asList(gasto);
        when(gastoRepository.findByCategoriaOrderByFechaGastoDesc(categoria)).thenReturn(gastos);

        // Act
        List<GastoDTO> resultado = gastoService.obtenerGastosPorCategoria(categoria);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(gastoRepository).findByCategoriaOrderByFechaGastoDesc(categoria);
    }

    @Test
    void testCalcularTotalGastosPorFecha_Success() {
        // Arrange
        LocalDate fechaInicio = LocalDate.of(2024, 1, 1);
        LocalDate fechaFin = LocalDate.of(2024, 1, 31);
        BigDecimal totalEsperado = new BigDecimal("300.00");
        when(gastoRepository.calcularTotalGastosPorFecha(fechaInicio, fechaFin)).thenReturn(totalEsperado);

        // Act
        BigDecimal resultado = gastoService.calcularTotalGastosPorFecha(fechaInicio, fechaFin);

        // Assert
        assertNotNull(resultado);
        assertEquals(totalEsperado, resultado);
        verify(gastoRepository).calcularTotalGastosPorFecha(fechaInicio, fechaFin);
    }

    @Test
    void testCalcularTotalGastosPorCategoriaYFecha_Success() {
        // Arrange
        String categoria = "Materiales";
        LocalDate fechaInicio = LocalDate.of(2024, 1, 1);
        LocalDate fechaFin = LocalDate.of(2024, 1, 31);
        BigDecimal totalEsperado = new BigDecimal("150.00");
        when(gastoRepository.calcularTotalGastosPorCategoriaYFecha(categoria, fechaInicio, fechaFin)).thenReturn(totalEsperado);

        // Act
        BigDecimal resultado = gastoService.calcularTotalGastosPorCategoriaYFecha(categoria, fechaInicio, fechaFin);

        // Assert
        assertNotNull(resultado);
        assertEquals(totalEsperado, resultado);
        verify(gastoRepository).calcularTotalGastosPorCategoriaYFecha(categoria, fechaInicio, fechaFin);
    }

    @Test
    void testObtenerTodasLasCategorias_Success() {
        // Arrange
        List<String> categorias = Arrays.asList("Materiales", "Equipos", "Servicios");
        when(gastoRepository.findAllCategorias()).thenReturn(categorias);

        // Act
        List<String> resultado = gastoService.obtenerTodasLasCategorias();

        // Assert
        assertNotNull(resultado);
        assertEquals(3, resultado.size());
        assertEquals("Materiales", resultado.get(0));
        assertEquals("Equipos", resultado.get(1));
        assertEquals("Servicios", resultado.get(2));
        verify(gastoRepository).findAllCategorias();
    }

    @Test
    void testBuscarGastosPorDescripcion_Success() {
        // Arrange
        String descripcion = "material";
        List<Gasto> gastos = Arrays.asList(gasto);
        when(gastoRepository.findByDescripcionContainingIgnoreCaseOrderByFechaGastoDesc(descripcion)).thenReturn(gastos);

        // Act
        List<GastoDTO> resultado = gastoService.buscarGastosPorDescripcion(descripcion);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(gastoRepository).findByDescripcionContainingIgnoreCaseOrderByFechaGastoDesc(descripcion);
    }

    @Test
    void testActualizarGasto_Success() {
        // Arrange
        GastoDTO dtoActualizado = new GastoDTO();
        dtoActualizado.setDescripcion("Compra de material dental actualizado");
        dtoActualizado.setPrecio(new BigDecimal("200.00"));
        dtoActualizado.setCantidad(3);
        dtoActualizado.setFechaGasto(LocalDate.of(2024, 2, 1));
        dtoActualizado.setCategoria("Materiales Premium");
        dtoActualizado.setProveedor("Dental Supply Premium Co.");
        dtoActualizado.setObservaciones("Material de calidad premium actualizado");

        when(gastoRepository.findById(1L)).thenReturn(Optional.of(gasto));
        when(gastoRepository.save(any(Gasto.class))).thenReturn(gasto);

        // Act
        GastoDTO resultado = gastoService.actualizarGasto(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(gastoRepository).findById(1L);
        verify(gastoRepository).save(gasto);
    }

    @Test
    void testActualizarGasto_NoEncontrado() {
        // Arrange
        when(gastoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gastoService.actualizarGasto(1L, gastoDTO);
        });

        assertEquals("Gasto no encontrado", exception.getMessage());
        verify(gastoRepository).findById(1L);
        verify(gastoRepository, never()).save(any());
    }

    @Test
    void testEliminarGasto_Success() {
        // Arrange
        doNothing().when(gastoRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> gastoService.eliminarGasto(1L));

        // Assert
        verify(gastoRepository).deleteById(1L);
    }

    @Test
    void testObtenerGastoPorId_Success() {
        // Arrange
        when(gastoRepository.findById(1L)).thenReturn(Optional.of(gasto));

        // Act
        GastoDTO resultado = gastoService.obtenerGastoPorId(1L);

        // Assert
        assertNotNull(resultado);
        verify(gastoRepository).findById(1L);
    }

    @Test
    void testObtenerGastoPorId_NoEncontrado() {
        // Arrange
        when(gastoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gastoService.obtenerGastoPorId(1L);
        });

        assertEquals("Gasto no encontrado", exception.getMessage());
        verify(gastoRepository).findById(1L);
    }

    @Test
    void testCrearGasto_ConTodosLosCampos() {
        // Arrange
        GastoDTO dtoCompleto = new GastoDTO();
        dtoCompleto.setDescripcion("Nuevo gasto completo");
        dtoCompleto.setPrecio(new BigDecimal("500.00"));
        dtoCompleto.setCantidad(1);
        dtoCompleto.setFechaGasto(LocalDate.of(2024, 3, 1));
        dtoCompleto.setCategoria("Equipos");
        dtoCompleto.setProveedor("Nuevo Proveedor");
        dtoCompleto.setObservaciones("Nueva observación");

        when(gastoRepository.save(any(Gasto.class))).thenReturn(gasto);

        // Act
        GastoDTO resultado = gastoService.crearGasto(dtoCompleto);

        // Assert
        assertNotNull(resultado);
        verify(gastoRepository).save(any(Gasto.class));
    }

    @Test
    void testCrearGasto_ConCamposMinimos() {
        // Arrange
        GastoDTO dtoMinimo = new GastoDTO();
        dtoMinimo.setDescripcion("Gasto mínimo");
        dtoMinimo.setPrecio(new BigDecimal("50.00"));
        dtoMinimo.setFechaGasto(LocalDate.of(2024, 1, 1));
        // No se establecen otros campos

        when(gastoRepository.save(any(Gasto.class))).thenReturn(gasto);

        // Act
        GastoDTO resultado = gastoService.crearGasto(dtoMinimo);

        // Assert
        assertNotNull(resultado);
        verify(gastoRepository).save(any(Gasto.class));
    }

    @Test
    void testActualizarGasto_ConCamposOpcionalesNulos() {
        // Arrange
        GastoDTO dtoConCamposOpcionalesNulos = new GastoDTO();
        dtoConCamposOpcionalesNulos.setDescripcion("Descripción actualizada");
        dtoConCamposOpcionalesNulos.setPrecio(new BigDecimal("75.50"));
        dtoConCamposOpcionalesNulos.setCantidad(2);
        dtoConCamposOpcionalesNulos.setFechaGasto(LocalDate.of(2024, 2, 1));
        // Solo los campos opcionales pueden ser nulos
        dtoConCamposOpcionalesNulos.setCategoria(null);
        dtoConCamposOpcionalesNulos.setProveedor(null);
        dtoConCamposOpcionalesNulos.setObservaciones(null);

        when(gastoRepository.findById(1L)).thenReturn(Optional.of(gasto));
        when(gastoRepository.save(any(Gasto.class))).thenReturn(gasto);

        // Act
        GastoDTO resultado = gastoService.actualizarGasto(1L, dtoConCamposOpcionalesNulos);

        // Assert
        assertNotNull(resultado);
        assertEquals("Descripción actualizada", resultado.getDescripcion());
        assertEquals(new BigDecimal("75.50"), resultado.getPrecio());
        assertEquals(2, resultado.getCantidad());
        assertEquals(LocalDate.of(2024, 2, 1), resultado.getFechaGasto());
        verify(gastoRepository).findById(1L);
        verify(gastoRepository).save(gasto);
    }

    @Test
    void testBuscarGastosPorDescripcion_DescripcionVacia() {
        // Arrange
        String descripcion = "";
        List<Gasto> gastos = Arrays.asList(gasto);
        when(gastoRepository.findByDescripcionContainingIgnoreCaseOrderByFechaGastoDesc(descripcion)).thenReturn(gastos);

        // Act
        List<GastoDTO> resultado = gastoService.buscarGastosPorDescripcion(descripcion);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(gastoRepository).findByDescripcionContainingIgnoreCaseOrderByFechaGastoDesc(descripcion);
    }

    @Test
    void testObtenerGastosPorFecha_FechasIguales() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        List<Gasto> gastos = Arrays.asList(gasto);
        when(gastoRepository.findByFechaGastoBetweenOrderByFechaGastoDesc(fecha, fecha)).thenReturn(gastos);

        // Act
        List<GastoDTO> resultado = gastoService.obtenerGastosPorFecha(fecha, fecha);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(gastoRepository).findByFechaGastoBetweenOrderByFechaGastoDesc(fecha, fecha);
    }
}
