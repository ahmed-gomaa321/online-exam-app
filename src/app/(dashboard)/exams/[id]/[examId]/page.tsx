import QuestionsDetails from "./_components/questions-details";

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function QuestionsExam({ params }: PageProps) {
  const resolvedParams = await params;
  const examId = resolvedParams.examId;
  return <QuestionsDetails examId={examId} />;
}
