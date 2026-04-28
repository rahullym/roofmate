// src/app/login/page.tsx
import { LoginForm } from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export const metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="container max-w-md py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle>Sign in to RoofMate</CardTitle>
          <CardDescription>Use the demo admin account to access the catalog and admin tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm next={searchParams.next} />
        </CardContent>
      </Card>
    </div>
  );
}
