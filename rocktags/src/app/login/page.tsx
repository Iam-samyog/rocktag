import { Navigation } from "@/components/navigation";
import { SignInForm } from "@/components/signin-form";
import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Background effects similar to hero section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/10 to-background" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, oklch(0.55 0.15 145) 1px, transparent 1px),
                             linear-gradient(to bottom, oklch(0.55 0.15 145) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="container relative z-10 mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left side - Sign In */}
            <SignInForm />

            {/* Right side - Sign Up */}
            <SignUpForm />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </section>
    </main>
  );
}
