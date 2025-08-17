package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.GastoDTO;
import com.consultorio.odontologia.service.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
public class GastoController {

    @Autowired
    private GastoService gastoService;

    // Crear un nuevo gasto
    @PostMapping
    public ResponseEntity<GastoDTO> crearGasto(@RequestBody GastoDTO gastoDTO) {
        try {
            GastoDTO nuevoGasto = gastoService.crearGasto(gastoDTO);
            return ResponseEntity.ok(nuevoGasto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener todos los gastos
    @GetMapping
    public ResponseEntity<List<GastoDTO>> obtenerTodosLosGastos() {
        try {
            List<GastoDTO> gastos = gastoService.obtenerTodosLosGastos();
            return ResponseEntity.ok(gastos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Obtener gastos por rango de fechas
    @GetMapping("/por-fecha")
    public ResponseEntity<List<GastoDTO>> obtenerGastosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            List<GastoDTO> gastos = gastoService.obtenerGastosPorFecha(fechaInicio, fechaFin);
            return ResponseEntity.ok(gastos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Obtener gastos por categoría
    @GetMapping("/por-categoria/{categoria}")
    public ResponseEntity<List<GastoDTO>> obtenerGastosPorCategoria(@PathVariable String categoria) {
        try {
            List<GastoDTO> gastos = gastoService.obtenerGastosPorCategoria(categoria);
            return ResponseEntity.ok(gastos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Calcular total de gastos en un rango de fechas
    @GetMapping("/total-por-fecha")
    public ResponseEntity<BigDecimal> calcularTotalGastosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            BigDecimal total = gastoService.calcularTotalGastosPorFecha(fechaInicio, fechaFin);
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Calcular total de gastos por categoría en un rango de fechas
    @GetMapping("/total-por-categoria-y-fecha")
    public ResponseEntity<BigDecimal> calcularTotalGastosPorCategoriaYFecha(
            @RequestParam String categoria,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            BigDecimal total = gastoService.calcularTotalGastosPorCategoriaYFecha(categoria, fechaInicio, fechaFin);
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Obtener todas las categorías
    @GetMapping("/categorias")
    public ResponseEntity<List<String>> obtenerTodasLasCategorias() {
        try {
            List<String> categorias = gastoService.obtenerTodasLasCategorias();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Buscar gastos por descripción
    @GetMapping("/buscar")
    public ResponseEntity<List<GastoDTO>> buscarGastosPorDescripcion(@RequestParam String descripcion) {
        try {
            List<GastoDTO> gastos = gastoService.buscarGastosPorDescripcion(descripcion);
            return ResponseEntity.ok(gastos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Actualizar un gasto
    @PutMapping("/{id}")
    public ResponseEntity<GastoDTO> actualizarGasto(@PathVariable Long id, @RequestBody GastoDTO gastoDTO) {
        try {
            GastoDTO gastoActualizado = gastoService.actualizarGasto(id, gastoDTO);
            return ResponseEntity.ok(gastoActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Eliminar un gasto
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarGasto(@PathVariable Long id) {
        try {
            gastoService.eliminarGasto(id);
            return ResponseEntity.ok("Gasto eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar gasto");
        }
    }

    // Obtener un gasto por ID
    @GetMapping("/{id}")
    public ResponseEntity<GastoDTO> obtenerGastoPorId(@PathVariable Long id) {
        try {
            GastoDTO gasto = gastoService.obtenerGastoPorId(id);
            return ResponseEntity.ok(gasto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 