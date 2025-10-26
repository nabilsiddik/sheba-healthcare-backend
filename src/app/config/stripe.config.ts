import Stripe from 'stripe'
import { envVars } from './env'

export const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover"
})