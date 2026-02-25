import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("aesthetix.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    old_price INTEGER,
    status TEXT DEFAULT 'active',
    category TEXT NOT NULL,
    image TEXT,
    description TEXT,
    tech TEXT
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT,
    image TEXT,
    date TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    name TEXT
  );
`);

// Migration: Add old_price and status if they don't exist
try {
  db.prepare("ALTER TABLE products ADD COLUMN old_price INTEGER").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'active'").run();
} catch (e) {}

// Seed default admin if empty
const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE email = ?").get('rinatakknomerdva@gmail.com') as { count: number };
if (adminCount.count === 0) {
  db.prepare("INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)").run('rinatakknomerdva@gmail.com', 'RINATTOP123', 'admin', 'Администратор');
}

// Seed default settings if empty
const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("hero_title", "Создано для Результата");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("hero_subtitle", "Высокотехнологичная компрессионная экипировка для тех, кто выходит за рамки возможного. Никаких отвлечений. Только прогресс.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products.map((p: any) => ({ ...p, tech: JSON.parse(p.tech || "[]") })));
  });

  app.post("/api/products", (req, res) => {
    const { name, price, old_price, status, category, image, description, tech } = req.body;
    const result = db.prepare("INSERT INTO products (name, price, old_price, status, category, image, description, tech) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(name, price, old_price || null, status || 'active', category, image, description, JSON.stringify(tech || []));
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    console.log(`Attempting to delete product with ID: ${id} (numeric: ${numericId})`);
    try {
      const result = db.prepare("DELETE FROM products WHERE id = ?").run(numericId);
      console.log(`Delete result:`, result);
      res.json({ success: true, changes: result.changes });
    } catch (err: any) {
      console.error(`Delete error for ID ${id}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    const { name, price, old_price, status, category, image, description, tech } = req.body;
    console.log(`Attempting to update product with ID: ${id} (numeric: ${numericId})`);
    try {
      const result = db.prepare(`
        UPDATE products 
        SET name = ?, price = ?, old_price = ?, status = ?, category = ?, image = ?, description = ?, tech = ?
        WHERE id = ?
      `).run(name, price, old_price || null, status || 'active', category, image, description, JSON.stringify(tech || []), numericId);
      console.log(`Update result:`, result);
      res.json({ success: true, changes: result.changes });
    } catch (err: any) {
      console.error(`Update error for ID ${id}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news").all();
    res.json(news);
  });

  app.post("/api/news", (req, res) => {
    const { title, excerpt, image, date } = req.body;
    const result = db.prepare("INSERT INTO news (title, excerpt, image, date) VALUES (?, ?, ?, ?)")
      .run(title, excerpt, image, date);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/news/:id", (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    console.log(`Attempting to delete news with ID: ${id} (numeric: ${numericId})`);
    try {
      const result = db.prepare("DELETE FROM news WHERE id = ?").run(numericId);
      console.log(`News delete result:`, result);
      res.json({ success: true, changes: result.changes });
    } catch (err: any) {
      console.error(`News delete error for ID ${id}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/news/:id", (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    const { title, excerpt, image, date } = req.body;
    db.prepare("UPDATE news SET title = ?, excerpt = ?, image = ?, date = ? WHERE id = ?")
      .run(title, excerpt, image, date, numericId);
    res.json({ success: true });
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  // Auth Routes
  app.post("/api/register", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)").run(email, password, 'user', name);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid) as any;
      res.json({ success: true, id: result.lastInsertRowid, role: user.role, email: user.email, name: user.name });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      } else {
        res.status(500).json({ error: 'Ошибка сервера' });
      }
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ success: true, role: user.role, email: user.email, name: user.name });
    } else {
      res.status(401).json({ error: 'Неверный email или пароль' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
