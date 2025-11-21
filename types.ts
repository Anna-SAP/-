export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
}

export interface AnalysisResult {
  headline: string;
  subheadline: string;
  core_concept: {
    principle: string;
    explanation: string;
  };
  emotional_atmosphere: {
    keywords: string[];
    description: string;
  };
  structural_analysis: string[];
  metaphor: string;
  narrative_arc: string;
  scenarios: {
    title: string;
    description: string;
  }[];
  counter_perspective: string;
  visual_suggestions: string[];
  input_translation?: string | null; // Translation for non-Chinese inputs
}

export interface UserInput {
  text: string;
  image: File | null;
  imageUrl: string | null; // Preview URL
  videoLink: string;
}