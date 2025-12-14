# Sistema de Autenticación Offline - BibliOS

## Descripción General

El sistema de autenticación offline de BibliOS permite que cada biblioteca tenga su propio método de verificación de acceso, ya sea mediante contraseña alfanumérica o PIN numérico. Este sistema funciona completamente offline y almacena las credenciales de forma segura en el localStorage del navegador.

## Características Principales

### 🔐 Métodos de Autenticación
- **Contraseña**: Contraseña alfanumérica con mínimo 6 caracteres
- **PIN**: Código numérico con mínimo 4 dígitos

### 🛡️ Seguridad
- Hash con salt para proteger las credenciales
- Almacenamiento local seguro
- Validación de entrada en tiempo real
- Protección contra ataques de fuerza bruta básica

### 🎨 Interfaz de Usuario
- Modal de autenticación elegante y responsivo
- Selector de método de autenticación intuitivo
- Indicadores visuales de estado
- Validación en tiempo real con mensajes de error

## Componentes del Sistema

### 1. Hook useAuth (`hooks/useAuth.js`)
Hook principal que maneja toda la lógica de autenticación:

```javascript
const {
  isAuthenticated,      // Estado de autenticación actual
  currentLibrary,       // Biblioteca actualmente autenticada
  loading,             // Estado de carga
  createLibraryAuth,   // Crear credenciales para nueva biblioteca
  authenticate,        // Autenticar usuario
  logout,              // Cerrar sesión
  updateAuth,          // Actualizar credenciales
  hasAuth,             // Verificar si biblioteca tiene autenticación
  getAuthMethod        // Obtener método de autenticación
} = useAuth();
```

### 2. AuthModal (`components/AuthModal.jsx`)
Modal para solicitar credenciales de acceso:

- Interfaz adaptativa según el método (contraseña/PIN)
- Validación en tiempo real
- Indicadores de visibilidad para contraseñas
- Manejo de errores elegante

### 3. AuthMethodSelector (`components/AuthMethodSelector.jsx`)
Selector para elegir método de autenticación al crear biblioteca:

- Opciones visuales para contraseña y PIN
- Validación de entrada específica por método
- Ayuda contextual para cada opción

### 4. ProtectedRoute (`components/ProtectedRoute.jsx`)
Componente de protección de rutas:

- Verificación automática de autenticación
- Redirección a modal de autenticación cuando es necesario
- Manejo de bibliotecas sin autenticación configurada

### 5. AuthSettings (`components/AuthSettings.jsx`)
Panel para gestionar credenciales:

- Actualización de contraseñas/PINs
- Validación de credenciales actuales
- Confirmación de nuevas credenciales

## Flujo de Autenticación

### 1. Creación de Biblioteca
1. Usuario completa formulario de registro
2. Selecciona método de autenticación (contraseña/PIN)
3. Ingresa credencial de acceso
4. Sistema crea hash con salt y almacena en localStorage
5. Usuario es redirigido al dashboard

### 2. Acceso a Biblioteca
1. Usuario intenta acceder a ruta protegida
2. Sistema verifica si biblioteca tiene autenticación
3. Si no tiene autenticación, permite acceso directo
4. Si tiene autenticación, muestra modal de login
5. Usuario ingresa credenciales
6. Sistema valida y permite/deniega acceso

### 3. Gestión de Sesión
1. Sesión se mantiene mientras navega la aplicación
2. Usuario puede cerrar sesión desde navbar
3. Al cerrar sesión, se limpia estado de autenticación

## Almacenamiento de Datos

### Estructura en localStorage:

```javascript
// Datos de autenticación
{
  "authData": {
    "libraryId": "1234567890",
    "authMethod": "password", // o "pin"
    "hashedValue": "hash_con_salt",
    "salt": "salt_aleatorio",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}

// Biblioteca activa
{
  "bibliotecaActiva": {
    "id": "1234567890",
    "nombre": "Mi Biblioteca",
    // ... otros datos de la biblioteca
  }
}
```

## Seguridad Implementada

### 1. Hash con Salt
- Cada credencial se hashea con un salt único
- Salt se genera aleatoriamente para cada biblioteca
- Hash simple pero efectivo para uso offline

### 2. Validación de Entrada
- PINs solo aceptan números
- Contraseñas aceptan caracteres alfanuméricos
- Longitud mínima configurable por método

### 3. Protección de Rutas
- Verificación automática en componentes protegidos
- Redirección segura a modal de autenticación
- Manejo de bibliotecas sin autenticación

## Uso en la Aplicación

### Proteger un Componente
```jsx
import ProtectedRoute from './components/ProtectedRoute';

function MiComponente() {
  return (
    <ProtectedRoute libraryId={activeLibrary?.id}>
      {/* Contenido protegido */}
    </ProtectedRoute>
  );
}
```

### Usar Hook de Autenticación
```jsx
import { useAuth } from './hooks/useAuth';

function MiComponente() {
  const { isAuthenticated, logout, authenticate } = useAuth();
  
  // Lógica de autenticación
}
```

## Consideraciones de Seguridad

### ✅ Implementado
- Hash con salt para credenciales
- Validación de entrada
- Almacenamiento local seguro
- Protección de rutas

### ⚠️ Limitaciones (Offline)
- No hay encriptación avanzada (depende del navegador)
- No hay protección contra ataques de fuerza bruta avanzados
- Credenciales visibles en localStorage (aunque hasheadas)

### 🔒 Recomendaciones
- Para mayor seguridad, considerar encriptación adicional
- Implementar límite de intentos de autenticación
- Considerar autenticación biométrica si está disponible

## Personalización

### Cambiar Longitud Mínima
```javascript
// En AuthMethodSelector.jsx
if (authMethod === 'pin' && authValue.length < 4) {
  setAuthError('El PIN debe tener al menos 4 dígitos');
}

if (authMethod === 'password' && authValue.length < 6) {
  setAuthError('La contraseña debe tener al menos 6 caracteres');
}
```

### Agregar Validaciones Adicionales
```javascript
// En useAuth.js - función createLibraryAuth
const validatePassword = (password) => {
  // Agregar validaciones personalizadas
  return password.length >= 6 && /[A-Z]/.test(password);
};
```

## Troubleshooting

### Problemas Comunes

1. **Modal no aparece**: Verificar que la biblioteca tenga autenticación configurada
2. **Credenciales no válidas**: Verificar que se esté usando el método correcto (PIN vs contraseña)
3. **Sesión no persiste**: Verificar que localStorage esté habilitado en el navegador

### Debug
```javascript
// Verificar estado de autenticación
console.log(localStorage.getItem('authData'));
console.log(localStorage.getItem('bibliotecaActiva'));
```

## Futuras Mejoras

- [ ] Autenticación biométrica
- [ ] Encriptación avanzada de credenciales
- [ ] Límite de intentos de autenticación
- [ ] Recuperación de credenciales
- [ ] Autenticación de dos factores
- [ ] Sincronización entre dispositivos
