import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowRight, ShieldCheck, Users, LayoutDashboard, DoorOpen, UserRoundPlus, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'End-to-End Encryption',
    description:
      'Keep your conversations private with state-of-the-art encryption. Your data is yours alone.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Team Collaboration',
    description:
      'Create secure group chats for your teams, projects, or departments. Streamline communication and collaboration.',
  },
  {
    icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
    title: 'Admin Oversight',
    description:
      'A powerful admin dashboard to manage users, monitor activity, and ensure compliance within your organization.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon">
                      <Link href="/login">
                        <DoorOpen />
                        <span className="sr-only">Login</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild size="icon">
                      <Link href="/register">
                        <UserRoundPlus />
                        <span className="sr-only">Get Started</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get Started</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon">
                      <Link href="/admin">
                        <Shield />
                        <span className="sr-only">Admin</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Admin</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* About Section */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                About VaultTalk
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                VaultTalk is a secure and private communication platform designed for the modern corporate environment. We believe that internal communication should be efficient, encrypted, and entirely within your organization's control.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted/40 py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our mission is to provide teams with a communication tool that prioritizes security and privacy without sacrificing usability. In a world where data breaches are common, VaultTalk offers a sanctuary for your organization's most sensitive conversations, ensuring that your internal discussions remain internal.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Why VaultTalk?</h2>
              <p className="mt-2 text-muted-foreground">
                Everything you need for secure and efficient team communication.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/40 py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold">
              Ready to Secure Your Conversations?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Create an account and start collaborating securely in minutes.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/register">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VaultTalk. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
