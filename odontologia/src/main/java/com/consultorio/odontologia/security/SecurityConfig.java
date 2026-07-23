package com.consultorio.odontologia.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Desactivar CSRF (para APIs REST sin sesión/cookies)
                .csrf(AbstractHttpConfigurer::disable)
                // Activar CORS usando nuestra configuración
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Sin sesión HTTP: cada request se autentica con su propio JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Sin esto, Spring Security devuelve 403 (no 401) cuando falta o es
                // inválido el token, porque no hay login form/httpBasic configurado.
                // El frontend espera un 401 para cerrar la sesión y mandar al login.
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setStatus(401);
                    response.getWriter().write("{\"error\":\"No autenticado\"}");
                }))
                // Configuración de rutas y permisos
                .authorizeHttpRequests(authz -> authz
                        // Preflight (OPTIONS) en cualquier endpoint - PRIMERO
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Únicos endpoints públicos: login, registro, chequeo de email
                        .requestMatchers("/api/auth/**").permitAll()

                        // Todo lo demás requiere un JWT válido
                        .anyRequest().authenticated()
                )
                // Validar el JWT antes del filtro estándar de usuario/contraseña
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir todos los subdominios de Vercel, Railway y localhost
        configuration.addAllowedOriginPattern("https://*.vercel.app");
        configuration.addAllowedOriginPattern("https://consultorioodontologicoaqua-production-0ffa.up.railway.app");
        configuration.addAllowedOriginPattern("http://localhost:3000");
        configuration.addAllowedOriginPattern("http://localhost:5173");
        // Electron production: file:// requests arrive with Origin: null
        configuration.addAllowedOrigin("null");

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList(
                "Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers"
        ));

        // Permitir cookies o credenciales
        configuration.setAllowCredentials(true);

        // Duración máxima del preflight
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
