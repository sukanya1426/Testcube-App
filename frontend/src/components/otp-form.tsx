import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill("")); // OTP State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(location.state.email, otp.join(""));

    try {
      const response = await fetch("http://localhost:3000/user/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: location?.state?.email, otp: otp.join("") }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Verification failed");

      console.log("User verified successfully:", data);
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Verification failed", {
          description: err.message,
        });
        setError(err.message);
      } else {
        toast.error("An unknown error occurred.");
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResend = () => {
    alert("OTP has been resent!");
  };

  // Effect to handle error toast
  useEffect(() => {
    if (error) {
      toast.error("Verification failed", {
        description: error,
      });
    }
  }, [error]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">OTP Verification</h2>
        <p className="text-center text-gray-500 mb-4">Enter the 6-digit OTP sent to your email</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between mb-6">
            {otp.map((_, index) => (
              <Input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={otp[index]}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl border-black rounded-md"
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              type="submit"
              className={`w-full py-2 rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            <p>
              If you didn't receive the OTP,{" "}
              <button onClick={handleResend} className="text-blue-500 hover:underline">
                Resend OTP
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
