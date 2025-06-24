"use client";

import { signIn } from "next-auth/react";

export default function Page() {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("Form submitted", { email, password });
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log("Sign in response:", res);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Login</h1>
        <label>
          Email:
          <input type="text" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
