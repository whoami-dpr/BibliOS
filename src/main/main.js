const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Mantener una referencia global del objeto de ventana
let mainWindow;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../renderer/assets/BibliOS_Logo.png'),
    title: 'BibliOS - Sistema de Gestión Bibliotecaria',
    show: false, // No mostrar hasta que esté listo
    autoHideMenuBar: true
  });

  // Cargar la app de Vite en modo desarrollo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    
    // Abrir DevTools en desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar desde el build
    mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
  }

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Enfocar la ventana
    mainWindow.focus();
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Error al cargar la aplicación:', errorCode, errorDescription);
    
    // Reintentar cargar en caso de error
    setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
      } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
      }
    }, 2000);
  });

  // Emitir evento cuando la ventana esté lista
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Aplicación cargada correctamente');
  });

  // Manejar cierre de ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Inicializar la aplicación
app.whenReady().then(() => {
  try {
    // Crear la ventana principal
    createWindow();
    
    // Configurar eventos de la aplicación
    setupAppEvents();
    
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    app.quit();
  }
});

// Configurar eventos de la aplicación
function setupAppEvents() {
  // Cuando todas las ventanas estén cerradas, cerrar la app
  app.on('window-all-closed', () => {
    // En macOS, mantener la app activa cuando se cierran todas las ventanas
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // En macOS, recrear la ventana cuando se hace clic en el icono del dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Manejar el cierre de la aplicación
  app.on('before-quit', async (event) => {
    event.preventDefault();
    
    try {
      console.log('Cerrando aplicación...');
      
      // Cerrar la aplicación
      app.quit();
    } catch (error) {
      console.error('Error al cerrar la aplicación:', error);
      app.quit();
    }
  });

  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
    
    // En desarrollo, mostrar el error
    if (process.env.NODE_ENV === 'development' && mainWindow) {
      mainWindow.webContents.send('app:error', {
        message: 'Error interno de la aplicación',
        error: error.message
      });
    }
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa rechazada no manejada:', reason);
    
    // En desarrollo, mostrar el error
    if (process.env.NODE_ENV === 'development' && mainWindow) {
      mainWindow.webContents.send('app:error', {
        message: 'Error interno de la aplicación',
        error: reason
      });
    }
  });
}

// Configurar variables de entorno
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_ENV = 'development';
  console.log('Modo desarrollo activado');
} else {
  process.env.NODE_ENV = 'production';
  console.log('Modo producción activado');
}

// Configurar el protocolo de la aplicación
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('biblios', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('biblios');
}

// Exportar para uso en otros módulos
module.exports = { mainWindow }; 