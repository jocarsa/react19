// backend/routes/orderRoutes.js
import { Router } from 'express';
import Order from '../models/Order.js';

const router = Router();

// Crear una orden
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    const newOrder = new Order({ items });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la orden' });
  }
});

// Obtener todas las órdenes (opcional)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
});

export default router;
