import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PayPalButtonProps {
  amount: string;
  onSuccess: (details: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex items-center justify-center space-x-2 p-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Chargement de PayPal...</span>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        shape: "rect",
        color: "gold"
      }}
      createOrder={(_data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount,
              currency_code: "EUR"
            },
            description: "Musique Personnalisée"
          }]
        });
      }}
      onApprove={async (data, actions) => {
        try {
          const details = await actions.order.capture();
          onSuccess(details);
          return details;
        } catch (error) {
          console.error('Erreur capture PayPal:', error);
          toast.error('Erreur lors de la finalisation du paiement');
          throw error;
        }
      }}
      onError={(err) => {
        console.error('Erreur PayPal:', err);
        toast.error('Une erreur est survenue avec PayPal');
      }}
      onCancel={() => {
        toast.error('Paiement annulé');
      }}
    />
  );
};

export default PayPalButton;