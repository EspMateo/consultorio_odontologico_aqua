package com.consultorio.odontologia.repository;

import com.consultorio.odontologia.entity.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    // Buscar gastos por rango de fechas
    List<Gasto> findByFechaGastoBetweenOrderByFechaGastoDesc(LocalDate fechaInicio, LocalDate fechaFin);

    // Buscar gastos por categoría
    List<Gasto> findByCategoriaOrderByFechaGastoDesc(String categoria);

    // Calcular total de gastos en un rango de fechas
    @Query("SELECT COALESCE(SUM(g.precio * g.cantidad), 0) FROM Gasto g WHERE g.fechaGasto BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal calcularTotalGastosPorFecha(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    // Calcular total de gastos por categoría en un rango de fechas
    @Query("SELECT COALESCE(SUM(g.precio * g.cantidad), 0) FROM Gasto g WHERE g.categoria = :categoria AND g.fechaGasto BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal calcularTotalGastosPorCategoriaYFecha(@Param("categoria") String categoria, @Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    // Obtener todas las categorías únicas
    @Query("SELECT DISTINCT g.categoria FROM Gasto g WHERE g.categoria IS NOT NULL")
    List<String> findAllCategorias();

    // Buscar gastos por descripción (búsqueda parcial)
    List<Gasto> findByDescripcionContainingIgnoreCaseOrderByFechaGastoDesc(String descripcion);
} 