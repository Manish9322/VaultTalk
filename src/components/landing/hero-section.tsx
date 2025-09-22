
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Marquee } from "@/components/landing/marquee";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { users } from "@/lib/data";

const stats = [
    { value: "1,200+", label: "Active Users" },
    { value: "2M+", label: "Encrypted Messages" },
    { value: "99.9%", label: "Uptime SLA" },
];

const features = ["End-to-End Encryption", "Team Collaboration", "Admin Oversight", "File Sharing", "SSO Integration"];

export function HeroSection() {

  const getAvatarUrl = (avatarId: string) => {
    const img = PlaceHolderImages.find(img => img.id === avatarId);
    return img ? img.imageUrl : `https://picsum.photos/seed/${avatarId}/100/100`;
  };

  const avatars = users.slice(0, 10).map(user => ({
    id: user.id,
    src: getAvatarUrl(user.avatar),
    fallback: user.name.charAt(0),
  }));

  return (
    <div
      className="relative mx-auto flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-10 md:py-20">
        <h1
          className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Secure Communication for Modern Teams"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block">
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400">
          VaultTalk provides an encrypted, private, and efficient platform for your
          organization's internal communication needs.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Learn More</Link>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="relative z-10 mt-20"
        >
          <div className="flex justify-center items-center gap-8 md:gap-16 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center flex-wrap gap-2 mb-12">
            {features.map((feature, index) => (
                <Badge key={index} variant="secondary">{feature}</Badge>
            ))}
          </div>
          
          <div className="relative [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <Marquee>
              {avatars.map((avatar, index) => (
                <div key={`marquee-avatar-${index}`} className="w-16 h-16 mx-3">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={avatar.src} />
                    <AvatarFallback>{avatar.fallback}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </Marquee>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
