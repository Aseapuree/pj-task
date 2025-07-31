const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const registerSchema = Joi.object({
  nombre: Joi.string().required(),
  apellidoPat: Joi.string().required(),
  apellidoMat: Joi.string().required(),
  email: Joi.string().email().required(),
  role:Joi.string().optional(),
  password: Joi.string().min(6).required()
});

router.post('/login', async (req, res) => {
    logger.info(`Ingresando endpoint de login: `,req.body)
    const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ id: user._id, email: user.email ,rol:user.role}, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.json({ token });
});

router.post('/register', async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(409).json({ error: 'El correo ya está registrado' });

    const user = new User(req.body);
    await user.save();

    res.status(201).json({ message: 'Usuario registrado correctamente', id: user._id });
  } catch (err) {
    console.error('Error en /register:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
