// frontend/src/theme.js
export function getStoredTheme() {
  return (
    localStorage.getItem('theme') ||
    document.documentElement.getAttribute('data-theme') ||
    'dark'
  );
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function initTheme() {
  // Aplica el tema guardado al arrancar
  applyTheme(getStoredTheme());

  // Escucha cambios del localStorage (por si hay varias pestañas)
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) applyTheme(e.newValue);
  });

  // Escucha evento interno para sincronizar componentes
  window.addEventListener('app:theme', (e) => {
    if (e.detail) applyTheme(e.detail);
  });
}


