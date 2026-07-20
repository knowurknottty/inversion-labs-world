import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { SynSyncSection } from './components/SynSyncSection';
import { MemoryLens } from './components/MemoryLens';
import { EcosystemAtlas } from './components/EcosystemAtlas';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { Principles } from './components/Principles';
import { FinalCta } from './components/FinalCta';
import { SiteFooter } from './components/SiteFooter';

export default function App() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <SynSyncSection />
        <MemoryLens />
        <EcosystemAtlas />
        <ArchitectureExplorer />
        <Principles />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
