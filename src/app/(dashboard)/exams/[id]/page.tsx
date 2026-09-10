import ExamsList from "../_components/exams-list";

interface PageProps {
  params: Promise<{
    id: string; //
  }>;
}

export default async function ExamsDiploma({ params }: PageProps) {
  const resolvedParams = await params;


  const id = resolvedParams.id;

  return <ExamsList id={id} />;
}
