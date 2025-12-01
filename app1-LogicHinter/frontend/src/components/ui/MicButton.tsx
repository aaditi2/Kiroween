import { useEffect, useState } from "react";

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

export function MicButton({ onTranscript }: MicButtonProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    // Detect browser support without invoking window in SSR contexts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(Boolean(SpeechRecognition));
  }, []);

  const handleListen = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };
    recognition.onend = () => setListening(false);
  };

  return (
    <button
      type="button"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white/5 text-mist transition focus:outline-none focus:ring-2 focus:ring-pumpkin/50 focus:ring-offset-2 focus:ring-offset-midnight disabled:cursor-not-allowed disabled:opacity-50 ${
        listening
          ? "border-pumpkin/60 bg-pumpkin/10 text-pumpkin shadow-[0_0_0_1px_rgba(255,156,102,0.25)]"
          : "border-mist/20 hover:border-pumpkin/60 hover:text-pumpkin"
      }`}
      onClick={handleListen}
      disabled={!supported}
      title={supported ? "Start voice capture" : "Speech API not available"}
      aria-label={supported ? "Start voice capture" : "Speech API not available"}
    >
      {supported ? (
        <svg
          aria-hidden
          focusable="false"
          className={listening ? "h-5 w-5 animate-pulse" : "h-5 w-5"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M18 10.5V12C18 14.7614 15.7614 17 13 17H11C8.23858 17 6 14.7614 6 12V10.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 17V21"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M9.5 21H14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <span className="text-xs">🚫</span>
      )}
    </button>
  );
}
