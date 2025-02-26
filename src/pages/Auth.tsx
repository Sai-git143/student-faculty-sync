
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8 p-6 bg-background/50 rounded-xl border shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access your account"
              : "Sign up to get started"}
          </p>
        </div>

        {mode === "signin" ? <SignInForm /> : <SignUpForm />}

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
