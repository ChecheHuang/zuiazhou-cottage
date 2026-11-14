"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
} from "@/lib/admin-auth";

export interface LoginState {
  error?: string;
}

export const login = async (
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const password = String(formData.get("password") ?? "");

  if (!password || !checkPassword(password)) {
    // 稍微延遲，降低被暴力猜密碼的速度
    await new Promise((r) => setTimeout(r, 800));
    return { error: "密碼錯誤" };
  }

  (await cookies()).set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
};

export const logout = async () => {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
};
