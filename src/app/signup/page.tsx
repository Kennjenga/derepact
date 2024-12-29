import SignupForm from "@/components/sign-up";
import { resendVerificationEmail } from "@/actions/auth";

const page = () => {
  // to use it just create a button and thats it
  const handleResend = async (email: string) => {
    const result = await resendVerificationEmail(email);

    if (result.success) {
      alert("Verification email resent successfully!");
    } else {
      alert(result.errors?.email?.join(", ") || "Failed to resend email.");
    }
  };
  return (
    <div>
      <SignupForm />
    </div>
  );
};

export default page;
