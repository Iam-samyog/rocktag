import Link from "next/link"
import Image from "next/image"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex group">
            <Image
              unoptimized={true}
              src="/finale.gif"
              alt="ACM Logo"
              width={288}
              height={180}
              className="h-16 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Navigation Links */}
          <div className="md:flex items-center gap-8">
            <Link
              href="/main/map"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Map
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="https://www.acmuta.com/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ACM
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
