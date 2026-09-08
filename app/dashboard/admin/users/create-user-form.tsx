"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateUserForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, noHp, password, role }),
    });

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
      <input
        value={noHp}
        onChange={(e) => setNoHp(e.target.value)}
        placeholder="Nomor HP"
        type="tel"
        className="rounded-lg border px-3 py-2"
        required
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama"
        className="rounded-lg border px-3 py-2"
        required
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="rounded-lg border px-3 py-2"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="rounded-lg border px-3 py-2"
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-lg border px-3 py-2"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white md:col-span-2"
      >
        Tambah User
      </button>
    </form>
  );
}
