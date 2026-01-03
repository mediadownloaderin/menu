"use client"
import CTA from "@/components/site/cta";
import EmpowerBusiness from "@/components/site/emp-business";
import FAQ from "@/components/site/faq";
import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import Hero from "@/components/site/hero";
import Pricing2 from "@/components/site/pricing";
import Testimonials from "@/components/site/reviews";
import Steps from "@/components/site/steps";

export default function Home() {
  return (
  <main className="w-full min-h-screen">
    <Header />
    {/* <PageSidebar/> */}
    <Hero />
    <EmpowerBusiness/>
    <Steps />
    <Testimonials/>
    <Pricing2 slug={""} action={"signup"}  />
    <FAQ/>
    <CTA/>
    <Footer/>
  </main>
  );
}
