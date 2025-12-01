export interface FlowOption {
  id: string
  label: string
  reason: string
  correct: boolean
}

export interface FlowStep {
  id: string
  title: string
  description: string
  options: FlowOption[]
}

export interface FlowchartResponse {
  steps: FlowStep[]
  warning?: string | null
}

export interface StepLink {
  title: string
  url: string
  summary: string
}

export interface StepLinkResponse {
  links: StepLink[]
  warning?: string | null
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000"

export async function requestFlowchart(
  problem: string,
  approach: "naive" | "optimized",
  onStreamChunk?: (chunk: string) => void,
): Promise<FlowchartResponse> {
  const response = await fetch(`${API_BASE}/api/flowchart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem, approach }),
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    if (!response.ok) {
      const errorText = await response.text()
      const detail = errorText ? `: ${errorText}` : ""
      throw new Error(`Flowchart request failed (${response.status})${detail}`)
    }

    return (await response.json()) as FlowchartResponse
  }

  let buffer = ""
  let hasFiredStreamEvent = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    if (!hasFiredStreamEvent) {
      onStreamChunk?.(buffer)
      hasFiredStreamEvent = true
    }
  }

  buffer += decoder.decode()

  if (!response.ok) {
    const detail = buffer ? `: ${buffer}` : ""
    throw new Error(`Flowchart request failed (${response.status})${detail}`)
  }

  try {
    return JSON.parse(buffer) as FlowchartResponse
  } catch (error) {
    throw new Error(`Flowchart response was not valid JSON: ${String(error)}`)
  }
}

export async function requestStepLinks(
  problem: string,
  stepTitle: string,
  stepDescription: string,
): Promise<StepLinkResponse> {
  const response = await fetch(`${API_BASE}/api/step-links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem, step_title: stepTitle, step_description: stepDescription }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    const detail = errorText ? `: ${errorText}` : ""
    throw new Error(`Step link request failed (${response.status})${detail}`)
  }

  return (await response.json()) as StepLinkResponse
}
