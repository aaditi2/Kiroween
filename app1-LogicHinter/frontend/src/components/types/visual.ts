export type VisualType =
  | "array"
  | "graph"
  | "grid"
  | "stack"
  | "queue"
  | "tree"
  | "binary_search"
  | "sliding_window"

export interface VisualStep {
  action: "highlight" | "fade" | "activate" | "visit" | "move"
  target: string | string[]
}

export interface VisualData {
  elements?: string[]
  matrix?: string[][]
  nodes?: string[]
  edges?: [string, string][]
  start?: string
}

export interface VisualPayload {
  visual_type: VisualType
  visual_data: VisualData
  steps: VisualStep[]
}


