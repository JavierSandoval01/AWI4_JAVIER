import express from 'express';
import morgan from 'morgan';
import authRoute from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.rutes'; 
import connectDBMongo from './config/db';
import menuRoutes from './routes/menu.routs'; 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));


// Rutas
app.use('/api/v1/auth', authRoute);
app.use('/api/v1', productRoutes);
app.use('/api/v1', orderRoutes); 
app.use('/api/v1/menu', menuRoutes); 

// Conexión y levantamiento del servidor
connectDBMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});




