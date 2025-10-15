import React, { useState } from "react";
import { HiPlus, HiUser } from "react-icons/hi";

type LoginProps = {
  onSubmit?: (data: {
    name: string;
    phone: string;
  }) => Promise<{ status: string } | void>;
  onVerifyCode?: (data: {
    phone: string;
    code: string;
  }) => Promise<{ status: string } | void>;
};

export default function Login({ onSubmit, onVerifyCode }: LoginProps) {
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    code?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isValidPhone = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "");
    return digits.length >= 8 && digits.length <= 15;
  };

  const isValidName = (value: string) =>
    /^[a-zA-Zа-яА-ЯїЇєЄёЁіІ\s'-]{2,30}$/.test(value.trim());
  const isValidCode = (value: string) => /^[0-9]{4,8}$/.test(value);

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const newErrors: typeof errors = {};
    if (!isValidName(name))
      newErrors.name = "Please enter a valid name (2–30 letters).";
    if (!isValidPhone(phone))
      newErrors.phone = "Please enter a valid phone number (8–15 digits).";

    if (Object.keys(newErrors).length) return setErrors(newErrors);

    try {
      setLoading(true);
      setErrors({});
      onSubmit?.({ name, phone: `+${phone}` });
      setStep("verify");
      setSuccessMessage(`A verification code was sent to +${phone}.`);
    } catch (err: any) {
      setErrors({ phone: err?.message || "Something went wrong — try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValidCode(code))
      return setErrors({ code: "Enter a valid verification code." });

    try {
      setLoading(true);
      setErrors({});
      const res = await onVerifyCode?.({ phone: `+${phone}`, code });
      if (res && (res as any).status === "approved") {
        setSuccessMessage("✅ Phone verified successfully!");
      } else {
        setErrors({ code: "Invalid or expired code." });
      }
    } catch (err: any) {
      setErrors({ code: err?.message || "Verification failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("phone");
    setName("");
    setPhone("");
    setCode("");
    setErrors({});
    setSuccessMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign in</h2>
        <p className="text-sm text-gray-500 mb-6">
          {step === "phone"
            ? "Enter your name and phone number to receive a verification code."
            : "Enter the code we sent to your phone."}
        </p>

        {successMessage && (
          <div className="mb-4 text-green-600 bg-green-50 p-2 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            {/* Name */}
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <HiUser />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={`pl-8 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-400 focus:ring-red-400"
                    : "focus:ring-indigo-400 focus:border-indigo-400"
                }`}
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}

            {/* Phone */}
            <label className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <HiPlus />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="380501234567"
                className={`pl-8 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-400"
                    : "focus:ring-indigo-400 focus:border-indigo-400"
                }`}
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}

            {/* Send button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Verification code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.code
                  ? "border-red-400 focus:ring-red-400"
                  : "focus:ring-indigo-400 focus:border-indigo-400"
              }`}
              disabled={loading}
            />
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code}</p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <button onClick={handleReset} className="underline">
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
