'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  email: string;
  name: string;
  expectedOtp: string;
  onClose: () => void;
  onVerified: () => void;
  onResendOtp: () => Promise<boolean>;
}

export function OtpVerificationModal({
  isOpen,
  email,
  name,
  expectedOtp,
  onClose,
  onVerified,
  onResendOtp
}: OtpVerificationModalProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setErrorMsg('');
      setTimeLeft(300);
      setResendSuccess(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg('');
    const lastChar = value.slice(-1);
    if (!/^\d*$/.test(lastChar)) return;

    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);

    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 6 digits entered
    if (newDigits.every((d) => d !== '')) {
      const fullCode = newDigits.join('');
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newDigits = pastedData.split('');
    setDigits(newDigits);
    inputRefs.current[5]?.focus();
    verifyCode(pastedData);
  };

  const verifyCode = (codeToTest?: string) => {
    const entered = codeToTest || digits.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      if (entered === expectedOtp) {
        setIsVerifying(false);
        onVerified();
      } else {
        setIsVerifying(false);
        setErrorMsg('Invalid OTP code. Please check your email inbox and try again.');
      }
    }, 400);
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    setErrorMsg('');
    setResendSuccess(false);

    const success = await onResendOtp();
    setIsResending(false);

    if (success) {
      setResendSuccess(true);
      setTimeLeft(300);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setTimeout(() => setResendSuccess(false), 4000);
    } else {
      setErrorMsg('Failed to resend verification email. Please check your internet connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Verify Your Email
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              We sent a 6-digit OTP code to:
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>New OTP code sent! Check your inbox.</span>
          </div>
        )}

        {/* 6 Digit Input Fields */}
        <div className="space-y-3">
          <div className="flex justify-center gap-2 md:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-10 h-12 md:w-12 md:h-14 text-center font-bold text-xl rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
            <span>Code expires in: <strong className="text-purple-500">{formatTime(timeLeft)}</strong></span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Resending...' : 'Resend Code'}</span>
            </button>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="button"
          onClick={() => verifyCode()}
          disabled={isVerifying || digits.some(d => !d)}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isVerifying ? (
            <span>Verifying Code...</span>
          ) : (
            <>
              <span>Verify & Complete Signup</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            ← Cancel or change email address
          </button>
        </div>
      </div>
    </div>
  );
}
