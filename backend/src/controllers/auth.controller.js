import { registerUser, loginUser } from '../services/auth.service.js';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const user = await registerUser(name, email, phoneNumber, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
    try {
      console.log('req.user:', req.user); // Tambahkan ini untuk debug
      const userId = req.user.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          createdAt: true
        }
      });
  
      res.json(user);
    } catch (err) {
      console.error('Error getProfile:', err); // debug tambahan
      res.status(500).json({ error: 'Gagal mengambil data profil' });
    }
  };
  