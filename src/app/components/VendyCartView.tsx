"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface VendyCartViewProps {
  currentTotal: number | null;
  cartItems: CartItem[];
  paymentComplete: boolean;
  onPayClick: () => void;
  sessionStatus: string;
  isPTTActive: boolean;
  setIsPTTActive: (val: boolean) => void;
  isPTTUserSpeaking: boolean;
  handleTalkButtonDown: () => void;
  handleTalkButtonUp: () => void;
}

type VendyState = "neutral" | "speaking" | "payment_complete";

function VendyCartView({
  currentTotal,
  cartItems,
  paymentComplete,
  onPayClick,
  sessionStatus,
  isPTTActive,
  setIsPTTActive,
  isPTTUserSpeaking,
  handleTalkButtonDown,
  handleTalkButtonUp,
}: VendyCartViewProps) {
  const [vendyState, setVendyState] = useState<VendyState>("neutral");

  // Listen for agent speaking events to change face state
  useEffect(() => {
    const handleAgentEvent = (event: any) => {
      const detail = event.detail || event;

      // Check if payment is complete
      if (
        detail.type === "conversation.item.created" &&
        detail.item?.type === "function_call" &&
        detail.item?.name === "process_payment"
      ) {
        setVendyState("payment_complete");
        return;
      }

      // Check if agent is speaking
      if (
        detail.type === "response.audio.delta" ||
        detail.type === "response.audio_transcript.delta"
      ) {
        setVendyState("speaking");
        return;
      }

      // Check if agent finished speaking - only listen to audio.done
      if (detail.type === "response.audio.done") {
        // Only return to neutral if payment isn't complete
        if (!paymentComplete) {
          setVendyState("neutral");
        }
      }
    };

    window.addEventListener("agent-event", handleAgentEvent);
    return () => {
      window.removeEventListener("agent-event", handleAgentEvent);
    };
  }, [paymentComplete]);

  // Update state when payment completes and revert after delay
  useEffect(() => {
    if (paymentComplete) {
      setVendyState("payment_complete");

      // Revert to neutral after 10 seconds
      const timer = setTimeout(() => {
        setVendyState("neutral");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [paymentComplete]);

  // Map state to image file
  const getVendyImage = () => {
    switch (vendyState) {
      case "speaking":
        return "/vendy_speaking.png";
      case "payment_complete":
        return "/payment_complete.png";
      case "neutral":
      default:
        return "/vendy_neutral.png";
    }
  };

  // Get product image (placeholder for now, ready for real logic later)
  const getProductImage = (_productId: string) => {
    // TODO: Replace with actual product image mapping
    // Example future implementation:
    // const productImageMap: Record<string, string> = {
    //   "P-001": "/products/kitkat.png",
    //   "P-002": "/products/chips.png",
    //   ...
    // };
    // return productImageMap[productId] || "/vendy_neutral.png";

    // For now, use vendy_neutral.png as placeholder for all products
    return "/vendy_neutral.png";
  };

  const isConnected = sessionStatus === "CONNECTED";

  return (
    <div className="flex h-screen bg-white">
      {/* Left Half - Vendy */}
      <div className="w-1/2 flex flex-col relative">
        <div className="flex-1 flex items-center justify-center">
          <Image
            src={getVendyImage()}
            alt="Vendy"
            width={600}
            height={400}
            className="object-contain max-w-full max-h-full"
            priority
          />
        </div>

        {/* Bottom PTT Control Bar */}
        <div className="bg-white border-t border-gray-300 px-6 py-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <input
              id="ptt-toggle-cart"
              type="checkbox"
              checked={isPTTActive}
              onChange={(e) => setIsPTTActive(e.target.checked)}
              disabled={!isConnected}
              className="w-5 h-5 cursor-pointer accent-gray-900"
            />
            <label
              htmlFor="ptt-toggle-cart"
              className="text-sm font-medium cursor-pointer select-none text-gray-900"
            >
              Push to talk
            </label>
            <button
              onMouseDown={handleTalkButtonDown}
              onMouseUp={handleTalkButtonUp}
              onTouchStart={handleTalkButtonDown}
              onTouchEnd={handleTalkButtonUp}
              disabled={!isPTTActive}
              className={`py-2 px-6 rounded-lg text-sm font-semibold transition-all ${
                isPTTUserSpeaking
                  ? "bg-gray-900 text-white"
                  : "bg-gray-800 text-white hover:bg-gray-900"
              } ${
                !isPTTActive
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Hold to Talk
            </button>
          </div>
        </div>
      </div>

      {/* Right Half - Cart Panel */}
      <div className="w-1/2 flex flex-col bg-gray-50 border-l border-gray-300">
        {/* Cart Header */}
        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm"
                >
                  {/* Product Image Placeholder */}
                  <div className="flex-shrink-0">
                    <Image
                      src={getProductImage(item.productId)}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-md bg-gray-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      SAR {item.unitPrice} each
                    </p>
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      {item.quantity}x
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      SAR {item.subtotal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer - Total and Pay Button */}
        <div className="bg-white border-t border-gray-300 px-6 py-4">
          {/* QR Code Placeholder */}
          {currentTotal > 0 && !paymentComplete && (
            <div className="mb-4 bg-gray-100 p-4 rounded-lg">
              <div className="w-32 h-32 mx-auto bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">
                QR Code
                <br />
                (Coming Soon)
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-green-700">
              SAR {currentTotal ?? 0}
            </span>
          </div>

          {/* Pay Button */}
          <button
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl text-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={!currentTotal || sessionStatus !== "CONNECTED" || paymentComplete}
            onClick={onPayClick}
          >
            {paymentComplete ? "✓ Payment Complete!" : "Pay Now"}
          </button>

          {/* Connection Status Indicator */}
          {sessionStatus !== "CONNECTED" && (
            <div className="text-center text-sm text-gray-500 mt-2">
              {sessionStatus === "CONNECTING" ? "Connecting..." : "Disconnected"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendyCartView;
