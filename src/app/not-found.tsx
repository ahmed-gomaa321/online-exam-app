import Image from "next/image";
import notFoundImage from "../../public/assets/images/404-not-found.webp";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
export default function NotFound() {
  return (
    <section className="h-screen flex justify-center items-center bg-blue-50">
      <figure className="relative w-full md:w-1/2 h-3/4">
        <Image
          quality={100}
          src={notFoundImage}
          alt="404"
          fill
          sizes="100%"
          className="object-contain"
        ></Image>
        <Link
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xl text-blue-800 hover:text-blue-900 transition duration-300 active:scale-90 font-bold"
          href={ROUTES.DASHBOARD}
        >
          Back to Home
        </Link>
      </figure>
    </section>
  );
}
