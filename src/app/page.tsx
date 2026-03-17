import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Manufacturing from "@/components/Manufacturing";
import Benefits from "@/components/Benefits";
import Enterprise from "@/components/Enterprise";
import PriceCalculator from "@/components/PriceCalculator";
import Testimonial from "@/components/Testimonial";
import FAQ from "@/components/FAQ";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
      <About />
      <Services />
      <Process />
      <Manufacturing />
      <Benefits />
      <Enterprise />
      <PriceCalculator />
      <Testimonial />
      <FAQ />
      <GetStarted />
      <Footer />
    </main>
  );
}
