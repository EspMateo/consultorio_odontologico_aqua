# Guía para Convertir la Aplicación en App de Escritorio

Esta guía explica cómo convertir tu aplicación web React en una aplicación de escritorio usando **Electron**.

## ¿Qué es Electron?

Electron es un framework que permite crear aplicaciones de escritorio usando tecnologías web (HTML, CSS, JavaScript). Ejemplos famosos: VS Code, Discord, Slack, WhatsApp Desktop.

## Opción 1: Electron (Recomendado)

### Paso 1: Instalar Electron y dependencias

```bash
cd fronendvite/consultorioOdontologicoAqua
npm install --save-dev electron electron-builder concurrently wait-on
```

### Paso 2: Crear el archivo principal de Electron

Crea un archivo `electron/main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // En desarrollo, carga desde Vite
  // En producción, carga el build estático
  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

### Paso 3: Crear preload.js (opcional, para seguridad)

Crea `electron/preload.js`:

```javascript
const { contextBridge } = require('electron');

// Expone APIs seguras al renderer si es necesario
contextBridge.exposeInMainWorld('electronAPI', {
  // Aquí puedes exponer funciones seguras si las necesitas
});
```

### Paso 4: Actualizar package.json

Agrega estos scripts a tu `package.json`:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:pack": "npm run build && electron-builder --dir"
  },
  "build": {
    "appId": "com.consultorio.odontologia.aqua",
    "productName": "Consultorio Odontológico Aqua",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "build/icon.png"
    }
  }
}
```

### Paso 5: Configurar para App de Escritorio

#### Opción A: Backend embebido (Recomendado para app standalone)

Necesitarías empaquetar el backend Spring Boot también. Esto es más complejo pero permite una app completamente independiente.

#### Opción B: Backend remoto (Más simple)

La app de escritorio se conecta a un backend remoto (tu servidor en producción o local).

Actualiza `config.js` para detectar si está en Electron:

```javascript
// Detectar si estamos en Electron
const isElectron = window.require !== undefined || 
  (window.process && window.process.type === 'renderer');

// Configuración de la API
// En Electron, puedes usar una URL diferente o el backend local
export const API_BASE_URL = isElectron 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8080/api')
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
```

### Paso 6: Ejecutar en desarrollo

```bash
# Terminal 1: Backend
cd ../
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2: Frontend + Electron
cd fronendvite/consultorioOdontologicoAqua
npm run electron:dev
```

### Paso 7: Construir la app

```bash
npm run electron:build
```

Esto generará ejecutables en la carpeta `release/`.

## Opción 2: Tauri (Alternativa más ligera)

Tauri es una alternativa más moderna y ligera que Electron. Usa Rust en lugar de Node.js.

### Instalación:

```bash
npm install --save-dev @tauri-apps/cli
npm install @tauri-apps/api
```

### Configuración:

1. Crea `src-tauri/tauri.conf.json`
2. Actualiza `package.json` con scripts de Tauri
3. Ejecuta `npm run tauri dev` para desarrollo
4. Ejecuta `npm run tauri build` para construir

**Ventajas de Tauri:**
- Apps más pequeñas (mucho más ligeras que Electron)
- Mejor rendimiento
- Más seguro por defecto

**Desventajas:**
- Requiere Rust instalado
- Menos maduro que Electron
- Menos recursos y ejemplos

## Opción 3: PWA (Progressive Web App)

Puedes convertir tu app en una PWA que se puede "instalar" en el escritorio:

1. Crea `public/manifest.json`
2. Agrega un service worker
3. Los usuarios pueden "instalar" la app desde el navegador

**Ventajas:**
- No requiere cambios grandes en el código
- Funciona en web y como "app instalada"
- No necesita empaquetado

**Desventajas:**
- Sigue siendo una web app, no una app nativa
- Limitaciones de acceso al sistema

## Recomendación

Para tu caso, recomiendo:

1. **Corto plazo**: Usa Electron con backend remoto (Opción 1, Opción B)
   - Más rápido de implementar
   - Puedes usar tu backend actual
   - Los usuarios necesitan conexión a internet o el backend local

2. **Largo plazo**: Si quieres una app completamente standalone, considera empaquetar el backend también o usar Tauri

## Archivos a Crear

1. `electron/main.js` - Proceso principal de Electron
2. `electron/preload.js` - Script de preload (seguridad)
3. Actualizar `package.json` con scripts de Electron
4. Opcional: Iconos en `build/icon.*` para diferentes plataformas

## Notas Importantes

- En desarrollo, Electron carga desde `http://localhost:5173`
- En producción, carga desde `dist/index.html`
- Necesitas construir el frontend (`npm run build`) antes de empaquetar
- El backend debe estar accesible (local o remoto) para que la app funcione

