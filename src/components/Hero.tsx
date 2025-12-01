import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Gradient/Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-purple-900 opacity-80" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />

      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Wear Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Passion
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Authentic football kits from the world's biggest leagues. Experience
          the game like never before.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-white rounded-full hover:bg-gray-100 transition-transform hover:scale-105"
          >
            Shop Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/shop?category=new-arrivals"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border border-white/20 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-transform hover:scale-105"
          >
            New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
