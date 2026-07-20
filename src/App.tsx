import { ArchitectureExplorer } from './components/ArchitectureExplorer'
import { CaptSolo } from './components/CaptSolo'
import { Excursion } from './components/Excursion'
import { FinalCta } from './components/FinalCta'
import { Hero } from './components/Hero'
import { Principles } from './components/Principles'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { SynSyncProduct } from './components/SynSyncProduct'
import { WorkOverview } from './components/WorkOverview'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <WorkOverview />
        <SynSyncProduct />
        <CaptSolo />
        <Excursion />
        <ArchitectureExplorer />
        <Principles />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
