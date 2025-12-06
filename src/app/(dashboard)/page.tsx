import { Suspense } from "react";
import Diplomas from "./_components/diplomas";
import Loading from "./loading";

export default function Home() {
  return (
    <Suspense fallback={Loading()}>
      <Diplomas />
    </Suspense>
  );
}
