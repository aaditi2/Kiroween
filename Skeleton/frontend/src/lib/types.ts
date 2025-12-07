/**
 * Common TypeScript interfaces used across skeleton apps.
 * These match the Pydantic models from the backend.
 */

export interface FlowOption {
  id: string;
  label: string;
  reason: string;
  correct: boolean;
}

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  options: FlowOption[];
}

export interface FlowchartRequest {
  problem: string;
  [key: string]: any; // Allow additional app-specific fields
}

export interface FlowchartResponse {
  steps: FlowStep[];
  warning?: string | null;
}

export interface StepLink {
  title: string;
  url: string;
  summary: string;
}

export interface StepLinkRequest {
  problem: string;
  step_title: string;
  step_description: string;
}

export interface StepLinkResponse {
  links: StepLink[];
  warning?: string | null;
}

export interface BaseApiResponse {
  warning?: string | null;
  metadata?: Record<string, any> | null;
}

// Common app state interfaces
export interface AppState {
  isLoading: boolean;
  error: string | null;
  currentStep: number;
  score: number;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}