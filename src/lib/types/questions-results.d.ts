import { UserAnswer } from "./questions";

export interface QuestionReport {
  QID: string;
  Question: string;
  inCorrectAnswer?: string;
  correctAnswer: string;
  answers: Record<string, never>;
}
export interface ExamResult {
  message: string;
  correct: number;
  wrong: number;
  total: string;
  WrongQuestions: QuestionReport[];
  correctQuestions: QuestionReport[];
}

export interface SubmitExamRequest {
  answers: UserAnswer[];
  time: number;
}
