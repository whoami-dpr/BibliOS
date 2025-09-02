# Componente ThemeToggle

Este componente permite cambiar entre tema claro y oscuro en la aplicación.

## Características

- Cambia entre tema claro (`light`) y oscuro (`dark`)
- Persiste la preferencia en `localStorage`
- Aplica el tema al atributo `data-theme` del `document.documentElement`
- Muestra íconos de Sol/Luna usando `lucide-react`
- Estilos responsivos con variables CSS

## Uso

```jsx
import ThemeToggle from './components/ThemeToggle';
import './components/ThemeToggle.css';

function App() {
  return (
    <div>
      <ThemeToggle />
      {/* Resto de tu aplicación */}
    </div>
  );
}
```

## Variables CSS

El componente utiliza las siguientes variables CSS que se pueden personalizar:

- `--foreground`: Color del texto
- `--background`: Color de fondo
- `--card`: Color de fondo del botón
- `--card-hover`: Color de fondo al hacer hover
- `--border`: Color del borde
- `--border-hover`: Color del borde al hacer hover

## Estilos

- Padding: 8px 12px
- Borde: 1px solid var(--border)
- Fondo: var(--card)
- Border-radius: 10px
- Transiciones suaves para mejor UX
