import Database from 'better-sqlite3';
import type { Request, Response } from 'express';

const db = new Database('aesthetix.db');

export default async function handler(req: Request, res: Response) {
  const { email, password } = req.body;

  if (req.method === 'POST') {
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
      if (user) {
        return res.status(200).json(user);
      }
      return res.status(401).json({ error: 'Неверные данные' });
    } catch (e) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
}