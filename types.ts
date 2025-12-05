export type Tab = 'explore' | 'journey' | 'action';

export interface QuizAnswer {
  questionId: number;
  scenario: string;
  selectedOption: string;
  category: 'social' | 'focus' | 'coping';
}

export interface Archetype {
  name: string;
  description: string;
  suggestedSports: string[];
  neurochemistry: string; // "Dopamine focus", "Serotonin boost", etc.
}

export type StepStatus = 'locked' | 'current' | 'completed' | 'skipped';

export interface JourneyStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  type: 'equipment' | 'location' | 'trigger' | 'micro-goal';
}

export interface Journey {
  sport: string;
  steps: JourneyStep[];
}

export interface ScheduledSession {
  id: string;
  date: Date;
  completed: boolean;
}
