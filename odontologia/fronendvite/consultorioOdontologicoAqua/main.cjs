const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const net = require('net');

let mainWindow;
let backendProcess;

const BACKEND_PORT = 8080;
const isDev = !app.isPackaged;

// ─── Backend lifecycle ────────────────────────────────────────────────────────

function findJava() {
  return new Promise((resolve, reject) => {
    exec('java -version', (error) => {
      if (error) reject(new Error('Java not found'));
      else resolve();
    });
  });
}

function waitForPort(port, maxAttempts) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryConnect = () => {
      if (attempts >= maxAttempts) {
        return reject(new Error(`Backend no respondió después de ${maxAttempts} segundos`));
      }
      attempts++;

      const socket = net.createConnection({ port, host: '127.0.0.1' });
      socket.setTimeout(800);
      socket.on('connect', () => { socket.destroy(); resolve(); });
      socket.on('error', () => { socket.destroy(); setTimeout(tryConnect, 1000); });
      socket.on('timeout', () => { socket.destroy(); setTimeout(tryConnect, 1000); });
    };

    // Give JVM a head start before polling
    setTimeout(tryConnect, 3000);
  });
}

function startBackend() {
  // In dev mode the developer runs the backend manually
  if (isDev) {
    console.log('[Dev] Backend spawn skipped — run manually: ./mvnw spring-boot:run');
    return Promise.resolve();
  }

  const jarPath = path.join(process.resourcesPath, 'backend.jar');

  return findJava()
    .then(() => new Promise((resolve, reject) => {
      console.log('[Backend] Starting JAR:', jarPath);

      backendProcess = spawn('java', [
        '-jar', jarPath,
        '--spring.profiles.active=desktop',
      ], {
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
        detached: false,
      });

      backendProcess.stdout.on('data', (d) => process.stdout.write(`[SB] ${d}`));
      backendProcess.stderr.on('data', (d) => process.stdout.write(`[SB] ${d}`));

      backendProcess.on('error', (err) => {
        reject(new Error(`No se pudo iniciar el backend: ${err.message}`));
      });

      // Detect early crash — reject immediately instead of waiting 60s
      backendProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          reject(new Error(`El servidor terminó inesperadamente (código ${code}). Revisa que el puerto 8080 no esté en uso.`));
        }
      });

      waitForPort(BACKEND_PORT, 60).then(resolve).catch(reject);
    }))
    .catch((err) => {
      const isNoJava = err.message === 'Java not found';
      dialog.showErrorBox(
        isNoJava ? 'Java requerido' : 'Error al iniciar el sistema',
        isNoJava
          ? 'No se encontró Java en el sistema.\n\nInstala Java 17 o superior desde:\nhttps://adoptium.net\n\nLuego reinicia la aplicación.'
          : `Error: ${err.message}\n\nRevisa que el archivo no esté corrompido y vuelve a instalar la aplicación.`
      );
      app.quit();
      return Promise.reject(err);
    });
}

// ─── Window ───────────────────────────────────────────────────────────────────

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Consultorio Odontológico AQUA',
    center: true,
    autoHideMenuBar: true,
    backgroundColor: isDev ? '#ffffff' : '#1565c0',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ─── App startup ──────────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  createWindow();

  if (isDev) {
    // Development: load Vite dev server directly, no loading screen
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(devUrl);
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  } else {
    // Production: show loading screen while Spring Boot starts
    const loadingPath = path.join(__dirname, 'loading.html');
    console.log('[Main] loading.html path:', loadingPath);
    console.log('[Main] __dirname:', __dirname);
    console.log('[Main] isPackaged:', app.isPackaged);

    mainWindow.loadFile(loadingPath);
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });

    const setStatus = (msg) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.executeJavaScript(
          `document.getElementById('status') && (document.getElementById('status').textContent = ${JSON.stringify(msg)})`
        ).catch(() => {});
      }
    };

    try {
      setStatus('Verificando Java...');
      await startBackend();
      setStatus('Cargando app...');
      mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    } catch (err) {
      console.error('[App] Startup failed:', err.message);
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Kill backend process when app exits
app.on('quit', () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill('SIGTERM');
  }
});

// ─── Security: block external navigation ─────────────────────────────────────

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, url) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:8080',
      'file://',
    ];
    if (!allowed.some((prefix) => url.startsWith(prefix))) {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(() => ({ action: 'deny' }));

  contents.on('did-fail-load', (event, code, description, url) => {
    console.error(`[Load error] ${code} ${description} — ${url}`);
  });
});
