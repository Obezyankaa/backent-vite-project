import express from "express";
import path from "path";
console.log(123);

const app = express();
const port = 3000;

const __dirname = path.resolve();

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next(); // передаем управление следующему middleware или маршруту
});

// Указываем Express раздавать файлы из папки dist
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => res.send("Express on Vercel"));

// Статические файлы для PDF (если они есть)
app.use("/pdf-files", express.static(path.join(__dirname, "pdf-files")));

// Все остальные запросы направляем на индексный файл React приложения
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
