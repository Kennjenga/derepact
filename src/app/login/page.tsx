"use client";

import { login } from "@/actions/auth";
import { useActionState } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const router = useRouter(); // Initialize the router for navigation

  // State to manage form inputs
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Redirect to /dashboard if login is successful
  useEffect(() => {
    if (state?.success && state.user) {
      router.push("/dashboard"); // Redirect to the dashboard
    }
  }, [state?.success, router, state?.user]);

  return (
    <form action={action} className="space-y-4 max-w-md mx-auto p-4">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={formValues.email} // Bind the value to state
          onChange={handleInputChange} // Update state on change
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm">
            {state.errors.email.join(", ")}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formValues.password} // Bind the value to state
            onChange={handleInputChange} // Update state on change
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {state?.errors?.password && (
          <p className="text-red-500 text-sm">
            {state.errors.password.join(", ")}
          </p>
        )}
      </div>

      {/* Database Error */}
      {state?.errors?.database && (
        <p className="text-red-500 text-sm">{state.errors.database}</p>
      )}

      {/* Success Message */}
      {state?.success && (
        <p className="text-green-500 text-sm">Successfully logged in!</p>
      )}

      {/* Submit Button */}
      <button
        disabled={pending}
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
