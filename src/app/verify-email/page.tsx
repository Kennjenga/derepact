"use client";

import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/auth";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleVerification = async () => {
    if (!token) return;

    const result = await verifyEmail(token);

    if (result.success) {
      alert("Email verified successfully!");
    } else {
      alert(result.errors?.token?.join(", ") || "Verification failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Verify Your Email</h1>
      <button
        onClick={handleVerification}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Verify Email
      </button>
    </div>
  );
}
