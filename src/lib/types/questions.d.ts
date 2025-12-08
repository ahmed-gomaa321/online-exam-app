export interface QuestionAnswer {
  answer: string;
  key: string;
}

export interface UserAnswer {
  questionId: string;
  correct: string;
}

export interface ExamInfo {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: boolean;
  createdAt: string;
}

export interface Question {
  _id: string;
  question: string;
  answers: QuestionAnswer[];
  type: "single_choice" | string;
  correct: string;
  subject: string | null;
  exam: ExamInfo;
  createdAt: string;
}

export interface QuestionsResponse {
  message: string;
  questions: Question[];
}
