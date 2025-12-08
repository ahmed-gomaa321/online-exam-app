import React from "react";
import QuestionsDetails from "./_components/questions-details";

type ExameNameProps = {
  params: {
    id: string;
  };
};

export default function ExameQuestions({ params: { id } }: ExameNameProps) {
  return <QuestionsDetails examId={id} />;
}
