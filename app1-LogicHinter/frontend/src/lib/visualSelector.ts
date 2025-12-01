export type VisualKey =
  | "stack"
  | "queue"
  | "binary_search"
  | "graph_bfs"
  | "dynamic_programming";

const visualMatchers: Array<{ key: VisualKey; patterns: RegExp[] }> = [
  { key: "stack", patterns: [/stack/, /dfs/, /backtrack/, /balanced brackets?/, /call stack/] },
  { key: "queue", patterns: [/queue/, /bfs/, /level order/, /breadth/] },
  { key: "binary_search", patterns: [/binary search/, /sorted array/, /mid(?:point)?/, /low\s*\+\s*high/] },
  { key: "graph_bfs", patterns: [/graph/, /edge/, /node/, /neighbor/, /shortest path/] },
  { key: "dynamic_programming", patterns: [/dp/, /dynamic programming/, /overlapping subproblems/, /grid/, /table/] },
];

export function selectVisuals(question: string): VisualKey[] {
  const lowered = question.toLowerCase();

  const matched = visualMatchers
    .filter(({ patterns }) => patterns.some((pattern) => pattern.test(lowered)))
    .map(({ key }) => key);

  if (matched.length === 0) {
    return ["stack"];
  }

  return Array.from(new Set(matched)).slice(0, 3);
}
