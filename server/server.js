import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json());

// Route pour créer une commande PayPal
app.post('/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    // Ici, vous pouvez ajouter la logique pour créer une commande dans votre base de données
    
    // Simuler une réponse de création de commande PayPal
    res.json({
      id: 'MOCK_ORDER_ID_' + Date.now(),
      status: 'CREATED',
      links: []
    });
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

// Route pour capturer une commande PayPal
app.post('/capture-paypal-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    
    // Ici, vous pouvez ajouter la logique pour finaliser la commande dans votre base de données
    
    // Simuler une réponse de capture PayPal
    res.json({
      id: orderID,
      status: 'COMPLETED',
      payer: {
        email_address: 'customer@example.com'
      }
    });
  } catch (error) {
    console.error('Erreur capture commande:', error);
    res.status(500).json({ error: 'Erreur lors de la capture de la commande' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});