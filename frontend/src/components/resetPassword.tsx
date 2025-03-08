import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password || !passwordConfirmation) {
      toast.error("Both fields are required");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword: passwordConfirmation, email: location?.state?.email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center justify-center min-h-screen bg-gray-100 px-4", className)} {...props}>
      <Card className="w-full max-w-md shadow-lg rounded-lg bg-white p-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Reset Password</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="passwordConfirmation" className="text-gray-700 font-medium">Confirm Password</Label>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="Confirm new password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
              disabled={loading}
            >
             Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
