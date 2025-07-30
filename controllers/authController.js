// backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Guarda temporalmente el token en la BD (opcional pero recomendado)
  user.resetToken = token;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  res.json({ message: 'Email sent' });
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await hashPassword(password); // Usa tu método de hash
    user.resetToken = null;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch {
    res.status(400).json({ message: 'Invalid token' });
  }
};
