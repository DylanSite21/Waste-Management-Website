"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ProfileForm({
  user,
}: {
  user: { id: string; name: string; email: string; role: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Nama"
        required
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Password baru (opsional)"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
