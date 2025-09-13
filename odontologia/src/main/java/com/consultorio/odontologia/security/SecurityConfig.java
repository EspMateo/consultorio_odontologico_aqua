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
                        // Preflight (OPTIONS) en cualquier endpoint - PRIMERO
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        
                        // Endpoints públicos (autenticación)
                        .requestMatchers("/api/auth/**").permitAll()

                        // CITAS - Específico y primero
                        .requestMatchers("/api/citas/**").permitAll()
                        
                        // Pacientes
                        .requestMatchers("/api/pacientes/**").permitAll()
                        
                        // Diagnósticos
                        .requestMatchers("/api/diagnosticos/**").permitAll()
                        
                        // Tratamientos
                        .requestMatchers("/api/tratamientos/**").permitAll()
                        
                        // Odontogramas
                        .requestMatchers("/api/odontograma/**").permitAll()
                        .requestMatchers("/api/odontogramas/**").permitAll()
                        
                        // Periodoncia
                        .requestMatchers("/api/periodoncia/**").permitAll()
                        .requestMatchers("/api/periodontograma/**").permitAll()
                        
                        // Presupuestos
                        .requestMatchers("/api/presupuesto/**").permitAll()
                        
                        // Gastos
                        .requestMatchers("/api/gastos/**").permitAll()

                        // Historia clínica
                        .requestMatchers("/api/historia-clinica/**").permitAll()

                        // Usuarios
                        .requestMatchers("/api/usuarios/**").permitAll()

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
