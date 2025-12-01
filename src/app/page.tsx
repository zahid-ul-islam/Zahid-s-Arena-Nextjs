import Hero from "@/components/Hero";
import FeaturedKits from "@/components/FeaturedKits";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Suspense
        fallback={
          <div className="py-20 text-center">Loading featured kits...</div>
        }
      >
        <FeaturedKits />
      </Suspense>
    </div>
  );
}
