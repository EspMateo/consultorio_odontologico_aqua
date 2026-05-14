# Guía de Desarrollo Local

## Configuración para Desarrollo Local

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto frontend (`fronendvite/consultorioOdontologicoAqua/`) con el siguiente contenido:

```env
VITE_API_URL=http://localhost:8080/api
```

Este archivo ya está configurado en `.gitignore` para que no se suba al repositorio.

### 2. Ejecutar el Backend (Spring Boot)

1. Asegúrate de tener MySQL corriendo localmente
2. Configura la base de datos en `src/main/resources/application-dev.properties`
3. Ejecuta el backend:

```bash
# Desde la raíz del proyecto
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

O si estás en Windows:
```bash
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

El backend estará disponible en: `http://localhost:8080`

### 3. Ejecutar el Frontend (React + Vite)

1. Navega a la carpeta del frontend:
```bash
cd fronendvite/consultorioOdontologicoAqua
```

2. Instala las dependencias (si no lo has hecho):
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### 4. Verificar la Configuración

- El frontend usa `config.js` que lee `VITE_API_URL` de las variables de entorno
- Si no hay variable de entorno, por defecto usa `http://localhost:8080/api`
- Todas las llamadas API usan la función `buildApiUrl()` de `config.js`

## Cambiar entre Desarrollo Local y Producción

### Para Desarrollo Local:
- Crea/usa `.env.local` con `VITE_API_URL=http://localhost:8080/api`
- O simplemente no definas la variable y usará el fallback a localhost

### Para Producción:
- Configura `VITE_API_URL` en tu plataforma de despliegue (Vercel, Railway, etc.)
- O crea un archivo `.env.production` con la URL de producción

## Notas Importantes

- El backend debe estar corriendo antes de iniciar el frontend
- El backend está configurado para aceptar CORS desde `http://localhost:5173` (puerto por defecto de Vite)
- Si cambias el puerto del frontend, actualiza `SecurityConfig.java` en el backend

