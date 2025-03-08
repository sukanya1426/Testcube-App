import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const registerUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      console.log("User Created successfully:", data);
      toast.success("User created successfully. Please verify your email.");
      navigate("/verify-email", { state: { email: email } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error("Registration failed", {
          description: err.message,
        });
      } else {
        setError("An unknown error occurred.");
        toast.error("Registration failed", {
          description: "An unknown error occurred.",
        });
      }
    }
  };

  // Trigger toast error when error state changes
  useEffect(() => {
    if (error) {
      toast.error("Registration failed", {
        description: error,
      });
    }
  }, [error]); // Run only when the error state changes

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign-Up</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerUser}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
             
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
