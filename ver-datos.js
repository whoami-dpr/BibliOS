const DatabaseService = require('./src/main/database/database.js');

async function verDatos() {
    try {
        console.log('🔍 Iniciando verificación de datos...');
        
        // Crear instancia del servicio de base de datos
        const db = new DatabaseService();
        
        // Verificar si la base de datos está inicializada
        if (!db.db) {
            console.log('❌ Base de datos no inicializada');
            return;
        }
        
        console.log('✅ Base de datos inicializada correctamente');
        
        // Ver todas las bibliotecas
        console.log('\n📚 BIBLIOTECAS REGISTRADAS:');
        const bibliotecas = await db.getBibliotecas();
        console.log('Total de bibliotecas:', bibliotecas.length);
        bibliotecas.forEach((bib, index) => {
            console.log(`\n${index + 1}. ID: ${bib.id}`);
            console.log(`   Nombre: ${bib.nombre}`);
            console.log(`   Dirección: ${bib.direccion}`);
            console.log(`   Teléfono: ${bib.telefono}`);
            console.log(`   Email: ${bib.email}`);
            console.log(`   Responsable: ${bib.responsable}`);
            console.log(`   Horarios: ${bib.horarios}`);
            console.log(`   Descripción: ${bib.descripcion}`);
            console.log(`   Fecha creación: ${bib.fechaCreacion}`);
            console.log(`   Activa: ${bib.activa ? 'SÍ' : 'NO'}`);
        });
        
        // Ver la biblioteca activa
        console.log('\n🎯 BIBLIOTECA ACTIVA:');
        const activa = await db.getBibliotecaActiva();
        if (activa) {
            console.log('✅ Biblioteca activa encontrada:');
            console.log(`   ID: ${activa.id}`);
            console.log(`   Nombre: ${activa.nombre}`);
            console.log(`   Activa: ${activa.activa ? 'SÍ' : 'NO'}`);
        } else {
            console.log('❌ No hay biblioteca activa');
        }
        
        // Ver estadísticas de la base de datos
        console.log('\n📊 ESTADÍSTICAS DE LA BASE DE DATOS:');
        const stats = db.db.prepare('SELECT COUNT(*) as total FROM bibliotecas').get();
        console.log(`Total de bibliotecas en BD: ${stats.total}`);
        
        const activas = db.db.prepare('SELECT COUNT(*) as total FROM bibliotecas WHERE activa = 1').get();
        console.log(`Bibliotecas activas: ${activas.total}`);
        
        const inactivas = db.db.prepare('SELECT COUNT(*) as total FROM bibliotecas WHERE activa = 0').get();
        console.log(`Bibliotecas inactivas: ${inactivas.total}`);
        
        // Ver estructura de la tabla
        console.log('\n🏗️ ESTRUCTURA DE LA TABLA:');
        const schema = db.db.prepare("PRAGMA table_info(bibliotecas)").all();
        console.log('Columnas de la tabla bibliotecas:');
        schema.forEach(col => {
            console.log(`   ${col.name}: ${col.type} ${col.notnull ? '(NOT NULL)' : ''} ${col.pk ? '(PRIMARY KEY)' : ''}`);
        });
        
    } catch (error) {
        console.error('❌ Error al ver los datos:', error);
    } finally {
        // Cerrar la base de datos
        if (db && db.db) {
            db.db.close();
            console.log('\n🔒 Base de datos cerrada');
        }
    }
}

// Ejecutar la función
verDatos();
