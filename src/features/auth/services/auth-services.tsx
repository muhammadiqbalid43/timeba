import supabase from "@/lib/supabase-client";
import type { SignUpSchema } from "../schemas/sign-up-schema";
import type { User } from "@supabase/supabase-js";
import type { SignInSchema } from "../schemas/sign-in-schema";

export const authService = {
  async signUp(credentials: SignUpSchema): Promise<{ user: User | null }> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    // Create profile record after successful signup
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
      });

      if (profileError) {
        // You might want to handle this error appropriately
        throw new Error("Failed to create user profile");
      }
    }

    return data;
  },

  async signIn(credentials: SignInSchema): Promise<{ user: User | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    // If no session, user is not authenticated
    if (!session) {
      return null;
    }

    // Return the user from the session
    return session.user;
  },
};
