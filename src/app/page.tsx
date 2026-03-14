import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Manufacturing from "@/components/Manufacturing";
import Benefits from "@/components/Benefits";
import Testimonial from "@/components/Testimonial";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Process />
      <Manufacturing />
      <Benefits />
      <Testimonial />
      <FAQ />
      <Footer />
    </main>
  );
}
