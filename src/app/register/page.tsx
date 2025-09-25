
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRegisterUserMutation } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { setField, selectRegisterState, clearForm, setSubmitting, setError } from "@/lib/slices/registerSlice";
import type { RootState } from '@/lib/store';

export default function RegisterPage() {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const dispatch = useDispatch();
  const { name, email, phone, password, confirmPassword, error, isSubmitting } = useSelector(selectRegisterState);
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerUser, { isLoading: isRegistering, isSuccess, isError, error: registrationError }] = useRegisterUserMutation();

  useEffect(() => {
    if (!authIsLoading && user) {
      router.push('/chat');
    }
  }, [user, authIsLoading, router]);

  useEffect(() => {
    if (isSuccess) {
      toast({ title: "Registration Successful", description: "You can now log in." });
      dispatch(clearForm());
      router.push('/login');
    }
    if (isError) {
      const apiError = registrationError as any;
      const errorMessage = apiError?.data?.message || "An unknown error occurred.";
      dispatch(setError(errorMessage));
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isSuccess, isError, registrationError, toast, router, dispatch]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setField({ field, value: e.target.value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    dispatch(setSubmitting(true));

    const processRegistration = (avatarDataUrl: string | null) => {
      registerUser({
        name,
        email,
        password,
        phone,
        avatar: avatarDataUrl
      });
    }

    if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            processRegistration(reader.result as string);
        }
        reader.readAsDataURL(avatarFile);
    } else {
        processRegistration(null);
    }
  };
  
  const isSubmitButtonDisabled = isSubmitting || isRegistering || !name || !email || !password || !confirmPassword;

  if (authIsLoading || (!authIsLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
          <Logo />
          <CardTitle className="pt-4">Create an Account</CardTitle>
          <CardDescription>Enter your details to create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={handleInputChange('name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  required
                  value={email}
                  onChange={handleInputChange('email')}
                />
              </div>
            </div>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={phone}
                        onChange={handleInputChange('phone')}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture (Optional)</Label>
                    <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={handleInputChange('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                 <div className="relative">
                    <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
              </div>
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitButtonDisabled}>
              {(isSubmitting || isRegistering) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
