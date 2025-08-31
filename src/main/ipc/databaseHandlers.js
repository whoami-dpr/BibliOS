const { ipcMain } = require('electron');
const DatabaseService = require('../database/database');

class DatabaseHandlers {
    constructor() {
        this.db = new DatabaseService();
        this.setupHandlers();
    }

    setupHandlers() {
        // ===== MANEJADORES BÁSICOS DE BIBLIOTECAS =====
        
        ipcMain.handle('database:createBiblioteca', async (event, bibliotecaData) => {
            try {
                return await this.db.createBiblioteca(bibliotecaData);
            } catch (error) {
                console.error('Error en createBiblioteca:', error);
                throw error;
            }
        });

        ipcMain.handle('database:getBibliotecas', async () => {
            try {
                return await this.db.getBibliotecas();
            } catch (error) {
                console.error('Error en getBibliotecas:', error);
                throw error;
            }
        });

        // ===== MANEJADOR DE UTILIDADES =====
        
        ipcMain.handle('database:close', async () => {
            try {
                this.db.close();
                return true;
            } catch (error) {
                console.error('Error en close:', error);
                throw error;
            }
        });
    }

    // Método para limpiar todos los manejadores
    cleanup() {
        ipcMain.removeHandler('database:createBiblioteca');
        ipcMain.removeHandler('database:getBibliotecas');
        ipcMain.removeHandler('database:close');
    }
}

module.exports = DatabaseHandlers;
