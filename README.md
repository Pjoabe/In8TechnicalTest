# IN8-technical-test
---

This is an API project developed to perform web scraping on Lenovo product data, utilizing a scheduler to execute the scraping periodically.

---

**Technologies**

- **Node.js**: JavaScript runtime environment for server-side execution.
- **Express**: Web framework for Node.js.
- **TypeScript**: Language that adds static typing to JavaScript.
- **Docker**: Containerization of the development environment and database.
- **node-cron**: Library for scheduling tasks in Node.js.
- **MongoDB**: NoSQL database used to store the extracted data.

---

**Installation**

**Prerequisites**
- Docker (for the development environment)
- Docker Compose (for orchestrating containers)

---

**Steps**

1. **Clone the repository**

    ```bash
    git clone git@github.com:Pjoabe/In8TechnicalTest.git
    ```

2. **Navigate to the project directory**

    ```bash
    cd In8TechnicalTest
    ```

3. **Configure environment variables**

    Create a `.env` file at the root of the project with the following variables:

    ```makefile
    NODE_ENV=development
    PORT=3000
    MONGODB_URI=mongodb://mongo:27017/lenovo_scraper
    ```

4. **Build Docker containers**

    ```bash
    docker-compose build
    ```

5. **Start Docker containers**

    ```bash
    docker-compose up
    ```
## Endpoints

### POST /api/scrape

**Description**: starts the scraping process. (The scraping process occurs automatically every hour.)

### GET /api/products

**Description**: Retrieves a list of all products that have been scraped. This includes details such as the product title, description, base price, and available memory options along with their respective prices. The response is returned in JSON format, providing an easy way to access the scraped product data.
