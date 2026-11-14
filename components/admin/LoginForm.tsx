"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

export const LoginForm = () => {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-brand-ink">管理密碼</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 w-full rounded-2xl border border-brand-soft/50 bg-white px-4 py-3 text-base text-brand-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 font-medium text-white shadow-lg shadow-brand/25 transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "登入中…" : "登入"}
      </button>
    </form>
  );
};
