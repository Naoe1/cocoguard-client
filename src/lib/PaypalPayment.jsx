import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
const baseURL = import.meta.env.VITE_API_URL;

export const PaypalPayment = ({ cartItems, farmId, clearCart }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const createOrder = async (data, actions) => {
    setErrorMessage(null);
    console.log('Creating order for items:', cartItems);
    const cartDataForServer = cartItems.map((item) => ({
      sku: item.product.id,
      quantity: item.quantity,
    }));

    return fetch(`${baseURL}/market/${farmId}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart: cartDataForServer,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || 'Failed to create order');
          });
        }
        return response.json();
      })
      .then((order) => {
        console.log(order);
        if (!order || !order.id) {
          throw new Error('Invalid order response from server');
        }
        return order.id;
      })
      .catch((error) => {
        console.error('Error creating PayPal order:', error);
        setErrorMessage(`Error creating order: ${error.message}`);
        throw error;
      });
  };

  const onApprove = async (data, actions) => {
    setErrorMessage(null);
    console.log('Order approved:', data);
    return fetch(`${baseURL}/market/${farmId}/capture-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || 'Failed to capture order');
          });
        }
        return response.json();
      })
      .then((details) => {
        console.log('Order captured successfully:', details);
        toast.success(
          'Transaction completed by ' + details.payer.name.given_name,
        );
        clearCart();
        return details;
      })
      .catch((error) => {
        console.error('Error capturing PayPal order:', error);
        setErrorMessage(`Error capturing order: ${error.message}`);
        actions.restart();
        throw error;
      });
  };

  const onError = (err) => {
    console.error('PayPal Buttons Error:', err);
    setErrorMessage(
      'An error occurred with the PayPal payment process. Please try again.',
    );
  };

  return (
    <>
      {errorMessage && (
        <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
      )}
      <PayPalButtons
        className="w-full"
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </>
  );
};
