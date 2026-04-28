// src/app/login/login-form.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signInAction, type SignInState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignInState = { error: null };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? "/"} />

      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          defaultValue="admin"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="admin"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-xs text-muted-foreground text-center">
        Demo credentials: <span className="font-medium">admin / admin</span>
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}
