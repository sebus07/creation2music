import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import helmet from 'helmet';

dotenv.config();

const app = express();

// Configuration de base de la sécurité avec helmet
app.use(helmet());

// Configuration CSP personnalisée
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.paypal.com", "https://www.sandbox.paypal.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.suno.ai", "https://www.paypal.com", "https://www.sandbox.paypal.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.paypal.com", "https://www.sandbox.paypal.com"]
    }
  })
);

// Configuration CORS sécurisée
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['POST', 'GET'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Email pour vous
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'contact@sebastien-koenig.fr',
      subject: `Nouveau message de ${name}`,
      text: `
        Nom: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Email de confirmation pour le client
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation de votre message - Musiques Personnalisées',
      text: `
        Bonjour ${name},
        
        Nous avons bien reçu votre message et nous vous en remercions.
        Nous vous répondrons dans les plus brefs délais.
        
        Cordialement,
        L'équipe Musiques Personnalisées
      `,
      html: `
        <h3>Bonjour ${name},</h3>
        <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
        <p>Nous vous répondrons dans les plus brefs délais.</p>
        <br>
        <p>Cordialement,</p>
        <p>L'équipe Musiques Personnalisées</p>
      `
    };

    // Envoi des emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);

    res.json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
});

// Routes PayPal
app.post('/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
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

app.post('/capture-paypal-order', async (req, res) => {
  try {
    const { orderID } = req.body;
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