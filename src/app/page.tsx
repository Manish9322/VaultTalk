import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 right-4">
          <Button asChild variant="ghost">
            <Link href="/admin">
              Admin Login
            </Link>
          </Button>
        </div>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="pt-4">Welcome to VaultTalk</CardTitle>
          <CardDescription>The secure and private messaging app.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Connect with your friends and colleagues with confidence.
            </p>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button asChild>
                <Link href="/login">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
