package com.consultorio.odontologia.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Desactivar CSRF (para APIs REST)
                .csrf(AbstractHttpConfigurer::disable)
                // Activar CORS usando nuestra configuración
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Configuración de rutas y permisos
                .authorizeHttpRequests(authz -> authz
                        // Endpoints públicos (autenticación)
                        .requestMatchers("/api/auth/**").permitAll()

                        // Endpoints de pacientes, citas, diagnóstico, tratamiento, odontograma, periodoncia, periodontograma
                        .requestMatchers("/api/pacientes/**",
                                "/api/citas/**",
                                "/api/diagnosticos/**",
                                "/api/tratamientos/**",
                                "/api/odontograma/**",
                                "/api/periodoncia/**",
                                "/api/periodontograma/**").permitAll()

                        // Historia clínica: todos los métodos
                        .requestMatchers("/api/historia-clinica/**").permitAll()

                        // Usuarios
                        .requestMatchers("/api/usuarios/**").permitAll()

                        // Preflight (OPTIONS) en cualquier endpoint
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Cualquier otra ruta
                        .anyRequest().authenticated()
                );

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
