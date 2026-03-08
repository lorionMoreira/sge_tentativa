import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";
import { decodeSession } from "@/lib/session";
import LogoutButton from "./logout-button";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = sessionCookie ? decodeSession(sessionCookie) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Painel Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Área protegida por autenticação e autorização via cookie de sessão.
        </p>

        <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          <p>
            Usuário autenticado:{" "}
            <strong>{session?.username ?? "não identificado"}</strong>
          </p>
          <p className="mt-2">API base: https://agenda.defensoria.ba.def.br/api/</p>
        </div>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
