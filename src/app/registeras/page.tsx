"use client";

import { useRouter } from "next/navigation";

export default function ChooseRole() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Create an account for:</h1>
      <button
        onClick={() => router.push("/registeras/register-driver")}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Register as Driver
      </button>
      <button
        onClick={() => router.push("/registeras/register-partner")}
        className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
      >
        Register as Partner
      </button>
      <button
        onClick={() => router.push("/dashboard")}
        className="w-full px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
      >
        Proceed as User
      </button>
    </div>
  );
}
