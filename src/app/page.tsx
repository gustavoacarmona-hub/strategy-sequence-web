import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Bio from '@/components/Bio'
import LogoWall from '@/components/LogoWall'
import Services from '@/components/Services'
import Process from '@/components/Process'
import StrategySeries from '@/components/StrategySeries'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Bio />
      <LogoWall />
      <Services />
      <Process />
      <StrategySeries />
      <Footer />
    </main>
  )
}
