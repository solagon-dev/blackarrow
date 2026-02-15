import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Coverage from '@/components/Coverage'
import About from '@/components/About'
import Claims from '@/components/Claims'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Coverage />
      <About />
      <Claims />
      <Contact />
      <Footer />
    </main>
  )
}
