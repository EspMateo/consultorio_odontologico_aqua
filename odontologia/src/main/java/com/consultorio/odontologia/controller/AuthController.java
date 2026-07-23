package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.security.JwtUtil;
import com.consultorio.odontologia.security.LoginRateLimiter;
import com.consultorio.odontologia.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private LoginRateLimiter loginRateLimiter;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        try {
            String email = usuario.getEmail();

            if (loginRateLimiter.estaBloqueado(email)) {
                long minutos = loginRateLimiter.minutosRestantesDeBloqueo(email);
                return ResponseEntity.status(429).body(
                    "Demasiados intentos fallidos. Probá de nuevo en " + minutos + " minuto(s)."
                );
            }

            Optional<Usuario> userOpt = usuarioService.login(email, usuario.getPassword());
            if (userOpt.isPresent()) {
                Usuario user = userOpt.get();
                loginRateLimiter.registrarLoginExitoso(email);
                String token = jwtUtil.generateToken(user.getId(), user.getEmail());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("id", user.getId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                return ResponseEntity.ok(response);
            } else {
                loginRateLimiter.registrarIntentoFallido(email);
                return ResponseEntity.badRequest().body("Credenciales incorrectas");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error en el servidor");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Usuario usuario) {
        try {
            // Validar que el email no esté vacío
            if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es obligatorio");
            }
            
            // Validar que la contraseña no esté vacía
            if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La contraseña es obligatoria");
            }
            
            // Validar que el nombre no esté vacío
            if (usuario.getName() == null || usuario.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }
            
            Usuario savedUser = usuarioService.save(usuario);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor. Por favor, inténtalo de nuevo.");
        }
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailExists(@PathVariable String email) {
        try {
            boolean exists = usuarioService.existsByEmail(email);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al verificar el email");
        }
    }
}
