// Re-export real architecture data under the spec's expected module name.
export {
  architectureNodes,
  architectureConnections,
  depthDefinitions,
  museumStops,
  nodeTypeLabels,
  getNode,
  connectedNodeIds,
} from './architecture';

export type {
  ArchitectureNode,
  ArchitectureConnection,
  DepthDefinition,
  MuseumStop,
  NodeType,
  ConnectionKind,
} from '../types';
