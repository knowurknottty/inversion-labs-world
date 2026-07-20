import { useState, useEffect, useRef } from 'react';
import { MemoryObjectProvider } from './context/MemoryObject';
import { CinematicEntry } from './components/CinematicEntry';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { EvidenceLedger } from './components/EvidenceLedger';
import { LensSection } from './components/LensSection';
import { SynSyncProduct } from './components/SynSyncProduct';
import { EcosystemAtlas } from './components/EcosystemAtlas';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { Principles } from './components/Principles';
import { FinalCta } from './components/FinalCta';
import { SiteFooter } from './components/SiteFooter';
import { MemoryObjectIndicator } from './components/MemoryObjectIndicator';
import { SiteMapMinimap } from './components/SiteMapMinimap';
import { TopologyCanvas } from './components/TopologyCanvas';
import './styles.css';

const SECTION_IDS = ['hero', 'evidence', 'lens', 'synsync', 'atlas', 'architecture', 'principles', 'participate'];

function AppContent() {
  const [entryComplete, setEntryComplete] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set(['hero']));
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
            setVisitedSections(prev => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.35 }
    );

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [entryComplete]);

  return (
    <div className={`app-root ${entryComplete ? 'app-root--revealed' : 'app-root--hidden'}`}>
      <CinematicEntry onComplete={() => setEntryComplete(true)} />

      <TopologyCanvas activeSection={activeSection} />

      <SiteHeader />
      <MemoryObjectIndicator />
      <SiteMapMinimap activeSection={activeSection} visitedSections={visitedSections} />

      <main id="main-content">
        <Hero />
        <EvidenceLedger />
        <LensSection />
        <SynSyncProduct />
        <EcosystemAtlas />
        <ArchitectureExplorer />
        <Principles />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <MemoryObjectProvider>
      <AppContent />
    </MemoryObjectProvider>
  );
}
