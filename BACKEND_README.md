# 📚 BibliOS - Backend SQLite

## 🎯 **Descripción**

Este es el backend completo de **BibliOS**, un sistema de gestión bibliotecaria offline desarrollado con **Electron** y **SQLite**. El sistema funciona completamente sin conexión a internet y almacena todos los datos localmente en el dispositivo.

## 🏗️ **Arquitectura**

```
BibliOS/
├── src/
│   ├── main/                    # Proceso principal de Electron
│   │   ├── main.js             # Punto de entrada principal
│   │   ├── preload.js          # Script de precarga seguro
│   │   ├── database/           # Servicios de base de datos
│   │   │   └── database.js     # Servicio principal de SQLite
│   │   ├── ipc/                # Comunicación entre procesos
│   │   │   └── databaseHandlers.js # Manejadores IPC
│   │   └── services/           # Servicios adicionales
│   └── renderer/               # Frontend React (ya existente)
├── database/                   # Archivos de base de datos
└── electron/                   # Configuración de Electron
```

## 🚀 **Características Principales**

### **✅ Base de Datos SQLite**
- **Completamente offline** - No requiere conexión a internet
- **Datos persistentes** - Se guardan en el dispositivo del usuario
- **Rápida y eficiente** - SQLite es muy ligero y rápido
- **Relaciones complejas** - Soporta foreign keys y joins
- **Backup automático** - Sistema de respaldos integrado

### **✅ Sistema Multi-tenant**
- **Múltiples bibliotecas** - Cada usuario puede gestionar varias bibliotecas
- **Aislamiento de datos** - Cada biblioteca tiene sus propios datos
- **Biblioteca activa** - Sistema de cambio entre bibliotecas

### **✅ Gestión Completa**
- **Bibliotecas** - Información y configuración
- **Libros** - Catálogo completo con ISBN, categorías, ubicaciones
- **Socios** - Usuarios registrados con historial
- **Préstamos** - Control de préstamos, devoluciones y vencimientos
- **Estadísticas** - Reportes en tiempo real

## 🛠️ **Instalación y Configuración**

### **1. Dependencias Requeridas**
```bash
npm install better-sqlite3 electron-store
```

### **2. Estructura de Archivos**
Los archivos principales ya están creados:
- `src/main/database/database.js` - Servicio de base de datos
- `src/main/ipc/databaseHandlers.js` - Manejadores IPC
- `src/main/preload.js` - Script de precarga
- `src/main/main.js` - Proceso principal actualizado
- `frontend/src/hooks/useDatabase.js` - Hook personalizado

### **3. Configuración de Electron**
El archivo `main.js` ya está configurado con:
- Context isolation habilitado
- Preload script configurado
- Manejo de errores robusto
- Cierre limpio de la base de datos

## 📊 **Modelo de Base de Datos**

### **Tabla: bibliotecas**
```sql
CREATE TABLE bibliotecas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    responsable TEXT,
    horarios TEXT,
    descripcion TEXT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT 0
);
```

### **Tabla: libros**
```sql
CREATE TABLE libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    isbn TEXT,
    categoria TEXT,
    editorial TEXT,
    anioPublicacion INTEGER,
    cantidad INTEGER DEFAULT 1,
    disponibles INTEGER DEFAULT 1,
    ubicacion TEXT,
    estado TEXT DEFAULT 'disponible',
    descripcion TEXT,
    bibliotecaId INTEGER,
    FOREIGN KEY (bibliotecaId) REFERENCES bibliotecas(id) ON DELETE CASCADE
);
```

### **Tabla: socios**
```sql
CREATE TABLE socios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado TEXT DEFAULT 'activo',
    observaciones TEXT,
    bibliotecaId INTEGER,
    FOREIGN KEY (bibliotecaId) REFERENCES bibliotecas(id) ON DELETE CASCADE
);
```

### **Tabla: prestamos**
```sql
CREATE TABLE prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    libroId INTEGER,
    socioId INTEGER,
    bibliotecaId INTEGER,
    fechaPrestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaDevolucion DATETIME,
    fechaDevolucionReal DATETIME,
    estado TEXT DEFAULT 'activo',
    observaciones TEXT,
    FOREIGN KEY (libroId) REFERENCES libros(id) ON DELETE CASCADE,
    FOREIGN KEY (socioId) REFERENCES socios(id) ON DELETE CASCADE,
    FOREIGN KEY (bibliotecaId) REFERENCES bibliotecas(id) ON DELETE CASCADE
);
```

## 🔌 **APIs Disponibles**

### **Bibliotecas**
```javascript
// Crear biblioteca
await window.electronAPI.createBiblioteca(bibliotecaData);

// Obtener todas las bibliotecas
await window.electronAPI.getBibliotecas();

// Obtener biblioteca activa
await window.electronAPI.getBibliotecaActiva();

// Actualizar biblioteca
await window.electronAPI.updateBiblioteca(id, updates);

// Eliminar biblioteca
await window.electronAPI.deleteBiblioteca(id);

// Activar biblioteca
await window.electronAPI.activateBiblioteca(id);
```

### **Libros**
```javascript
// Crear libro
await window.electronAPI.createLibro(libroData);

// Obtener libros con filtros
await window.electronAPI.getLibros(bibliotecaId, { 
  search: 'título', 
  categoria: 'Ficción' 
});

// Actualizar libro
await window.electronAPI.updateLibro(id, updates);

// Eliminar libro
await window.electronAPI.deleteLibro(id);
```

### **Socios**
```javascript
// Crear socio
await window.electronAPI.createSocio(socioData);

// Obtener socios con filtros
await window.electronAPI.getSocios(bibliotecaId, { 
  search: 'nombre', 
  estado: 'activo' 
});

// Actualizar socio
await window.electronAPI.updateSocio(id, updates);

// Eliminar socio
await window.electronAPI.deleteSocio(id);
```

### **Préstamos**
```javascript
// Crear préstamo
await window.electronAPI.createPrestamo(prestamoData);

// Obtener préstamos
await window.electronAPI.getPrestamos(bibliotecaId, { 
  estado: 'activo' 
});

// Devolver libro
await window.electronAPI.devolverLibro(prestamoId);
```

### **Estadísticas**
```javascript
// Estadísticas generales
await window.electronAPI.getBibliotecaStats(bibliotecaId);

// Préstamos por mes
await window.electronAPI.getPrestamosPorMes(bibliotecaId, 6);

// Libros por categoría
await window.electronAPI.getLibrosPorCategoria(bibliotecaId);
```

## 🎣 **Hook Personalizado useDatabase**

### **Uso Básico**
```javascript
import { useDatabase } from './hooks/useDatabase';

function MiComponente() {
  const { 
    createBiblioteca, 
    getBibliotecas, 
    loading, 
    error 
  } = useDatabase();

  // Usar las funciones...
}
```

### **Funciones Disponibles**
- **Estado**: `loading`, `error`
- **Utilidades**: `clearError`, `isElectronAvailable`
- **Todas las operaciones de base de datos**
- **Información del sistema**

## 🚀 **Ejecutar la Aplicación**

### **Modo Desarrollo**
```bash
# Terminal 1: Frontend React
cd frontend
npm run dev

# Terminal 2: Electron
npm run dev:electron
```

### **Modo Producción**
```bash
# Construir y ejecutar
npm run build
npm start
```

## 🔧 **Configuración Avanzada**

### **Variables de Entorno**
```bash
# Modo desarrollo
NODE_ENV=development

# Modo producción
NODE_ENV=production
```

### **Ruta de Base de Datos**
La base de datos se crea automáticamente en:
- **Windows**: `%APPDATA%/BibliOS/biblios.db`
- **macOS**: `~/Library/Application Support/BibliOS/biblios.db`
- **Linux**: `~/.config/BibliOS/biblios.db`

## 📝 **Logs y Debugging**

### **Logs de la Base de Datos**
```javascript
// En la consola de Electron
console.log('Base de datos inicializada en:', dbPath);
console.log('Tablas creadas correctamente');
```

### **Errores IPC**
```javascript
// Los errores se capturan automáticamente
ipcMain.handle('database:operation', async (event, data) => {
  try {
    return await db.operation(data);
  } catch (error) {
    console.error('Error en operation:', error);
    throw error;
  }
});
```

## 🧪 **Testing y Validación**

### **Datos de Ejemplo**
```javascript
// Insertar datos de prueba
await window.electronAPI.insertSampleData(bibliotecaId);
```

### **Validaciones Integradas**
- **ISBN**: Validación de formato ISBN-10 e ISBN-13
- **Email**: Validación de formato de email
- **Fechas**: Validación y formateo automático
- **Estados**: Control de estados válidos

## 🔒 **Seguridad**

### **Context Isolation**
- **Habilitado** por defecto
- **APIs expuestas** de forma segura
- **Sin acceso directo** a Node.js desde el renderer

### **Validación de Entrada**
- **Sanitización** de datos
- **Validación** de tipos y formatos
- **Prevención** de inyecciones SQL

## 📚 **Recursos Adicionales**

### **Documentación SQLite**
- [SQLite Official](https://www.sqlite.org/)
- [Better-SQLite3](https://github.com/JoshuaWise/better-sqlite3)

### **Documentación Electron**
- [Electron IPC](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)

### **Documentación React**
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Custom Hooks](https://reactjs.org/docs/hooks-custom.html)

## 🆘 **Solución de Problemas**

### **Error: "window.electronAPI is undefined"**
- Verificar que `preload.js` esté configurado correctamente
- Asegurar que `contextIsolation: true` esté habilitado

### **Error: "Database connection failed"**
- Verificar permisos de escritura en el directorio de datos
- Comprobar que `better-sqlite3` esté instalado correctamente

### **Error: "IPC handler not found"**
- Verificar que los manejadores IPC estén registrados
- Comprobar que `DatabaseHandlers` se inicialice correctamente

## 🎉 **¡Listo para Usar!**

El backend de BibliOS está completamente implementado y listo para usar. Todas las funcionalidades principales están disponibles a través de las APIs de Electron, y el hook personalizado `useDatabase` facilita la integración con React.

**¡Disfruta desarrollando tu sistema bibliotecario offline!** 📚✨

