import axios from "axios";
import * as cheerio from "cheerio";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getRandomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function searchBookByISBN(isbn) {
  const baseUrl = "https://book24.ru";
  const searchUrl = `${baseUrl}/search/?q=${encodeURIComponent(isbn)}`;

  try {
    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": getRandomUserAgent(),
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const bookCards = $(".product-list__item");

    if (bookCards.length === 0) {
      console.log(`Книга с ISBN ${isbn} не найдена на сайте`);
      return null;
    }

    let bookInfo = null;
    bookCards.each((index, element) => {
      const $element = $(element);
      const main = $element.find(".product-card__name").text().trim();

      const author = $element.find(".author-list__item").text().trim();
 

      if (main || author) {
        bookInfo = { isbn, main: main || "Нет названия", author: author || "автор не указан" };
        return false; // Прерываем цикл each
      }
    });

    if (!bookInfo) {
      console.log(`Не удалось извлечь информацию о книге с ISBN ${isbn}`);
      return null;
    }

    return bookInfo;
  } catch (error) {
    console.error(`Ошибка при поиске книги с ISBN ${isbn}:`, error.message);
    return null;
  }
}

async function searchBooks(isbnArray) {
  const results = [];
  for (const isbn of isbnArray) {
    const bookInfo = await searchBookByISBN(isbn);
    if (bookInfo) {
      results.push(bookInfo);
    }
    await delay(1000 + Math.random() * 2000);
  }
  return results;
}


// Пример использования
const isbnArray = ["9785389098183", "9785041959326"];

searchBooks(isbnArray)
  .then((books) => {
    console.log(books)

  })
  .catch((error) => {
    console.error("Произошла общая ошибка:", error);
  });
