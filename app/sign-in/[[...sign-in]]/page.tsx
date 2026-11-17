import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#06080c] p-4">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(6,182,212,0.10),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.06),transparent_40%)]" />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Sign-in card */}
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
          </div>
        }>
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/[0.03] border border-white/[0.08] shadow-2xl shadow-black/40 backdrop-blur-xl rounded-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-white/50",
                socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                socialButtonsBlockButtonText: "text-white",
                dividerLine: "bg-white/10",
                dividerText: "text-white/30",
                formFieldLabel: "text-white/60",
                formFieldInput: "bg-white/5 border border-white/10 text-white rounded-lg",
                formFieldInputFocus: "border-cyan-500/40",
                formFieldInputShowPasswordButton:
                  "text-cyan-400 hover:text-cyan-300 transition-colors",
                formFieldInputShowPasswordIcon:
                  "text-cyan-400 hover:text-cyan-300 transition-colors",
                formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 rounded-lg",
                footerActionLink: "text-cyan-400 hover:text-cyan-300",
                identityPreviewText: "text-white/70",
                identityPreviewEditButton: "text-cyan-400",
              },
            }}
          />
        </Suspense>
      </div>

      {/* Custom eye icon overlay for password fields */}
      <style>{`
        .cl-formFieldInputShowPasswordButton {
          position: absolute !important;
          right: 12px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          color: #22d3ee !important;
          cursor: pointer !important;
          opacity: 0.7 !important;
          transition: opacity 0.2s ease !important;
          z-index: 10 !important;
        }
        .cl-formFieldInputShowPasswordButton:hover {
          opacity: 1 !important;
          color: #67e8f9 !important;
        }
        .cl-formFieldInputShowPasswordButton svg {
          width: 20px !important;
          height: 20px !important;
        }
        .cl-formFieldInput[type="password"],
        .cl-formFieldInput[type="text"] {
          padding-right: 42px !important;
        }
      `}</style>
    </main>
  );
}
