import {
  ecosystemSystems as rawSystems,
  evidenceLabel,
  evidenceTone,
  verifiedProofUrl,
} from './ecosystem';
import type { EcosystemSystem } from '../types';

// Spec component interface (adapted from real registry shape)
export type MaturityStage =
  | 'concept'
  | 'open-research'
  | 'active-development'
  | 'living-practice'
  | 'live';

export interface EcosystemProofAdapted {
  level: 'I' | 'II' | 'III' | 'IV';
  open: string;
  url_last_checked?: string;
}

export interface EcosystemSystemAdapted {
  id: string;
  name: string;
  tagline: string;
  maturity: MaturityStage;
  color: string;
  proof: EcosystemProofAdapted;
  description: string;
  verification_level: EcosystemSystem['verification_level'];
  evidenceLabel: string;
  evidenceTone: string;
  verifiedProofUrl: string | null;
}

const STAGE_MAP: Record<EcosystemSystem['stage'], MaturityStage> = {
  Live: 'live',
  'Active development': 'active-development',
  'Open research': 'open-research',
  'Living practice': 'living-practice',
  Concept: 'concept',
  Archived: 'concept',
};

function proofLevel(system: EcosystemSystem): EcosystemProofAdapted['level'] {
  if (system.proof.url_reachability === 'verified' && system.demo_status === 'live') return 'I';
  if (system.proof.url_reachability === 'verified') return 'II';
  if (system.verification_level === 'curated') return 'III';
  return 'IV';
}

export const ecosystemSystems: EcosystemSystemAdapted[] = rawSystems.map((system) => ({
  id: system.id,
  name: system.name,
  tagline: system.subtitle,
  maturity: STAGE_MAP[system.stage],
  color: system.color ?? '#6b5cf0',
  proof: {
    level: proofLevel(system),
    open: system.proof.open,
    url_last_checked: system.proof.url_last_checked,
  },
  description: system.description,
  verification_level: system.verification_level,
  evidenceLabel: evidenceLabel(system),
  evidenceTone: evidenceTone(system),
  verifiedProofUrl: verifiedProofUrl(system),
}));

export type { EcosystemSystem };
