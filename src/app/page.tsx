"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/chat');
    }
  }, [user, isLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const success = login(email);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "No user found with that email. Try 'alice@whisper.com'.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    }, 1000);
  };

  if (isLoading || (!isLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Logo />
          <CardTitle className="pt-4">Welcome Back</CardTitle>
          <CardDescription>Enter your email to sign in to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="alice@whisper.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Hint: Use a mock email like 'alice@whisper.com' or 'admin@whisper.com'.
      </p>
    </div>
  );
}
