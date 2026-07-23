package com.consultorio.odontologia.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bloquea temporalmente el login de un email después de varios intentos
 * fallidos seguidos, para frenar ataques de fuerza bruta de contraseñas.
 *
 * Se guarda en memoria (por instancia del backend). Si en algún momento el
 * backend corre en más de una instancia a la vez, conviene mover esto a Redis
 * para que el límite se comparta entre todas.
 */
@Component
public class LoginRateLimiter {

    private static final int MAX_INTENTOS = 5;
    private static final long BLOQUEO_MINUTOS = 5;

    private static class Intentos {
        int fallidos = 0;
        Instant bloqueadoHasta = null;
    }

    private final ConcurrentHashMap<String, Intentos> registro = new ConcurrentHashMap<>();

    public boolean estaBloqueado(String email) {
        Intentos intentos = registro.get(normalizar(email));
        if (intentos == null || intentos.bloqueadoHasta == null) {
            return false;
        }
        if (Instant.now().isAfter(intentos.bloqueadoHasta)) {
            registro.remove(normalizar(email));
            return false;
        }
        return true;
    }

    public long minutosRestantesDeBloqueo(String email) {
        Intentos intentos = registro.get(normalizar(email));
        if (intentos == null || intentos.bloqueadoHasta == null) {
            return 0;
        }
        long segundos = Instant.now().until(intentos.bloqueadoHasta, ChronoUnit.SECONDS);
        return Math.max(0, (segundos + 59) / 60);
    }

    public void registrarIntentoFallido(String email) {
        Intentos intentos = registro.computeIfAbsent(normalizar(email), k -> new Intentos());
        intentos.fallidos++;
        if (intentos.fallidos >= MAX_INTENTOS) {
            intentos.bloqueadoHasta = Instant.now().plus(BLOQUEO_MINUTOS, ChronoUnit.MINUTES);
        }
    }

    public void registrarLoginExitoso(String email) {
        registro.remove(normalizar(email));
    }

    private String normalizar(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
