import { ExamNameProvider } from "./components/exam-name-context";
import NextAuthProvider from "./components/nextauth.provider";
import ReactQueryProvider from "./components/react-query.provider";

type AppProvidersProps = {
  children: React.ReactNode;
};
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <NextAuthProvider>
      <ExamNameProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </ExamNameProvider>
    </NextAuthProvider>
  );
}
