"use server";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(_prev: unknown, formData: FormData) {
  const next = String(formData.get("next") || "/");
  try {
    await signIn("credentials", {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      redirectTo: next,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err; // redirect() throws — let it through
  }
  return { error: null };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
