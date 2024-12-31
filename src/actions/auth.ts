"use server";

import { prisma } from "@/lib/prisma";
import { SignupFormSchema, FormState } from "@/lib/sign/definitions";
import { LoginResult, LoginSchema } from "@/lib/sign/logindef";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

// SIGNUP FUNCTION
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email"; // Utility to send emails

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

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        verificationToken,
        updatedAt: new Date().toISOString(),
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

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

// resend verfication
export async function resendVerificationEmail(email: string) {
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

    if (user.isVerified) {
      return {
        errors: {
          email: ["This account is already verified"],
        },
      };
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update the user with the new token
    await prisma.user.update({
      where: { email },
      data: { verificationToken },
    });

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Resend verification error:", error);
    return {
      errors: {
        database: ["Failed to resend verification email. Please try again."],
      },
    };
  }
}

export async function verifyEmail(token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return {
        errors: {
          token: ["Invalid or expired verification token"],
        },
      };
    }

    // Update user to mark as verified
    await prisma.user.update({
      where: { uid: user.uid },
      data: {
        isVerified: true,
        verificationToken: null, // Clear the token
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      errors: {
        database: ["Failed to verify email. Please try again."],
      },
    };
  }
}