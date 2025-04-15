// backend/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

// Cargar variables de entorno
dotenv.config();

async function seed() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB para seed');

    // Ejemplo de datos iniciales
    const products = [
      {
        name: 'Camiseta',
        description: 'Camiseta cómoda de algodón',
        price: 19.99,
        image: 'https://via.placeholder.com/300x200',
      },
      {
        name: 'Zapatos',
        description: 'Zapatos deportivos modernos',
        price: 49.99,
        image: 'https://via.placeholder.com/300x200',
      },
    ];

    // Limpiar productos existentes e insertar nuevos
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Productos insertados correctamente');

    // Cerrar conexión
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error insertando productos:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seed();
