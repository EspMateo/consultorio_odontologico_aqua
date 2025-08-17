package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.GastoDTO;
import com.consultorio.odontologia.entity.Gasto;
import com.consultorio.odontologia.repository.GastoRepository;
import com.consultorio.odontologia.service.util.DTOConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    // Crear nuevo gasto
    public GastoDTO crearGasto(GastoDTO gastoDTO) {
        Gasto gasto = new Gasto(
            gastoDTO.getDescripcion(),
            gastoDTO.getPrecio(),
            gastoDTO.getCantidad(),
            gastoDTO.getFechaGasto(),
            gastoDTO.getCategoria(),
            gastoDTO.getProveedor(),
            gastoDTO.getObservaciones()
        );
        
        Gasto gastoGuardado = gastoRepository.save(gasto);
        return DTOConverter.convertirGastoADTO(gastoGuardado);
    }

    // Obtener todos los gastos
    public List<GastoDTO> obtenerTodosLosGastos() {
        return gastoRepository.findAll().stream()
            .map(DTOConverter::convertirGastoADTO)
            .collect(Collectors.toList());
    }

    // Obtener gastos por rango de fechas
    public List<GastoDTO> obtenerGastosPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        return gastoRepository.findByFechaGastoBetweenOrderByFechaGastoDesc(fechaInicio, fechaFin)
            .stream()
            .map(DTOConverter::convertirGastoADTO)
            .collect(Collectors.toList());
    }

    // Obtener gastos por categoría
    public List<GastoDTO> obtenerGastosPorCategoria(String categoria) {
        return gastoRepository.findByCategoriaOrderByFechaGastoDesc(categoria)
            .stream()
            .map(DTOConverter::convertirGastoADTO)
            .collect(Collectors.toList());
    }

    // Calcular total de gastos en un rango de fechas
    public BigDecimal calcularTotalGastosPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        return gastoRepository.calcularTotalGastosPorFecha(fechaInicio, fechaFin);
    }

    // Calcular total de gastos por categoría en un rango de fechas
    public BigDecimal calcularTotalGastosPorCategoriaYFecha(String categoria, LocalDate fechaInicio, LocalDate fechaFin) {
        return gastoRepository.calcularTotalGastosPorCategoriaYFecha(categoria, fechaInicio, fechaFin);
    }

    // Obtener todas las categorías
    public List<String> obtenerTodasLasCategorias() {
        return gastoRepository.findAllCategorias();
    }

    // Buscar gastos por descripción
    public List<GastoDTO> buscarGastosPorDescripcion(String descripcion) {
        return gastoRepository.findByDescripcionContainingIgnoreCaseOrderByFechaGastoDesc(descripcion)
            .stream()
            .map(DTOConverter::convertirGastoADTO)
            .collect(Collectors.toList());
    }

    // Actualizar un gasto
    public GastoDTO actualizarGasto(Long id, GastoDTO gastoDTO) {
        Gasto gasto = gastoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Gasto no encontrado"));

        gasto.setDescripcion(gastoDTO.getDescripcion());
        gasto.setPrecio(gastoDTO.getPrecio());
        gasto.setCantidad(gastoDTO.getCantidad());
        gasto.setFechaGasto(gastoDTO.getFechaGasto());
        gasto.setCategoria(gastoDTO.getCategoria());
        gasto.setProveedor(gastoDTO.getProveedor());
        gasto.setObservaciones(gastoDTO.getObservaciones());

        Gasto gastoActualizado = gastoRepository.save(gasto);
        return DTOConverter.convertirGastoADTO(gastoActualizado);
    }

    // Eliminar un gasto
    public void eliminarGasto(Long id) {
        gastoRepository.deleteById(id);
    }

    // Obtener un gasto por ID
    public GastoDTO obtenerGastoPorId(Long id) {
        Gasto gasto = gastoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Gasto no encontrado"));
        return DTOConverter.convertirGastoADTO(gasto);
    }
} 