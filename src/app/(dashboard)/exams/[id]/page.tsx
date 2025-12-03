import React from "react";

type ExameNameProps = {
  params: {
    id: string;
  };
};

export default function page({ params: { id } }: ExameNameProps) {
  return <div>Exame {id}</div>;
}
