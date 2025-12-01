const codeSignals = [/```/g, /function\s+/, /class\s+/, /#include/, /public\s+static/];

export function scrubPossibleCode(text: string): string {
  return codeSignals.reduce((cleaned, pattern) => cleaned.replace(pattern, "[code blocked]"), text);
}

export function mentorPromptGuard(prompt: string): { sanitized: string; warning?: string } {
  const containsCode = codeSignals.some((pattern) => pattern.test(prompt));
  const sanitized = scrubPossibleCode(prompt);
  return {
    sanitized,
    warning: containsCode
      ? "We stripped code-like content to keep the mentor hint-only."
      : undefined,
  };
}
