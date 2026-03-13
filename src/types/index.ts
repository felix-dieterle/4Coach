export interface UserGoal {
  id: string;
  title: string;
  description: string;
  targetDate?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  date: string;
  topic: string;
  newsAudio?: AudioContent;
  learningAudio?: AudioContent;
  questions: Question[];
  homework: Homework;
  completed: boolean;
}

export interface AudioContent {
  id: string;
  title: string;
  text: string;
  audioUri?: string;
}

export interface Question {
  id: string;
  text: string;
  answer?: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Homework {
  id: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedAt?: string;
  isAchieved: boolean;
}

export interface AppState {
  userGoal: UserGoal | null;
  sessions: Session[];
  milestones: Milestone[];
  currentSession: Session | null;
  isLoading: boolean;
}
