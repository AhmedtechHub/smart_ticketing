import React from 'react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import PlannerCTA from '@/components/PlannerCTA'
import PastEvents from '@/components/PastEvents'
import ContactUs from '@/components/ContactUs'
import Footer from '@/components/Footer'

export default function Landing() {
  return (
    <div>
        <Navigation />
        <HeroSection />
        <PlannerCTA />
        <PastEvents />
        <ContactUs />
        <Footer />
    </div>
  )
}
