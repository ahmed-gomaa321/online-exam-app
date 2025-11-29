import Image from "next/image";
import notFoundImage from "../../public/assets/images/404-not-found.webp";
export default function NotFound() {
  return (
    <section className="h-screen flex justify-center items-center">
      <figure className="relative w-full md:w-1/2 h-3/4">
        <Image
          src={notFoundImage}
          alt="404"
          fill
          className="object-contain"
        ></Image>
      </figure>
    </section>
  );
}
