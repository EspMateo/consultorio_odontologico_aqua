# 📱 Explicación: App de Escritorio con Electron

## ¿Cómo funciona lo que ya tienes?

### 1. **Archivo `main.cjs` - El Proceso Principal**

El archivo `main.cjs` es el **corazón de tu aplicación Electron**. Aquí está lo que hace cada parte:

#### **`createWindow()` - Crea la ventana de la aplicación**
```javascript
function createWindow() {
  const win = new BrowserWindow({ ... });
}
```
- **`BrowserWindow`**: Crea una ventana nativa del sistema operativo
- **`width: 1200, height: 800`**: Tamaño inicial de la ventana
- **`webPreferences`**: Configuración de seguridad importante:
  - `nodeIntegration: false` → Previene que el código web acceda a Node.js directamente (seguridad)
  - `contextIsolation: true` → Aísla el contexto del renderer (seguridad)

#### **Carga de la aplicación**
```javascript
if (process.env.VITE_DEV_SERVER_URL) {
  win.loadURL(process.env.VITE_DEV_SERVER_URL);  // Desarrollo: http://localhost:5173
} else {
  win.loadFile(path.join(__dirname, "dist/index.html"));  // Producción: archivos estáticos
}
```
- **En desarrollo**: Carga desde el servidor de Vite (hot reload funciona)
- **En producción**: Carga desde los archivos compilados en `dist/`

#### **`app.whenReady()` - Inicialización**
```javascript
app.whenReady().then(createWindow);
```
- Espera a que Electron esté completamente inicializado antes de crear la ventana

---

## ✅ Lo que ya funciona

1. ✅ **Creación básica de ventana** - La app se abre en una ventana
2. ✅ **Carga en desarrollo** - Se conecta al servidor de Vite
3. ✅ **Carga en producción** - Usa los archivos compilados
4. ✅ **Configuración de seguridad básica** - Node integration deshabilitado

---

## 🔧 Mejoras que acabo de agregar

### 1. **Manejo completo de eventos de Electron**

#### **`window-all-closed`** - Cerrar la app correctamente
```javascript
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();  // En Windows/Linux, cerrar todas las ventanas = salir
  }
  // En macOS, las apps se mantienen activas sin ventanas
});
```

#### **`activate`** - Recrear ventana en macOS
```javascript
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();  // Si no hay ventanas, crear una nueva
  }
});
```

### 2. **Mejoras visuales**
- `show: false` → No mostrar hasta que esté lista (evita parpadeo)
- `ready-to-show` → Mostrar solo cuando esté completamente cargada
- DevTools automático en desarrollo

### 3. **Scripts mejorados en `package.json`**
- `electron:dev` → Inicia Vite y Electron juntos automáticamente
- `electron:start` → Solo inicia Electron (si Vite ya está corriendo)
- `electron:pack` → Crea una versión empaquetada sin instalador

### 4. **Detección de Electron en `config.js`**
- La app ahora detecta si está corriendo en Electron
- Puede usar diferentes configuraciones según el entorno

---

## 🚀 Qué más deberías hacer

### **PRIORIDAD ALTA** ⚠️

#### 1. **Instalar dependencias faltantes**
```bash
cd fronendvite/consultorioOdontologicoAqua
npm install
```
Esto instalará `concurrently` y `wait-on` que agregué a las dependencias.

#### 2. **Probar la aplicación en desarrollo**
```bash
# Terminal 1: Backend (debe estar corriendo)
cd ../../
./mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2: Frontend + Electron
cd fronendvite/consultorioOdontologicoAqua
npm run electron:dev
```

#### 3. **Agregar un icono para la aplicación**
Crea una carpeta `build/` y agrega:
- `build/icon.ico` (Windows)
- `build/icon.png` (Linux)
- `build/icon.icns` (macOS)

Luego actualiza `main.cjs`:
```javascript
icon: path.join(__dirname, 'build/icon.ico'),  // En Windows
```

Y `package.json`:
```json
"win": {
  "target": "nsis",
  "icon": "build/icon.ico"
}
```

### **PRIORIDAD MEDIA** 📋

#### 4. **Mejorar la configuración de electron-builder**
En `package.json`, puedes agregar más opciones:
```json
"build": {
  "appId": "com.consultorio.odontologico.aqua",
  "productName": "Consultorio Odontológico Aqua",
  "directories": {
    "output": "release"
  },
  "files": [
    "dist/**/*",
    "main.cjs",
    "package.json"
  ],
  "win": {
    "target": "nsis",
    "icon": "build/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

#### 5. **Manejar actualizaciones automáticas (opcional)**
Puedes usar `electron-updater` para actualizaciones automáticas:
```bash
npm install electron-updater
```

#### 6. **Agregar menú de aplicación (opcional)**
Crea un menú personalizado:
```javascript
const { Menu } = require('electron');

const template = [
  {
    label: 'Archivo',
    submenu: [
      { role: 'quit' }
    ]
  },
  {
    label: 'Editar',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

### **PRIORIDAD BAJA** 💡

#### 7. **Agregar preload script (para más seguridad)**
Crea `preload.js`:
```javascript
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Expone APIs seguras si las necesitas
  platform: process.platform
});
```

Y actualiza `main.cjs`:
```javascript
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  // ...
}
```

#### 8. **Manejar errores de red**
Agrega manejo de errores cuando el backend no esté disponible:
```javascript
mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
  if (errorCode === -106) {
    // Error de conexión
    console.error('No se pudo conectar al backend');
  }
});
```

---

## 📝 Cómo probar todo

### **Desarrollo:**
```bash
# 1. Backend corriendo en otra terminal
# 2. Ejecutar:
npm run electron:dev
```

### **Producción (build):**
```bash
# 1. Construir la app
npm run electron:build

# 2. El ejecutable estará en: release/
```

---

## ⚠️ Notas importantes

1. **El backend debe estar corriendo** - La app de escritorio se conecta a `http://localhost:8080/api`
2. **En producción**, necesitarás configurar la URL del backend en `config.js` o usar variables de entorno
3. **Para una app completamente standalone**, necesitarías empaquetar el backend también (más complejo)

---

## 🎯 Resumen

**Lo que ya tienes:**
- ✅ Ventana básica funcionando
- ✅ Carga en desarrollo y producción
- ✅ Seguridad básica configurada

**Lo que agregué:**
- ✅ Manejo completo de eventos
- ✅ Scripts mejorados
- ✅ Detección de Electron en config.js
- ✅ Mejoras visuales

**Lo que falta:**
- ⚠️ Instalar dependencias (`npm install`)
- ⚠️ Probar la aplicación
- 📋 Agregar icono
- 💡 Mejoras opcionales (menú, preload, etc.)

