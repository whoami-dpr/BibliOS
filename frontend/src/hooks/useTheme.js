import { useState, useEffect } from 'react';

export const useTheme = () => {
    // Leer tema guardado en localStorage o usar 'dark' por defecto
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || 'dark';
        // Aplicar tema inmediatamente al inicializar
        document.body.setAttribute('data-theme', initialTheme);
        return initialTheme;
    });

    useEffect(() => {
        // Aplicar el tema al body
        document.body.setAttribute('data-theme', theme);
        // Guardar en localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return { theme, toggleTheme };
};
