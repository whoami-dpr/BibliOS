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
│   │   │   ├── config.js       # Configuración de BD
│   │   │   └── database.js     # Servicio principal de SQLite
│   │   ├── ipc/                # Comunicación entre procesos
│   │   │   └── databaseHandlers.js # Manejadores IPC
│   │   └── api/                # API Interna (Nueva)
│   │       ├── models/         # Modelos de datos
│   │       │   ├── Book.js     # Modelo de libros
│   │       │   ├── Member.js   # Modelo de socios
│   │       │   └── Loan.js     # Modelo de préstamos
│   │       ├── services/       # Servicios de negocio
│   │       │   ├── BookService.js    # CRUD libros
│   │       │   ├── MemberService.js  # CRUD socios
│   │       │   └── LoanService.js    # CRUD préstamos
│   │       └── InternalAPI.js  # Configuración endpoints
│   └── renderer/               # Frontend React
├── frontend/                   # Frontend React
│   └── src/
│       ├── hooks/
│       │   ├── useDatabase.js  # Hook BD original
│       │   └── useInternalAPI.js # Hook API interna (Nuevo)
│       └── components/
│           └── BooksAPIDemo.jsx # Demo API interna
└── database/                   # Archivos de base de datos
```

## 🚀 **Características Principales**

### **✅ Arquitectura Moderna**
- **Electron + React** - Stack moderna y eficiente para aplicaciones desktop
- **API Interna** - Separación completa entre UI y lógica de negocio
- **Offline-first** - Funciona sin conexión a internet
- **Multiplataforma** - Windows, macOS, Linux

### **✅ Base de Datos SQLite**
- **Completamente offline** - No requiere conexión a internet
- **Datos persistentes** - Se guardan en el dispositivo del usuario
- **Rápida y eficiente** - SQLite es muy ligero y rápido
- **Transacciones ACID** - Integridad de datos garantizada
- **Índices optimizados** - Queries eficientes con índices compuestos

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

### **✅ Validaciones Robustas**
- **Regex avanzadas** - Validación de ISBN, email, fechas
- **Reglas de negocio** - Límites de préstamos, disponibilidad
- **Transacciones seguras** - Operaciones atómicas
- **Manejo de errores** - Sistema robusto de errores

## 🛠️ **Instalación y Configuración**

### **1. Dependencias Requeridas**
```bash
npm install better-sqlite3 electron-store
```

### **2. Estructura de Archivos**
Los archivos principales ya están creados:

**Backend (Node.js/Electron):**
- `src/main/database/database.js` - Servicio de base de datos
- `src/main/ipc/databaseHandlers.js` - Manejadores IPC originales
- `src/main/api/InternalAPI.js` - API interna con endpoints
- `src/main/api/models/` - Modelos de datos (Book, Member, Loan)
- `src/main/api/services/` - Servicios de negocio (BookService, MemberService, LoanService)
- `src/main/preload.js` - Script de precarga actualizado
- `src/main/main.js` - Proceso principal con API interna

**Frontend (React):**
- `frontend/src/hooks/useDatabase.js` - Hook BD original
- `frontend/src/hooks/useInternalAPI.js` - Hook API interna (Nuevo)
- `frontend/src/components/BooksAPIDemo.jsx` - Demo API interna

### **3. Configuración de Electron**
El archivo `main.js` ya está configurado con:
- Context isolation habilitado
- Preload script configurado con API interna
- Manejo de errores robusto
- Cierre limpio de la base de datos
- API interna inicializada automáticamente

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

### **🆕 API Interna (Recomendada)**

#### **📖 Libros**
```javascript
// Buscar libros
const books = await window.electronAPI.apiBooksSearch({ title: 'Algoritmos' });

// Obtener libro por ID
const book = await window.electronAPI.apiBooksGet(1);

// Crear libro
const newBook = await window.electronAPI.apiBooksCreate({
  title: 'Clean Code',
  author: 'Robert Martin',
  isbn: '9780132350884',
  year: 2008,
  genre: 'Programación',
  pages: 464,
  language: 'en'
});

// Actualizar libro
const updatedBook = await window.electronAPI.apiBooksUpdate(1, bookData);

// Eliminar libro
await window.electronAPI.apiBooksDelete(1);

// Estadísticas
const stats = await window.electronAPI.apiBooksStats();
```

#### **👥 Socios**
```javascript
// Buscar socios
const members = await window.electronAPI.apiMembersSearch({ firstName: 'Juan' });

// Crear socio
const newMember = await window.electronAPI.apiMembersCreate({
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan@email.com',
  memberType: 'student',
  maxLoans: 3,
  loanDays: 14
});

// Actualizar socio
const updatedMember = await window.electronAPI.apiMembersUpdate(1, memberData);

// Estadísticas
const stats = await window.electronAPI.apiMembersStats();
```

#### **📋 Préstamos**
```javascript
// Crear préstamo
const loan = await window.electronAPI.apiLoansCreate({
  bookId: 1,
  memberId: 1,
  loanDate: new Date().toISOString(),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
});

// Devolver préstamo
const returnedLoan = await window.electronAPI.apiLoansReturn(1);

// Préstamos vencidos
const overdueLoans = await window.electronAPI.apiLoansOverdue();

// Estadísticas
const stats = await window.electronAPI.apiLoansStats();
```

### **📚 API Original (Compatibilidad)**

#### **Bibliotecas**
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

#### **Libros (Original)**
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

#### **Socios (Original)**
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

#### **Préstamos (Original)**
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

#### **Estadísticas (Original)**
```javascript
// Estadísticas generales
await window.electronAPI.getBibliotecaStats(bibliotecaId);

// Préstamos por mes
await window.electronAPI.getPrestamosPorMes(bibliotecaId, 6);

// Libros por categoría
await window.electronAPI.getLibrosPorCategoria(bibliotecaId);
```

## 🎣 **Hooks Personalizados**

### **🆕 useInternalAPI (Recomendado)**

#### **Uso Básico**
```javascript
import { useBooksAPI, useMembersAPI, useLoansAPI } from './hooks/useInternalAPI';

function BooksComponent() {
  const {
    loading,
    error,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
    getBooksStats
  } = useBooksAPI();

  const handleCreateBook = async (bookData) => {
    try {
      const newBook = await createBook(bookData);
      console.log('Libro creado:', newBook);
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  return (
    // Tu interfaz aquí
  );
}
```

#### **Hook Unificado**
```javascript
import { useInternalAPI } from './hooks/useInternalAPI';

function DashboardComponent() {
  const { books, members, loans, loading, error } = useInternalAPI();

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
      {/* Tu interfaz aquí */}
    </div>
  );
}
```

### **📚 useDatabase (Original)**

#### **Uso Básico**
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

#### **Funciones Disponibles**
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

### **🆕 API Interna - Validaciones Avanzadas**
```javascript
// Validación de ISBN con regex
const isbnRegex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;

// Validación de email robusta
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Validación de fechas de préstamo
const validateLoanDates = (loanDate, dueDate) => {
  const loan = new Date(loanDate);
  const due = new Date(dueDate);
  const today = new Date();
  
  return {
    isValid: loan <= today && due > loan,
    errors: [
      loan > today ? 'Fecha de préstamo no puede ser futura' : null,
      due <= loan ? 'Fecha de vencimiento debe ser posterior al préstamo' : null
    ].filter(Boolean)
  };
};
```

### **📚 API Original - Datos de Ejemplo**
```javascript
// Insertar datos de prueba
await window.electronAPI.insertSampleData(bibliotecaId);
```

### **Validaciones Integradas**
- **ISBN**: Validación de formato ISBN-10 e ISBN-13
- **Email**: Validación de formato de email
- **Fechas**: Validación y formateo automático
- **Estados**: Control de estados válidos
- **Reglas de negocio**: Límites de préstamos, disponibilidad

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

## 🎯 **Ventajas de la API Interna**

### **🏗️ Arquitectura Profesional**
- **Separación de responsabilidades**: UI completamente separada de lógica de negocio
- **Testeable**: Cada servicio puede probarse independientemente
- **Escalable**: Fácil agregar nuevos servicios (multas, reportes, etc.)
- **Mantenible**: Código organizado y documentado

### **🔒 Seguridad y Validaciones**
- **Validaciones centralizadas**: Regex avanzadas y reglas de negocio
- **Transacciones ACID**: Integridad de datos garantizada
- **Manejo de errores**: Sistema robusto de errores
- **Context isolation**: APIs expuestas de forma segura

### **⚡ Rendimiento**
- **Índices optimizados**: Queries eficientes con índices compuestos
- **Operaciones atómicas**: Transacciones seguras
- **Cache inteligente**: Optimización automática
- **Offline-first**: Sin dependencias externas

## 🎉 **¡Listo para Usar!**

El backend de BibliOS está completamente implementado con **dos APIs disponibles**:

1. **🆕 API Interna** (Recomendada) - Arquitectura moderna con separación de responsabilidades
2. **📚 API Original** - Compatibilidad con código existente

Todas las funcionalidades principales están disponibles a través de las APIs de Electron, y los hooks personalizados (`useInternalAPI` y `useDatabase`) facilitan la integración con React.

**¡Disfruta desarrollando tu sistema bibliotecario offline con arquitectura profesional!** 📚✨

