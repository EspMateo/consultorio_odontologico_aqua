package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.CitaDTO;
import com.consultorio.odontologia.entity.Cita;
import com.consultorio.odontologia.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @PostMapping
    public ResponseEntity<Cita> crearCita(@RequestBody CitaDTO citaDTO) {
        Cita cita = citaService.crearCita(citaDTO);
        return ResponseEntity.ok(cita);
    }

    @GetMapping
    public ResponseEntity<List<CitaDTO>> obtenerTodasLasCitas() {
        List<CitaDTO> citas = citaService.obtenerTodasLasCitas();
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<CitaDTO>> obtenerCitasPorFecha(@PathVariable String fecha) {
        List<CitaDTO> citas = citaService.obtenerCitasPorFecha(fecha);
        return ResponseEntity.ok(citas);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCita(@PathVariable Long id) {
        try {
            citaService.eliminarCita(id);
            return ResponseEntity.ok("Cita eliminada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 