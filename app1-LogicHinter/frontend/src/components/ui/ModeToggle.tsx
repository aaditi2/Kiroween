interface ModeToggleProps {
  mode: "kid" | "normal" | "interviewer";
  onChange: (mode: "kid" | "normal" | "interviewer") => void;
}

const modes = [
  { id: "kid", label: "Explain like I'm 10" },
  { id: "normal", label: "Explain normally" },
  { id: "interviewer", label: "Explain like interviewer" },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((option) => (
        <button
          key={option.id}
          className={`button-ghost rounded-full px-4 py-2 text-sm transition hover:-translate-y-0.5 ${
            mode === option.id ? "border-pumpkin/80 bg-pumpkin/20" : ""
          }`}
          onClick={() => onChange(option.id as ModeToggleProps["mode"])}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
