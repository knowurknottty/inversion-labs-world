import biocapt from '../../projects/biocapt/metadata.json'
import capt from '../../projects/capt/metadata.json'
import ctp from '../../projects/ctp/metadata.json'
import docs from '../../projects/docs/metadata.json'
import excursion from '../../projects/excursion/metadata.json'
import field from '../../projects/field/metadata.json'
import franken from '../../projects/franken/metadata.json'
import hme from '../../projects/hme/metadata.json'
import kb from '../../projects/kb/metadata.json'
import khsb from '../../projects/khsb/metadata.json'
import repos from '../../projects/repos/metadata.json'
import research from '../../projects/research/metadata.json'
import synsync from '../../projects/synsync/metadata.json'
import type { EcosystemSystem } from '../types'

const records = [
  capt,
  biocapt,
  ctp,
  synsync,
  kb,
  khsb,
  franken,
  hme,
  excursion,
  field,
  research,
  docs,
  repos,
] as unknown as EcosystemSystem[]

export const ecosystemSystems = [...records].sort((a, b) => a.display_order - b.display_order)

export const systemById = new Map(ecosystemSystems.map((system) => [system.id, system]))

export function evidenceLabel(system: EcosystemSystem) {
  if (system.proof.url_reachability === 'verified' && system.demo_status === 'live') return 'Verified public surface'
  if (system.proof.url_reachability === 'verified') return 'Verified public record'
  if (system.verification_level === 'curated') return 'Curated claim'
  if (system.verification_level === 'inferred') return 'Inferred'
  return 'Needs confirmation'
}

export function evidenceTone(system: EcosystemSystem) {
  if (system.proof.url_reachability === 'verified') return 'verified'
  if (system.verification_level === 'curated') return 'curated'
  return 'unconfirmed'
}

export function verifiedProofUrl(system: EcosystemSystem) {
  if (system.proof.url_reachability !== 'verified') return null
  if (!system.proof.open.startsWith('https://')) return null
  return system.proof.open
}
