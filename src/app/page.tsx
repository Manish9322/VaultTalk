import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowRight, ShieldCheck, Users, LayoutDashboard, Star, DoorOpen, UserRoundPlus, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

export default function LandingPage() {
  
  const getAvatarUrl = (avatarId: string) => {
    return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Logo />
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
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40">
            <div
                className="absolute inset-0 -z-10 bg-muted/20"
                style={{
                    backgroundImage: 'radial-gradient(circle at top left, hsl(var(--primary) / 0.1), transparent 30%), radial-gradient(circle at bottom right, hsl(var(--accent) / 0.1), transparent 30%)',
                }}
            ></div>
            <div className="container text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Secure Communication for Modern Teams
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                VaultTalk provides an encrypted, private, and efficient platform for your
                organization's internal communication needs.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/40 py-20">
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

        {/* Testimonial Section */}
        <section className="py-20">
            <div className="container">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold">Trusted by Professionals</h2>
                    <p className="mt-2 text-muted-foreground">
                        See what our users are saying about VaultTalk.
                    </p>
                </div>
                <div className="mt-12 flex justify-center">
                    <Card className="max-w-3xl">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-1 text-primary">
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                            </div>
                            <blockquote className="mt-4 text-lg font-semibold italic">
                                &ldquo;VaultTalk has transformed our internal communications. It's secure, intuitive, and the admin features give us the control we need. It's been a game-changer for our team's productivity.&rdquo;
                            </blockquote>
                            <div className="mt-6 flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={getAvatarUrl('2')} alt="Bob's avatar" />
                                    <AvatarFallback>B</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Bob</p>
                                    <p className="text-sm text-muted-foreground">CTO, Innovate Corp</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
