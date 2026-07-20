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
