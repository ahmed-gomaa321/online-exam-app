import ExamsList from "./_components/exams-list";

type ExamDiplomaProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExamsDiploma({ params }: ExamDiplomaProps) {
  const { id } = await params;

  return <ExamsList id={id} />;
}
