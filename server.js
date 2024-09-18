import express from "express";
import cors from "cors"; // Импортируем CORS
import path from "path";

const app = express();
const port = 3000;

const __dirname = path.resolve();
// console.log(123);

// Включаем CORS для всех запросов
app.use(cors());

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next(); // передаем управление следующему middleware или маршруту
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/about", (req, res) => {
  res.send("About route 🎉 ");
});

app.get("/api/data", (req, res) => {
  const data = {
    message: "Hello from the server!",
    timestamp: new Date(),
    status: "success",
  };

  res.json(data);
});

// Раздаём статические файлы из папок 'web' и 'build'
app.use('/web', express.static(path.join(__dirname, 'web')));
app.use('/build', express.static(path.join(__dirname, 'web', 'build')));

// Маршрут для PDF файла
app.get('/api/pdf', (req, res) => {
  const pdfPath = path.join(__dirname, 'pdf-files', 'one.pdf');
  res.sendFile(pdfPath);
});

// Все остальные запросы направляем на индексный файл React приложения
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

console.log("сервер старт");
