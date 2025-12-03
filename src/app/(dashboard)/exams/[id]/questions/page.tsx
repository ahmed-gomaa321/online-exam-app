export default function Questions({ params }: { params: { id: string } }) {
  return <div className="bg-white p-6">Questions {params.id}</div>;
}
