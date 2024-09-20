import express from "express";
import cors from "cors";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения

const app = express();
const port = 3000;
const pythonApiUrl = process.env.PYTHON_API_URL;

const __dirname = path.resolve();

// Настройка CORS
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://marks-pro.ru",
    "https://backent-vite-project.vercel.app",
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://backent-vite-project.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.static(path.join(__dirname, "dist")));

// Раздаём статические файлы из папок 'web' и 'build'
app.use("/web", express.static(path.join(__dirname, "web")));
app.use("/build", express.static(path.join(__dirname, "web", "build")));

// Маршрут для проксирования PDF-файла
// Маршрут для проксирования PDF-файла
app.get("/api/stream-pdf", async (req, res) => {
  const { fileUrl } = req.query;

  if (!fileUrl) {
    return res.status(400).send("Отсутствует параметр fileUrl.");
  }

  // Используем переменную окружения для получения полного URL
  const fullUrl = fileUrl.startsWith("http")
    ? fileUrl
    : `${process.env.PYTHON_API_URL}${fileUrl}`;

  try {
    const response = await axios({
      method: "get",
      url: fullUrl,
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    response.data.pipe(res);
  } catch (error) {
    console.error("Ошибка при проксировании PDF-файла:", error);
    res.status(500).send("Ошибка при проксировании PDF-файла.");
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

console.log("Сервер стартовал");
