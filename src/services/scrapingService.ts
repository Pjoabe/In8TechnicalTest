import axios from 'axios';
import * as cheerio from 'cheerio';
import Product from '../models/productModel';

async function scrapeProducts(): Promise<Array<{ title: string; description: string; price: number }>> {
  const baseUrl = 'https://webscraper.io/test-sites/e-commerce/static/computers/laptops';
  console.log('Iniciando scraping da URL:', baseUrl);

  let currentPage = 1;
  let products: Array<{ title: string; description: string; price: number }> = [];

  while (true) {
    const nextPageUrl = `${baseUrl}?page=${currentPage}`;
    console.log(`Scraping URL: ${nextPageUrl}`);
    const response = await axios.get(nextPageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('Resposta recebida. Status:', response.status);
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);

    const pageProducts: Array<{ title: string; description: string; price: number, thumbnail: string, reviewCount: number, rating: number }> = [];
    $('.thumbnail').each((_index, element) => {
      const $el = $(element);
      const title = $el.find('.title').text().trim();
      const description = $el.find('.description').text().trim();
      const priceText = $el.find('.price').text().trim();
      const price = parseFloat(priceText.replace('$', '').replace(',', ''));
      const thumbnailPath = $el.find('img').attr('src'); 
      const thumbnailUrl = `https://webscraper.io${thumbnailPath}`; 
      const reviewCountText = $el.find('.review-count').text().trim();
      const reviewCount = parseInt(reviewCountText.split(' ')[0]); 
      const ratingElements = $el.find('.ratings [data-rating]').find('.ws-icon-star');
      const rating = ratingElements.length;

      pageProducts.push({ title, description, price, thumbnail: thumbnailUrl, reviewCount, rating });
    });

    if (pageProducts.length === 0) {
      console.log('Nenhum produto encontrado nesta página. Encerrando o scraping.');
      break;
    }

    const lenovoProducts = pageProducts.filter(product => 
      product.title.toLowerCase().includes('lenovo') || 
      product.description.toLowerCase().includes('lenovo')
    );

    products = products.concat(lenovoProducts);

    currentPage++;
  }

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Total de produtos Lenovo encontrados: ${products.length}`);
  return products;
}
export default {
  scrapeProducts
};