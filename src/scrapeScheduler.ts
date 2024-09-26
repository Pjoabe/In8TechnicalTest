import cron from 'node-cron';
import scrapeService from './services/scrapingService';

cron.schedule('0 * * * *', async () => {
  console.log('Executando tarefa agendada na data:', new Date());
  try {
    await scrapeService.scrapeProducts();
    console.log('Scraping completado com sucesso.');
  } catch (error) {
    console.error('Erro durante o sraping agendado:', error);
  }
});
