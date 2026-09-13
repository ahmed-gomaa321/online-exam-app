export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  examId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
}

export interface QuestionsPayload {
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  correct?: string;
}
