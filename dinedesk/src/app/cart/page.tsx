"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, CreditCard, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const UPI_PROVIDERS = [
  { id: "google-pay", name: "Google Pay", icon: "🔵" },
  { id: "paytm", name: "Paytm", icon: "🟠" },
  { id: "phonepe", name: "PhonePe", icon: "🟣" },
  { id: "upi-default", name: "Any UPI App", icon: "📱" },
];

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiProvider, setUpiProvider] = useState("google-pay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          upiProvider: paymentMethod === "UPI" ? upiProvider : undefined,
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });

      const order = await response.json();
      
      if (!response.ok) {
        throw new Error(order.error || "Unable to start payment.");
      }

      setOrderId(order.orderId);
      setShowConfirmation(true);

      // For Cash on Delivery, skip payment verification
      if (paymentMethod === "CASH") {
        clearCart();
        localStorage.removeItem("dinedesk-cart");
        setIsProcessing(false);
        
        // Redirect after delay
        setTimeout(() => {
          router.push(`/orders/${order.orderId}?payment=pending`);
        }, 1500);
        return;
      }

      // For other payment methods, verify payment
      const verification = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId }),
      });

      const payment = await verification.json();

      if (payment.status === "PAID" || payment.status === "PENDING") {
        clearCart();
        localStorage.removeItem("dinedesk-cart");
        setIsProcessing(false);
        
        // Redirect after delay
        setTimeout(() => {
          router.push(`/orders/${order.orderId}?payment=success`);
        }, 1500);
      } else {
        setIsProcessing(false);
        setShowConfirmation(false);
        setError(payment.error || "Payment failed. Please try again.");
      }
    } catch (checkoutError) {
      setIsProcessing(false);
      setShowConfirmation(false);
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start payment.");
    }
  };

  if (showConfirmation && orderId) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-outfit font-bold mb-2">Order Confirmed!</h2>
          <p className="text-foreground/70 mb-2">Your order has been placed successfully</p>
          <p className="text-sm text-foreground/60 mb-6">Order ID: {orderId}</p>
          <p className="text-lg font-bold text-primary mb-6">₹{finalTotal.toLocaleString('en-IN')}</p>
          <p className="text-sm text-foreground/60 mb-4">{isProcessing ? "Processing your payment..." : "Redirecting to order summary..."}</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-outfit font-bold mb-4">Your cart is empty</h2>
        <p className="text-foreground/70 mb-8 max-w-md text-center">
          Looks like you haven&apos;t added anything to your cart yet. Browse our delicious menu!
        </p>
        <Link href="/menu" className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4 font-medium">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="text-4xl font-outfit font-bold">Your Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 md:p-6 bg-card border border-border rounded-3xl shadow-sm">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0">
                <Image 
                  src={item.image || "/burger.jpg"} 
                  alt={item.name} 
                  fill 
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-cover"
                />
              </div>
              
              <div className="flex flex-col flex-1 justify-between py-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-outfit font-bold text-lg md:text-xl line-clamp-2">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-card transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-card transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-bold text-lg">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 sticky top-24 shadow-sm">
            <h2 className="text-2xl font-outfit font-bold mb-6 pb-4 border-b border-border">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-foreground/80">
                <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-foreground/80">
                <span>GST (18%)</span>
                <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-4 border-t border-b border-border mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Payment Methods */}
            <fieldset className="mb-6 space-y-2">
              <legend className="font-semibold mb-3">Payment method</legend>
              {[
                ["UPI", "UPI apps"],
                ["CASH", "Cash on Delivery"],
                ["CARD", "Credit or debit card"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-primary transition-colors">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value={value} 
                    checked={paymentMethod === value} 
                    onChange={() => setPaymentMethod(value)} 
                    className="accent-primary" 
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            {/* UPI Provider Selection */}
            {paymentMethod === "UPI" && (
              <fieldset className="mb-6 space-y-2">
                <legend className="font-semibold mb-3 text-sm">Select UPI App</legend>
                <div className="grid grid-cols-2 gap-2">
                  {UPI_PROVIDERS.map((provider) => (
                    <label 
                      key={provider.id}
                      className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                        upiProvider === provider.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="upiProvider" 
                        value={provider.id} 
                        checked={upiProvider === provider.id}
                        onChange={() => setUpiProvider(provider.id)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{provider.icon} {provider.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {error && (
              <p role="alert" className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </p>
            )}
            
            <button 
              onClick={handleCheckout} 
              disabled={isProcessing} 
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5" /> 
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
