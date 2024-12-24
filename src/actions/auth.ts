"use server";

import { prisma } from "@/lib/prisma";
import { SignupFormSchema, FormState } from "@/lib/sign/definitions";
import { LoginResult, LoginSchema } from "@/lib/sign/logindef";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

// SIGNUP FUNCTION
export async function signup(
  state: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  if (!formData) {
    return {
      errors: {
        database: ["Invalid form data"],
      },
    };
  }

  try {
    // Validate form data
    const validatedFields = SignupFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = validatedFields.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: {
          email: ["This email is already registered"],
        },
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
      },
    });

    // Create session for the new user
    await createSession(String(newUser.uid), newUser.email, newUser.username, "user");

    return {
      success: true,
      user: {
        ...newUser,
        password: "", // Don't send password
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      errors: {
        database: ["Failed to create account. Please try again."],
      },
    };
  }
}

// LOGIN FUNCTION
export async function login(
  state: LoginResult | undefined,
  formData: FormData
): Promise<LoginResult> {
  const parsedData = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsedData.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        errors: {
          email: ["No account found with this email"],
        },
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        errors: {
          password: ["Invalid password"],
        },
      };
    }

    // Create session
    await createSession(String(user.uid), user.email, user.username, "user");

    return {
      success: true,
      user: {
        uid: user.uid,
        username: user.username,
        email: user.email,
        password: "", // Don't send password
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      errors: {
        database: ["Failed to log in. Please try again."],
      },
    };
  }
}

// LOGOUT FUNCTION
export async function logout() {
  try {
    await deleteSession();
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
}