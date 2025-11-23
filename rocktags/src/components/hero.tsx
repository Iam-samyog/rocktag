"use client"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ArrowRight } from "lucide-react"
import {Slottable} from "@radix-ui/react-slot"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="container relative z-10 mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Auth buttons */}
          <div className="flex flex-col items-start justify-center space-y-8">
            <div className="inline-flex flex-col gap-4">
              <ButtonGroup className="bg-background/40 backdrop-blur-xl border border-border/50 shadow-2xl p-1.5">
                <Button asChild size="lg" className="bg-primary/90 hover:bg-primary text-primary-foreground font-medium px-8 shadow-lg">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-foreground hover:bg-accent/50 font-medium px-8">
                  <Link href="/login">Sign Up</Link>
                </Button>
              </ButtonGroup>

              <p className="text-sm text-muted-foreground text-center">
                Join thousands of cat lovers mapping their territory
              </p>
            </div>
          </div>

          {/* Right side - Hero content */}
          <div className="flex flex-col items-start space-y-8">

            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
              microwave
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed text-pretty max-w-xl">
              i love the uta cats
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium group">
                  <Link href="/main/map">Explore the Map</Link>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent/50 font-medium bg-transparent"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-foreground">150+</div>
                <div className="text-sm text-muted-foreground">Cats Mapped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">3.5K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">All</div>
                <div className="text-sm text-muted-foreground">of Campus</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
    </section>
  )
}
