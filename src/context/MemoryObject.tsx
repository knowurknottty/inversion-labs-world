import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ProvenanceEvent {
  section: string;
  action: string;
  timestamp: number;
}

export interface MemoryObjectState {
  id: string;
  events: ProvenanceEvent[];
  addEvent: (section: string, action: string) => void;
  exportJSON: () => string;
}

const MemoryObjectContext = createContext<MemoryObjectState | null>(null);

function generateId(): string {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `MEM / ${hex.toUpperCase()}`;
}

export function MemoryObjectProvider({ children }: { children: ReactNode }) {
  const [id] = useState(generateId);
  const [events, setEvents] = useState<ProvenanceEvent[]>([{
    section: 'origin',
    action: 'session_created',
    timestamp: Date.now(),
  }]);

  const addEvent = useCallback((section: string, action: string) => {
    setEvents(prev => [
      ...prev,
      { section, action, timestamp: Date.now() },
    ]);
  }, []);

  const exportJSON = useCallback(() => {
    return JSON.stringify({ id, provenance: events }, null, 2);
  }, [id, events]);

  return (
    <MemoryObjectContext.Provider value={{ id, events, addEvent, exportJSON }}>
      {children}
    </MemoryObjectContext.Provider>
  );
}

export function useMemoryObject(): MemoryObjectState {
  const ctx = useContext(MemoryObjectContext);
  if (!ctx) throw new Error('useMemoryObject must be used within MemoryObjectProvider');
  return ctx;
}
