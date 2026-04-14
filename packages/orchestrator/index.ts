/**
 * Public surface of the orchestrator package.
 *
 * Import the {@link LangGraphSwarmOrchestrator} class, the graph builder
 * {@link buildSwarmGraph}, the typed state annotation, or the individual
 * node factories from here.
 *
 * @module orchestrator
 */

export { LangGraphSwarmOrchestrator, buildSwarmGraph } from './graph';
export { swarmStateAnnotation } from './state';
export type { ISwarmGraphState } from './state';
export {
    createDecomposeNode,
    createExecuteSubtasksNode,
    createReviewNode,
    createSynthesizeNode,
    reviewRouter
} from './nodes';
