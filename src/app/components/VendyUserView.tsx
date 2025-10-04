"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface VendyUserViewProps {
  currentTotal: number | null;
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

function VendyUserView({
  currentTotal,
  paymentComplete,
  onPayClick,
  sessionStatus,
  isPTTActive,
  setIsPTTActive,
  isPTTUserSpeaking,
  handleTalkButtonDown,
  handleTalkButtonUp,
}: VendyUserViewProps) {
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

      // Check if agent finished speaking
      if (
        detail.type === "response.audio.done" ||
        detail.type === "response.done"
      ) {
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

  const isConnected = sessionStatus === "CONNECTED";

  return (
    <div className="flex flex-col h-screen bg-white relative">
      {/* Vendy Face Container */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={getVendyImage()}
            alt="Vendy"
            width={1200}
            height={800}
            className="object-contain max-w-full max-h-full"
            priority
          />

          {/* Payment UI overlay on the "cheek" (grey cube area) */}
          <div className="absolute bottom-8 right-8 bg-green-600 rounded-2xl p-6 shadow-xl min-w-[280px]">
            <div className="flex flex-col gap-4">
              {/* Price Display */}
              <div className="text-center">
                <div className="text-sm text-green-100 mb-1">Total</div>
                <div className="text-4xl font-bold text-white">
                  {currentTotal || 0} <span className="text-2xl">SAR</span>
                </div>
              </div>

              {/* QR Code Placeholder */}
              {currentTotal && currentTotal > 0 && !paymentComplete && (
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-32 h-32 mx-auto bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">
                    QR Code
                    <br />
                    (Coming Soon)
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                className="bg-white text-green-700 px-6 py-3 rounded-xl text-lg font-bold hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={!currentTotal || sessionStatus !== "CONNECTED" || paymentComplete}
                onClick={onPayClick}
              >
                {paymentComplete ? "✓ Payment Complete!" : "Pay Now"}
              </button>

              {/* Connection Status Indicator (subtle) */}
              {sessionStatus !== "CONNECTED" && (
                <div className="text-center text-xs text-green-100">
                  {sessionStatus === "CONNECTING" ? "Connecting..." : "Disconnected"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom PTT Control Bar */}
      <div className="bg-white border-t border-gray-300 px-6 py-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <input
            id="ptt-toggle-user"
            type="checkbox"
            checked={isPTTActive}
            onChange={(e) => setIsPTTActive(e.target.checked)}
            disabled={!isConnected}
            className="w-5 h-5 cursor-pointer accent-gray-900"
          />
          <label
            htmlFor="ptt-toggle-user"
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
  );
}

export default VendyUserView;
