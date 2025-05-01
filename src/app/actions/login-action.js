"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const loginAction = async (formData) => {

  const email = formData.email;
  const password = formData.password;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
    return redirect("/login?error=" + error.message);
  }
  return redirect("/dashboard/products");
};
