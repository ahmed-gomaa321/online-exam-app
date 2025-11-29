import Image from "next/image";
import logo from "@/../public/assets/images/logo.svg";
import styles from "./auth-aside.module.css";
import { BookOpenCheck, Brain, RectangleEllipsis } from "lucide-react";

export default function AuthAside() {
  const list = [
    {
      icon: <Brain className="text-blue-600" />,
      title: "Tailored Diplomas",
      description:
        "Choose from specialized tracks like Frontend, Backend, and Mobile Development.",
    },
    {
      icon: <BookOpenCheck className="text-blue-600" />,
      title: "Focused Exams",
      description:
        "Access topic-specific tests including HTML, CSS, JavaScript, and more.",
    },
    {
      icon: <RectangleEllipsis className="text-blue-600" />,
      title: "Smart Multi-Step Forms",
      description:
        "Choose from specialized tracks like Frontend, Backend, and Mobile Development.",
    },
  ];
  return (
    <section
      className={`hidden lg:block py-20 px-16 xl:px-32 relative h-screen ${styles.circles} overflow-hidden`}
    >
      {/* Backdrop blur */}
      <div className={`${styles["backdrop-blur"]}`}></div>
      <div className="flex items-center gap-2 mb-11 md:mb-16">
        <figure>
          <Image src={logo} alt="logo"></Image>
        </figure>
        <h3 className="text-blue-600 font-semibold text-xl">Exam App</h3>
      </div>
      <h2 className="text-2xl xl:text-3xl text-gray-800 font-bold font-inter">
        Empower your learning journey with our smart exam platform.
      </h2>
      <div className="mt-10 space-y-4">
        {list.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <span className="border border-blue-600 p-1">{item.icon}</span>
            <div className="2xl:pe-16">
              <h4 className="text-blue-600 font-semibold">{item.title}</h4>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
