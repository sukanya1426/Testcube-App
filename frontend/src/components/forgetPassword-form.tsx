import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      // Simulating an API call to send a password reset email
      console.log("Password reset email sent to:", email);
      toast.success("Password reset email sent", {
        description: "Check your inbox for further instructions.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      toast.error("Failed to send reset email", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center justify-center min-h-screen bg-gray-100 px-4", className)} {...props}>
      <Card className="w-full max-w-md shadow-lg rounded-lg bg-white p-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Forgot Password</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your email address to receive password reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
              disabled={loading}
            >
                <a href="/verify-email" className="text-white">Reset Password</a>
              {/* {loading ? "Sending..." : "Reset Password"} */}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <a href="/login" className="text-blue-600 hover:underline">Go back to login</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
