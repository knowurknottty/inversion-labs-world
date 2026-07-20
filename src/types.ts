export type NodeType =
  | 'workspace'
  | 'domain'
  | 'memory'
  | 'source'
  | 'agent'
  | 'revision'
  | 'permission'
  | 'insight'
  | 'external'

export type ConnectionKind = 'contains' | 'derived' | 'used' | 'governed' | 'portable'

export interface ArchitectureNode {
  id: string
  label: string
  type: NodeType
  eyebrow: string
  summary: string
  content: string
  origin: string
  created: string
  usedBy: string
  transformations: string[]
  permissions: string[]
  x: number
  y: number
  minDepth: number
  mutable?: boolean
}

export interface ArchitectureConnection {
  from: string
  to: string
  label: string
  kind: ConnectionKind
  minDepth: number
}

export interface DepthDefinition {
  value: number
  shortLabel: string
  title: string
  description: string
}

export interface MuseumStop {
  title: string
  caption: string
  nodeId: string
  depth: number
}

export type EcosystemCategory =
  | 'Architecture'
  | 'Protocol'
  | 'Product'
  | 'Research program'
  | 'Field practice'

export type SystemStage =
  | 'Live'
  | 'Active development'
  | 'Open research'
  | 'Living practice'
  | 'Concept'
  | 'Archived'

export type ProofReachability = 'verified' | 'unverified' | 'unknown'

export interface EcosystemProof {
  exists: string
  for: string
  open: string
  limit: string | null
  url_tier: string
  url_reachability: ProofReachability
  url_last_checked: string
  url_class: string
}

export interface EcosystemSystem {
  id: string
  slug: string
  name: string
  subtitle: string
  role: string
  category: EcosystemCategory
  type: EcosystemCategory
  stage: SystemStage
  visibility: 'public' | 'experimental' | 'internal' | 'archived'
  display_order: number
  audience: string[]
  thesis: string
  description: string
  before: string
  after: string
  requires: string[]
  provides: string[]
  maintainers: string[]
  license: string
  documentation_status: string
  demo_status: string
  test_status: string
  stability: string
  verification_level: 'verified' | 'inferred' | 'curated' | 'needs-confirmation'
  proof: EcosystemProof
  inv: {
    human: string
    builder: string
    researcher: string
  }
  depends_on: string[]
  integrates_with: string[]
  related_to: string[]
  provides_relationship?: string[]
  consumes: string[]
  extends: string[]
  derived_from: string[]
  optional_with: string[]
  color?: string
}
