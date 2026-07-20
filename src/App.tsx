import { ArchitectureExplorer } from './components/ArchitectureExplorer'
import { EcosystemAtlas } from './components/EcosystemAtlas'
import { EvidenceLedger } from './components/EvidenceLedger'
import { FinalCta } from './components/FinalCta'
import { Hero } from './components/Hero'
import { LensSection } from './components/LensSection'
import { Principles } from './components/Principles'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { SynSyncProduct } from './components/SynSyncProduct'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <EvidenceLedger />
        <SynSyncProduct />
        <EcosystemAtlas />
        <LensSection />
        <ArchitectureExplorer />
        <Principles />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
