import express from "express";
import cors from "cors";
import path from "path";
import axios from "axios";

const app = express();
const port = 3000;

const __dirname = path.resolve();

// Настройка CORS
const corsOptions = {
  origin: "http://localhost:5173", // Адрес вашего фронтенда
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "dist")));

// Раздаём статические файлы из папок 'web' и 'build'
app.use("/web", express.static(path.join(__dirname, "web")));
app.use("/build", express.static(path.join(__dirname, "web", "build")));

// Маршрут для проксирования PDF-файла
app.get("/api/stream-pdf", async (req, res) => {
  try {
    // URL PDF-файла на Python-бэкенде
    const pdfUrl =
      "http://188.225.35.184/media/files/%D0%A2%D0%B5%D1%81%D1%82/stages/afk/2023-03-21_%D0%9C%D0%90%D0%A0%D0%9A%D0%A1-01-23-%D0%A0%D0%9F-%D0%90%D0%A03.pdf";

    // Делаем GET-запрос к Python-бэкенду
    const response = await axios({
      method: "get",
      url: pdfUrl,
      responseType: "stream",
    });

    // Устанавливаем корректный заголовок Content-Type
    res.setHeader("Content-Type", "application/pdf");

    // Передаём поток данных клиенту
    response.data.pipe(res);
  } catch (error) {
    console.error("Ошибка при проксировании PDF-файла:", error);
    res.status(500).send("Ошибка при проксировании PDF-файла.");
  }
});

// Все остальные запросы направляем на индексный файл React приложения
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

console.log("Сервер стартовал");
