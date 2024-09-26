import axios from "axios";
import * as cheerio from "cheerio";
import Product from "../models/productModel";

function calculatePrice(basePrice: number, memoryOption: string): number {
  const increments: { [key: string]: number | null } = {
    "128GB": 0,
    "256GB": 20,
    "512GB": 40,
    "1024GB": null,
  };

  if (
    !increments.hasOwnProperty(memoryOption) ||
    increments[memoryOption] === null
  ) {
    throw new Error("Opção de memória inválida ou desativada.");
  }

  return basePrice + (increments[memoryOption] as number);
}

async function scrapeProducts(): Promise<
  Array<{
    title: string;
    description: string;
    price: number;
    memoryOptions: Array<{ size: string; price: number }>;
  }>
> {
  const baseUrl =
    "https://webscraper.io/test-sites/e-commerce/static/computers/laptops";
  console.log("Iniciando scraping da URL:", baseUrl);

  let currentPage = 1;
  let products: Array<{
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    reviewCount: number;
    rating: number;
    memoryOptions: Array<{ size: string; price: number }>;
  }> = [];

  const axiosInstance = axios.create({
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  try {
    while (true) {
      const nextPageUrl = `${baseUrl}?page=${currentPage}`;
      console.log(`Scraping URL: ${nextPageUrl}`);
      const response = await axiosInstance.get(nextPageUrl);

      const $ = cheerio.load(response.data);

      const pageProducts: Array<{
        title: string;
        description: string;
        price: number;
        url: string;
        thumbnail: string;
        reviewCount: number;
        rating: number;
      }> = [];

      $(".thumbnail").each((_index, element) => {
        const $el = $(element);
        const title = $el.find(".title").text().trim();
        const description = $el.find(".description").text().trim();
        const priceText = $el.find(".price").text().trim();
        const price = parseFloat(priceText.replace("$", "").replace(",", ""));
        const url = "https://webscraper.io" + $el.find("a.title").attr("href");
        const thumbnailPath = $el.find("img").attr("src");
        const thumbnailUrl = `https://webscraper.io${thumbnailPath}`;
        const reviewCountText = $el.find(".review-count").text().trim();
        const reviewCount = parseInt(reviewCountText.split(" ")[0]);
        const ratingElements = $el
          .find(".ratings [data-rating]")
          .find(".ws-icon-star");
        const rating = ratingElements.length;

        pageProducts.push({
          title,
          description,
          price,
          url,
          thumbnail: thumbnailUrl,
          reviewCount,
          rating,
        });
      });

      if (pageProducts.length === 0) {
        console.log(
          "Nenhum produto encontrado nesta página. Encerrando o scraping."
        );
        break;
      }

      const lenovoProducts = pageProducts.filter(
        (product) =>
          product.title.toLowerCase().includes("lenovo") ||
          product.description.toLowerCase().includes("lenovo")
      );

      console.log(
        `Encontrados ${lenovoProducts.length} produtos Lenovo nesta página.`
      );

      for (const product of lenovoProducts) {
        console.log(`Processando produto: ${product.title}`);
        console.log(`URL do produto: ${product.url}`);

        try {
          const detailResponse = await axiosInstance.get(product.url);
          const detailPage = cheerio.load(detailResponse.data);
          const memoryOptions: Array<{ size: string; price: number }> = [];
          const basePrice = product.price;

          detailPage(".swatches .swatch").each((_index, element) => {
            const $option = detailPage(element);
            const size = $option.text().trim() + "GB";
            try {
              const price = calculatePrice(basePrice, size);
              memoryOptions.push({ size, price });
            } catch (error: any) {
              console.log(
                `Erro ao calcular preço para ${size}:`,
                error.message
              );
            }
          });

          console.log(
            `Opções de memória encontradas para ${product.title}:`,
            memoryOptions
          );

          if (memoryOptions.length === 0) {
            console.log(
              `Nenhuma opção de memória encontrada para ${product.title}. HTML da página de detalhes:`,
              detailResponse.data
            );
          }

          products.push({ ...product, memoryOptions });
        } catch (error) {
          console.error(`Erro ao processar o produto ${product.title}:`, error);
        }
      }

      currentPage++;
    }

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Total de produtos Lenovo encontrados: ${products.length}`);
    return products;
  } catch (error) {
    console.error("Erro durante o scraping:", error);
    throw error;
  }
}

export default {
  scrapeProducts,
};
