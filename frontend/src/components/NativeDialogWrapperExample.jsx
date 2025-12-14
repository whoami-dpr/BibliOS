import React from 'react';

/**
 * Ejemplo de uso del wrapper window.nativeDialog
 * Todos los diálogos devuelven el foco automáticamente
 */
export default function NativeDialogWrapperExample() {
  
  const handleConfirmExample = async () => {
    const ok = await window.nativeDialog.confirm({
      message: '¿Quieres continuar con esta acción?',
      detail: 'Esta acción no se puede deshacer.',
      buttons: ['Cancelar', 'Continuar'],
      defaultId: 1,
      cancelId: 0,
      okIndex: 1
    });
    
    if (ok) {
      await window.nativeDialog.message({
        message: '¡Acción confirmada!',
        detail: 'Has elegido continuar con la acción.'
      });
    }
  };

  const handleMessageExample = async () => {
    await window.nativeDialog.message({
      message: 'Información importante',
      detail: 'Este es un mensaje informativo para el usuario.'
    });
  };

  const handleErrorExample = async () => {
    await window.nativeDialog.error({
      message: 'Error en la operación',
      detail: 'No se pudo completar la operación solicitada.'
    });
  };

  const handleWarningExample = async () => {
    await window.nativeDialog.warning({
      message: 'Advertencia',
      detail: 'Esta acción puede tener consecuencias importantes.'
    });
  };

  const handleOpenFileExample = async () => {
    const result = await window.nativeDialog.open({
      title: 'Seleccionar archivo',
      filters: [
        { name: 'Imágenes', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Documentos', extensions: ['pdf', 'doc', 'docx'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      await window.nativeDialog.message({
        message: 'Archivo seleccionado',
        detail: `Se seleccionó: ${result.filePaths[0]}`
      });
    }
  };

  const handleOpenMultipleFilesExample = async () => {
    const result = await window.nativeDialog.openMultiple({
      title: 'Seleccionar múltiples archivos',
      filters: [
        { name: 'Imágenes', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      await window.nativeDialog.message({
        message: 'Archivos seleccionados',
        detail: `Se seleccionaron ${result.filePaths.length} archivos`
      });
    }
  };

  const handleOpenDirectoryExample = async () => {
    const result = await window.nativeDialog.openDirectory({
      title: 'Seleccionar directorio'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      await window.nativeDialog.message({
        message: 'Directorio seleccionado',
        detail: `Se seleccionó: ${result.filePaths[0]}`
      });
    }
  };

  const handleSaveFileExample = async () => {
    const result = await window.nativeDialog.save({
      title: 'Guardar archivo',
      defaultPath: 'mi-archivo.txt',
      filters: [
        { name: 'Archivos de texto', extensions: ['txt'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled && result.filePath) {
      await window.nativeDialog.message({
        message: 'Archivo guardado',
        detail: `Se guardó en: ${result.filePath}`
      });
    }
  };

  const handleLogoutExample = async () => {
    const ok = await window.nativeDialog.confirm({
      message: '¿Seguro que querés cerrar sesión?',
      detail: 'Se cerrará tu sesión actual.',
      buttons: ['Cancelar', 'Cerrar sesión'],
      defaultId: 1,
      cancelId: 0,
      okIndex: 1
    });
    
    if (ok) {
      await window.nativeDialog.message({
        message: 'Logout confirmado',
        detail: 'Se cerraría la sesión ahora'
      });
      
      // Opcional: Asegurar foco después del logout
      await window.nativeDialog.ensureFocus();
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🎭 Wrapper window.nativeDialog
      </h1>
      
      <p style={{ textAlign: 'center', marginBottom: '40px', opacity: 0.8 }}>
        Todos los diálogos devuelven el foco automáticamente
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Diálogos básicos */}
        <div style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ marginTop: 0, color: '#4CAF50' }}>📋 Diálogos Básicos</h3>
          
          <button 
            onClick={handleConfirmExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Confirmación
          </button>
          
          <button 
            onClick={handleMessageExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Mensaje
          </button>
          
          <button 
            onClick={handleErrorExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Error
          </button>
          
          <button 
            onClick={handleWarningExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Advertencia
          </button>
        </div>

        {/* Diálogos de archivos */}
        <div style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ marginTop: 0, color: '#9C27B0' }}>📁 Diálogos de Archivos</h3>
          
          <button 
            onClick={handleOpenFileExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Abrir Archivo
          </button>
          
          <button 
            onClick={handleOpenMultipleFilesExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Abrir Múltiples Archivos
          </button>
          
          <button 
            onClick={handleOpenDirectoryExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Abrir Directorio
          </button>
          
          <button 
            onClick={handleSaveFileExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Guardar Archivo
          </button>
        </div>

        {/* Diálogos especiales */}
        <div style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ marginTop: 0, color: '#FF5722' }}>🔐 Diálogos Especiales</h3>
          
          <button 
            onClick={handleLogoutExample}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Confirmar Logout
          </button>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#2a2a2a', 
        borderRadius: '8px',
        border: '1px solid #333',
        maxWidth: '1200px',
        margin: '40px auto 0'
      }}>
        <h3 style={{ marginTop: 0, color: '#00BCD4' }}>✨ Uso del Wrapper</h3>
        <pre style={{ 
          backgroundColor: '#1a1a1a', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '14px'
        }}>
{`// Confirmación
const ok = await window.nativeDialog.confirm({
  message: '¿Seguro que querés cerrar sesión?',
  detail: 'Se cerrará tu sesión actual.',
  buttons: ['Cancelar', 'Cerrar sesión'],
  defaultId: 1,
  cancelId: 0,
  okIndex: 1
});
if (ok) { 
  await doLogout(); 
  await window.nativeDialog.ensureFocus(); // opcional
}

// Mensaje
await window.nativeDialog.message({
  message: 'Operación completada'
});

// Error
await window.nativeDialog.error({
  message: 'Error en la operación'
});

// Abrir archivo
const result = await window.nativeDialog.open({
  title: 'Seleccionar archivo',
  filters: [
    { name: 'Imágenes', extensions: ['jpg', 'png'] }
  ]
});

// Guardar archivo
const result = await window.nativeDialog.save({
  title: 'Guardar archivo',
  defaultPath: 'mi-archivo.txt'
});`}
        </pre>
      </div>
    </div>
  );
}
