"use client";

import { useActionState } from "react";
import { loginAction, LoginActionState } from "./api/login.action";

export function Login() {
  const [state, formAction, isPending] = useActionState<
    LoginActionState,
    FormData
  >(loginAction, null);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>

      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Sign In"}
      </button>
    </form>
  );
}
