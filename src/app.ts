import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lenovo_scraper';


mongoose.connect(MONGODB_URI);

app.use(express.json()); 
app.use('/api', productRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
