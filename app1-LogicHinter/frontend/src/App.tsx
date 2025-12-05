import { LayoutGroup, motion } from "framer-motion"
import { useMemo, useState } from "react"
import { MicButton } from "./components/ui/MicButton"
import { FlowOption, FlowStep, StepLink, requestFlowchart, requestStepLinks } from "./lib/flowchart"

const shuffleOptions = <T,>(options: T[]): T[] => [...options].sort(() => Math.random() - 0.5)

const attachShuffledOptions = (steps: FlowStep[]) =>
  steps.map((step) => ({
    ...step,
    options: shuffleOptions(step.options),
  }))

const createEmptySelections = (steps: FlowStep[]): Record<string, FlowOption | null> =>
  steps.reduce(
    (acc, step) => ({
      ...acc,
      [step.id]: null,
    }),
    {} as Record<string, FlowOption | null>
  )

export default function App() {
  const [input, setInput] = useState("")
  const [question, setQuestion] = useState<string | null>(null)
  const [flowchartSteps, setFlowchartSteps] = useState<FlowStep[]>([])
  const [flowchartWarning, setFlowchartWarning] = useState<string | null>(null)
  const [loadingFlowchart, setLoadingFlowchart] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, FlowOption | null>>({})
  const [stepLinks, setStepLinks] = useState<Record<string, StepLink[]>>({})
  const [linkWarnings, setLinkWarnings] = useState<Record<string, string | null>>({})
  const [linkLoading, setLinkLoading] = useState<Record<string, boolean>>({})
  type IncorrectFeedback = {
    reason: string
    option: FlowOption
    stepTitle: string
  }

  const [feedback, setFeedback] = useState<IncorrectFeedback | null>(null)
  const [approach, setApproach] = useState<"naive" | "optimized">("naive")
  const [activeApproach, setActiveApproach] = useState<"naive" | "optimized">("naive")
  const [activeLinkCardStepId, setActiveLinkCardStepId] = useState<string | null>(null)
  const [streamingFlowchart, setStreamingFlowchart] = useState(false)

  const hasActiveFlow = useMemo(
    () => question !== null || loadingFlowchart || flowchartSteps.length > 0,
    [flowchartSteps.length, loadingFlowchart, question]
  )

  const canStart = useMemo(
    () => input.trim().length > 0 && !loadingFlowchart,
    [input, loadingFlowchart]
  )
  const activeStep = flowchartSteps[currentStepIndex]
  const completed = flowchartSteps.length > 0 && currentStepIndex >= flowchartSteps.length
  const activeLinkStep = useMemo(
    () => flowchartSteps.find((step) => step.id === activeLinkCardStepId) ?? null,
    [activeLinkCardStepId, flowchartSteps]
  )
  const showLoadingPlaceholder = loadingFlowchart && flowchartSteps.length === 0

  const startFlowchart = async (message: string) => {
    const trimmed = message.trim()
    if (!trimmed) return

    setQuestion(trimmed)
    setActiveApproach(approach)
    setInput("")
    setFeedback(null)
    setCurrentStepIndex(0)
    setStepLinks({})
    setLinkWarnings({})
    setLinkLoading({})
    setFlowchartWarning(null)
    setActiveLinkCardStepId(null)
    setLoadingFlowchart(true)
    setStreamingFlowchart(false)
    setFlowchartSteps([])
    setSelections({})

    try {
      const response = await requestFlowchart(trimmed, approach, () => setStreamingFlowchart(true))
      const normalizedSteps = attachShuffledOptions(response.steps)
      setFlowchartSteps(normalizedSteps)
      setSelections(createEmptySelections(normalizedSteps))
      setFlowchartWarning(response.warning ?? null)
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unable to reach the AI mentor."
      setFlowchartSteps([])
      setSelections({})
      setFlowchartWarning(messageText)
    } finally {
      setLoadingFlowchart(false)
      setStreamingFlowchart(false)
    }
  }

  const fetchStepLinksForStep = async (step: FlowStep) => {
    if (!question || stepLinks[step.id]?.length || linkLoading[step.id]) return

    setLinkLoading((prev) => ({ ...prev, [step.id]: true }))
    setLinkWarnings((prev) => ({ ...prev, [step.id]: null }))

    try {
      const response = await requestStepLinks(question, step.title, step.description)
      setStepLinks((prev) => ({ ...prev, [step.id]: response.links }))
      setLinkWarnings((prev) => ({ ...prev, [step.id]: response.warning ?? null }))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load links for this step."
      setLinkWarnings((prev) => ({ ...prev, [step.id]: message }))
    } finally {
      setLinkLoading((prev) => ({ ...prev, [step.id]: false }))
    }
  }

  const handleOptionSelect = (option: FlowOption) => {
    if (!activeStep || feedback || loadingFlowchart) return

    if (option.correct) {
      const stepId = activeStep.id
      setSelections((prev) => ({
        ...prev,
        [stepId]: option,
      }))
      setCurrentStepIndex((prev) => Math.min(prev + 1, flowchartSteps.length))
      void fetchStepLinksForStep(activeStep)
    } else {
      setFeedback({
        option,
        stepTitle: activeStep.title,
        reason: option.reason,
      })
    }
  }

  const toggleLinkCard = (stepId: string) =>
    setActiveLinkCardStepId((prev) => (prev === stepId ? null : stepId))

  const handleLinkButtonClick = (step: FlowStep) => {
    toggleLinkCard(step.id)
    void fetchStepLinksForStep(step)
  }

  const approachBadges = {
    naive: {
      label: "Naive",
      helper: "Baseline-first: sketch the simplest path before optimizing.",
    },
    optimized: {
      label: "Optimized",
      helper: "Pattern-first: cut wasted work and highlight efficiency moves.",
    },
  }

  return (
    <div className="h-screen text-mist flex flex-col bg-transparent overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4 border-b border-mist/10 bg-black/40 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-mist">
            🦇<span className="text-pumpkin font-display">Logic</span>
            Hinter
          </h1>
          <p className="text-sm text-mist/80">AI that helps you think "how to code", not copy.</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-32 pb-40">
        <div className="max-w-6xl mx-auto h-full space-y-4">
          {feedback && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="w-full max-w-lg rounded-xl border border-pumpkin/50 bg-midnight/95 px-5 py-3 shadow-lg flex items-center gap-4">

      {/* text */}
      <p className="flex-1 text-sm text-mist/80">
        <span className="font-semibold text-pumpkin">⚠️ Wrong option. </span>
        {feedback.reason}
      </p>

      {/* button */}
      <button
        onClick={() => setFeedback(null)}
        className="rounded-md border border-pumpkin/50 px-3 py-1.5 text-xs font-semibold text-pumpkin hover:bg-pumpkin/10 transition"
      >
        Understood
      </button>

    </div>
  </div>
)}




          <div className="flex flex-col gap-4 min-h-[65vh]">
            {!hasActiveFlow ? (
              <div className="space-y-5 flex-1">
                <div className="flex items-start gap-3 rounded-xl border border-mist/10 bg-midnight/50 p-4 shadow-inner">
                  <div className="space-y-1">
                    <p className="text-sm text-mist/70">
                      Hi, I'm your coding brainstorm buddy. I help you build logic — one decision at a time without providing code.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <LayoutGroup>
                {activeLinkCardStepId && (
                  <div
                    className="fixed inset-0 z-40 flex items-start justify-center bg-black/50 px-4 pt-28 pb-8"
                    onClick={() => setActiveLinkCardStepId(null)}
                  >
                    <div
                      role="dialog"
                      aria-modal
                      className="w-full max-w-2xl max-h-[70vh] overflow-y-auto rounded-2xl border border-toxic/50 bg-midnight/90 p-5 shadow-2xl"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {activeLinkStep && (
                          <p className="text-[11px] uppercase tracking-[0.16em] text-mist/60">{activeLinkStep.title}</p>
                        )}
                        <button
                          type="button"
                          className="rounded-lg border border-mist/20 bg-black/40 px-2 py-1 text-xs text-mist/70 hover:border-mist/40 hover:text-mist"
                          onClick={() => setActiveLinkCardStepId(null)}
                        >
                          Close
                        </button>
                      </div>
                      <div className="mt-4 space-y-3">
                        {linkLoading[activeLinkCardStepId] ? (
                          <p className="text-xs text-mist/70">Gathering Gemini guidance…</p>
                        ) : stepLinks[activeLinkCardStepId]?.length ? (
                          <ul className="list-disc space-y-2 pl-5 text-sm text-mist/90">
                            {stepLinks[activeLinkCardStepId]?.map((link) => (
                              <li key={link.url}>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="break-all text-pumpkin hover:text-pumpkin/80"
                                >
                                  {link.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-mist/60">Links will appear after you select the right move.</p>
                        )}
                        {linkWarnings[activeLinkCardStepId] && (
                          <p className="text-xs text-amber-200">{linkWarnings[activeLinkCardStepId]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_1fr] items-start">
                  <div className="space-y-3 lg:sticky lg:top--60 lg:self-start">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.2em] text-mist/60">Current question</p>
                      <span className="rounded-full border border-pumpkin/50 bg-pumpkin/10 px-3 py-1 text-[11px] font-semibold text-pumpkin">
                        {approachBadges[activeApproach].label}
                      </span>
                    </div>
                    <div className="rounded-xl border border-pumpkin/30 bg-midnight/50 p-4 text-sm min-h-[220px] max-h-[530px] flex flex-col gap-3">
                      <div className="flex-1 overflow-y-auto pr-2">
                        {question ? (
                          <p className="text-mist/90">{question}</p>
                        ) : (
                          <p className="text-mist/70">Loading the prompt…</p>
                        )}
                      </div>
                      <p className="text-[11px] text-mist/60 flex-shrink-0">{approachBadges[activeApproach].helper}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-pumpkin" />
                        <p className="text-xs uppercase tracking-[0.2em] text-mist/60">Flowchart</p>
                      </div>
                      {loadingFlowchart && (
                        <p className="text-[11px] text-toxic/80">
                          {streamingFlowchart ? "Streaming the logic…" : "Loading the logic…"}
                        </p>
                      )}
                    </div>
                    {flowchartWarning && (
                      <div className="text-[11px] text-amber-200 bg-amber-500/10 border border-amber-500/40 rounded-lg px-3 py-2">
                        {flowchartWarning}
                      </div>
                    )}
                    <div className="rounded-xl border border-mist/10 bg-midnight/40 p-4 shadow-inner">
                      <div className="space-y-3 max-h-[530px] overflow-y-auto pr-2">
                        {flowchartSteps.length === 0 ? (
                          <p className="text-xs text-mist/60 italic">Your tailored flowchart will appear here after you start.</p>
                        ) : (
                          flowchartSteps.map((step, index) => {
                            const selectedOption = selections[step.id]
                            return (
                              <div
                                key={step.id}
                                className="relative rounded-xl border border-mist/10 bg-midnight/50 p-4 shadow-inner"
                              >
                                {index < flowchartSteps.length - 1 && (
                                  <div className="absolute left-[18px] top-[48px] bottom-[-18px] w-[2px] bg-pumpkin/40" />
                                )}
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full border border-pumpkin/60 bg-pumpkin/10 text-center leading-10 font-semibold text-pumpkin">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-mist">{step.title}</p>
                                    <p className="text-xs text-mist/60">{step.description}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  {selectedOption ? (
                                    <div className="space-y-3">
                                      <motion.div
                                        layoutId={`${step.id}-${selectedOption.id}`}
                                        className="rounded-lg border border-pumpkin/60 bg-pumpkin/10 px-3 py-2 text-sm text-pumpkin"
                                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                                      >
                                        {selectedOption.label}
                                      </motion.div>
                                      <div className="space-y-2">
                                        <button
                                          type="button"
                                          onClick={() => handleLinkButtonClick(step)}
                                          className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition ${
                                            activeLinkCardStepId === step.id
                                              ? "text-toxic"
                                              : "text-mist/60 hover:text-mist/80"
                                          }`}
                                        >
                                          <span className="h-1.5 w-1.5 rounded-full bg-toxic" />
                                          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-toxic/60 bg-toxic/10 text-toxic shadow-sm">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              className="h-4 w-4"
                                              aria-hidden
                                            >
                                              <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10 5" />
                                              <path d="M14 11a5 5 0 0 0-7.07 0L4.8 13.14a5 5 0 1 0 7.07 7.07L14 19" />
                                            </svg>
                                          </span>
                                          <span className="sr-only">Toggle step links</span>
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-mist/60 italic">Waiting for your pick...</p>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 lg:sticky lg:top--60 lg:self-start">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-toxic" />
                        <p className="text-xs uppercase tracking-[0.2em] text-mist/60">Choose next block</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-toxic/40 bg-midnight/50 p-4 space-y-3 min-h-[240px]">
                      {completed ? (
                        <div className="space-y-2">
                          <p className="font-semibold text-mist">Flowchart locked in.</p>
                          <p className="text-sm text-mist/70">You placed every block. Paste another question to walk through the flow again.</p>
                        </div>
                      ) : showLoadingPlaceholder ? (
                        <div className="space-y-2">
                          <p className="font-semibold text-mist">Assembling decisions…</p>
                          <p className="text-sm text-mist/70">Loading the logic for this question.</p>
                        </div>
                      ) : (
                        activeStep && (
                          <>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-mist">{activeStep.title}</p>
                              <p className="text-xs text-mist/60">
                                Step {Math.min(currentStepIndex + 1, flowchartSteps.length)} of {flowchartSteps.length || "?"}
                              </p>
                            </div>
                            <p className="text-sm text-mist/70">{activeStep.description}</p>
                            <div className="grid gap-2">
                              {activeStep.options.map((option) => (
                                <motion.button
                                  key={`${activeStep.id}-${option.id}`}
                                  layoutId={`${activeStep.id}-${option.id}`}
                                  whileHover={{ scale: feedback ? 1 : 1.01 }}
                                  whileTap={{ scale: feedback ? 1 : 0.99 }}
                                  className="text-left rounded-lg border border-mist/10 bg-midnight/50 px-3 py-3 text-sm text-mist hover:border-pumpkin/60 hover:text-pumpkin transition"
                                  onClick={() => handleOptionSelect(option)}
                                  disabled={!!feedback}
                                >
                                  {option.label}
                                </motion.button>
                              ))}
                            </div>
                          </>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </LayoutGroup>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 py-3">
        <div className="max-w-6xl mx-auto px-6 py-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-mist/60">APPROACH:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(approachBadges).map(([id, details]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setApproach(id as "naive" | "optimized")}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      approach === id
                        ? "border-pumpkin/60 bg-pumpkin/15 text-pumpkin shadow-[0_0_0_1px_rgba(255,122,0,0.2)]"
                        : "border-mist/20 bg-midnight/50 text-mist/70 hover:border-pumpkin/40 hover:text-pumpkin"
                    }`}
                  >
                    {details.label}
                  </button>
                ))}
              </div>
            </div>
            
          </div>

          <div className="p-2 border border-mist/40 rounded-2xl">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-sm text-mist placeholder:text-mist/40 outline-none"
                placeholder="Paste a coding question."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    void startFlowchart(input)
                  }
                  
                }}
                
              />
              

              <div className="flex items-center gap-2 pr-1.5">
                <MicButton
                  onTranscript={(text) => {
                    setInput(text)
                    void startFlowchart(text)
                  }}
                />

                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-pumpkin/80 text-midnight shadow-lg shadow-pumpkin/20 transition hover:bg-pumpkin focus:outline-none focus:ring-2 focus:ring-pumpkin/50 focus:ring-offset-2 focus:ring-offset-midnight disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!canStart}
                  onClick={() => void startFlowchart(input)}
                  aria-label="Send question"
                >
                  {loadingFlowchart ? (
                    <span className="text-base">⏳</span>
                  ) : (
                    <svg
                      aria-hidden
                      focusable="false"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.75 3.75L20.25 11.25L4.75 18.75L7.75 11.25L4.75 3.75Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.75 11.25H20.25"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>  
            </div> 
          </div>
          <p className="mt-2 text-center text-[11px] tracking-[0.25em] text-mist/60">
      powered by KIRO
    </p>
        </div>
      </div>
    </div>
  )
} 