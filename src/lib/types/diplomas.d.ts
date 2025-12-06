export interface Diploma {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface DiplomasResponse {
  message: string;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  subjects: Diploma[];
}
