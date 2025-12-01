import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Zahid&apos;s Arena</h3>
            <p className="text-sm text-muted-foreground">
              Premium football kits for the modern fan. Authentic, high-quality,
              and delivered worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/shop?category=premier-league"
                  className="hover:text-primary"
                >
                  Premier League
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=la-liga"
                  className="hover:text-primary"
                >
                  La Liga
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=bundesliga"
                  className="hover:text-primary"
                >
                  Bundesliga
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=serie-a"
                  className="hover:text-primary"
                >
                  Serie A
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/zifahim98/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background rounded-full hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/fa_him_9898/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background rounded-full hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/zahid-ul-islam/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background rounded-full hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Zahid&apos;s Arena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
