import React from "react";

type ExameNameProps = {
  params: {
    id: string;
  };
};

export default function ExameQuestions({ params: { id } }: ExameNameProps) {
  return <div>Exame {id}</div>;
}
