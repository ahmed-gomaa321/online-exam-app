"use client";

import {
  CircleQuestionMark,
  GraduationCap,
  BookOpenCheck,
  UserRound,
} from "lucide-react";
import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";
import { ROUTES } from "@/lib/constants/routes";
import { usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";

export interface HeaderTitleType {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function useHeaderTitle(): HeaderTitleType {
  const pathname = usePathname();
  const { examName } = useContext(ExamNameContext);
  const parts = pathname.split("/").filter(Boolean);

  const [header, setHeader] = useState<HeaderTitleType>({
    title: "",
    icon: CircleQuestionMark,
  });

  const headerMap: Record<string, HeaderTitleType> = {
    [ROUTES.DASHBOARD]: { title: "Diplomas", icon: GraduationCap },
    [ROUTES.ACCOUNT_SETTINGS]: { title: "Account Settings", icon: UserRound },
    [ROUTES.EXAMS]: { title: "Exams", icon: BookOpenCheck },
  };

  useEffect(() => {
    if (!pathname) return;

    if (headerMap[pathname]) {
      setHeader(headerMap[pathname]);
      return;
    }

    if (parts[0] === "exams" && parts[1]) {
      setHeader({
        title: examName ? `[${examName}] Questions` : "Questions",
        icon: CircleQuestionMark,
      });
      return;
    }
  }, [pathname, examName]);

  return header;
}
