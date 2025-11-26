import { Router } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config(); // 👈 CARGAR VARIABLES DE ENTORNO

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET);// 👈 AHORA SÍ EXISTE

router.post("/crear-intent", async (req, res) => {
  try {
    const { amount, description } = req.body;

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "mxn",
      description,
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    console.error("❌ Error creando PaymentIntent:", error);
    res.status(500).json({ message: "Error creando el pago" });
  }
});

export default router;
