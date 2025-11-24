// app/signup/page.tsx
import { SignUpForm } from "@/app/components/Landing_page_components/signup-form";

// Must be a default export AND a React component
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}