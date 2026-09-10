export interface Exam {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  createdAt: string;
  questionsCount: number;
}

export interface DiplomaDetails {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  exams: Exam[];
}

export interface DiplomaDetailsPayload {
  diploma: DiplomaDetails;
}
