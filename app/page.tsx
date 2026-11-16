import Image from "next/image";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Mon application</h1>

      <Suspense fallback={<p>Chargement…</p>}>
        <Show when="signed-out">
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="rounded bg-black px-4 py-2 text-white">
                Se connecter
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded border px-4 py-2">
                Créer un compte
              </button>
            </SignUpButton>
          </div>
        </Show>

        <Show when="signed-in">
          <p>Tu es connecté.</p>
          <UserButton />
        </Show>
      </Suspense>
    </main>
  );
}