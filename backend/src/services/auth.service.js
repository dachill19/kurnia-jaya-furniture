import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia';

export const registerUser = async (name, email, phoneNumber, password) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }]
    }
  });

  if (existingUser) throw new Error('Email atau nomor telepon sudah terdaftar.');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'USER', // default
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true
    }
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Email tidak ditemukan.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Password salah.');

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return token;
};