import NextAuthProvider from "./components/nextauth.provider";
import ReactQueryProvider from "./components/react-query.provider";

type AppProvidersProps = {
  children: React.ReactNode;
};
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <NextAuthProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </NextAuthProvider>
  );
}
