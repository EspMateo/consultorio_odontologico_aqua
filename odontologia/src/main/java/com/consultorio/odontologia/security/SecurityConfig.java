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
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        // Endpoints de autenticación
                        .requestMatchers("/api/auth/**").permitAll()

                        // Endpoints de pacientes
                        .requestMatchers("/api/pacientes/**").permitAll()

                        // Endpoints de citas
                        .requestMatchers("/api/citas/**").permitAll()

                        // Endpoints de diagnóstico
                        .requestMatchers("/api/diagnosticos/**").permitAll()

                        // Endpoints de tratamiento
                        .requestMatchers("/api/tratamientos/**").permitAll()

                        // Endpoints de odontograma
                        .requestMatchers("/api/odontograma/**").permitAll()

                        // Endpoints de periodoncia
                        .requestMatchers("/api/periodoncia/**").permitAll()

                        // Endpoints de periodontograma
                        .requestMatchers("/api/periodontograma/**").permitAll()

                        // Endpoints de historia clínica - TODOS los métodos
                        .requestMatchers("GET", "/api/historia-clinica/**").permitAll()
                        .requestMatchers("POST", "/api/historia-clinica/**").permitAll()
                        .requestMatchers("PUT", "/api/historia-clinica/**").permitAll()
                        .requestMatchers("DELETE", "/api/historia-clinica/**").permitAll()

                        // Endpoints de usuarios
                        .requestMatchers("/api/usuarios/**").permitAll()

                        // Importante: permitir preflight (OPTIONS) en cualquier endpoint
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Permitir todo lo demás
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Configurar orígenes específicos para producción y desarrollo
        // Configurar orígenes permitidos (producción + pre-prod + preview + local)
        configuration.setAllowedOrigins(Arrays.asList(
                "https://consultorioodontologicoaqua-production-20be.up.railway.app/",
                "http://localhost:3000",
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        configuration.setAllowCredentials(true);
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
