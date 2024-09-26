import { Request, Response } from 'express';
import Product from '../models/productModel';
import scrapingService from '../services/scrapingService';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().sort('price');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

export const scrapeProducts = async (req: Request, res: Response) => {
  console.log('Rota /scrape acionada');
  try {
    console.log('Iniciando processo de scraping...');
    const products = await scrapingService.scrapeProducts();
    console.log('Scraping concluído com sucesso');
    res.json({ message: 'Scraping concluído', count: products.length });
  } catch (error : any) {
    console.error('Erro na rota /scrape:', error);
    res.status(500).json({ error: 'Erro durante o scraping', details: error.message });
  }
};
