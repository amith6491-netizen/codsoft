"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, CreditCard } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tax = Math.round(total * 0.18); // 18% GST
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
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error || "Unable to start payment.");

      const cashfree = await load({ mode: "sandbox" });
      if (!cashfree) throw new Error("Cashfree checkout could not load.");
      const result = await cashfree.checkout({ paymentSessionId: order.paymentSessionId, redirectTarget: "_modal" });
      if (result?.error) {
        await fetch("/api/payments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.orderId, status: "CANCELLED", error: result.error.message }),
        });
        setIsProcessing(false);
        setError(result.error.message || "Payment was cancelled.");
        return;
      }
      const verification = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId, cashfreePaymentId: result?.paymentDetails?.cf_payment_id }),
      });
      const payment = await verification.json();
      if (payment.status === "PAID") {
        clearCart();
        router.push(`/orders/${order.orderId}?payment=success`);
      } else if (payment.status === "FAILED") {
        setError(payment.error || "Payment failed. Please try again.");
      } else {
        setError("Payment is pending. Your order will update when Cashfree confirms it.");
      }
      setIsProcessing(false);
    } catch (checkoutError) {
      setIsProcessing(false);
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start payment.");
    }
  };

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
          Looks like you haven&apos;t added anything to your cart yet. Browse our delicious menu and find something you love!
        </p>
        <Link href="/menu" className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors">
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

            <fieldset className="mb-6 space-y-2">
              <legend className="font-semibold mb-3">Payment method</legend>
              {[
                ["UPI", "UPI apps"],
                ["CARD", "Credit or debit card"],
                ["NETBANKING", "Net banking"],
                ["WALLET", "Wallets"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-primary">
                  <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} className="accent-primary" />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
            
            <button onClick={handleCheckout} disabled={isProcessing} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 group shadow-md shadow-primary/20 disabled:opacity-60">
              <CreditCard className="w-5 h-5" /> {isProcessing ? "Starting secure checkout..." : "Pay securely"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
