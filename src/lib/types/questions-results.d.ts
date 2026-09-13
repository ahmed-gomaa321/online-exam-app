export interface AnswerDetail {
  id: string;
  text: string;
}

export interface QuestionAnalytic {
  questionId: string;
  questionText: string;
  selectedAnswer: AnswerDetail | null;
  isCorrect: boolean;
  correctAnswer: AnswerDetail;
}

export interface SubmissionData {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  submittedAt: string;
}

export interface ExamResultPayload {
  submission: SubmissionData;
  analytics: QuestionAnalytic[];
}

// Request Data
export interface UserAnswerRequest {
  questionId: string;
  answerId: string;
}

export interface SubmitExamRequest {
  examId: string;
  answers: UserAnswerRequest[];
  startedAt: string;
}
