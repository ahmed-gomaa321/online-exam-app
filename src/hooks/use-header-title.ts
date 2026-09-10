"use client";

import {
  GraduationCap,
  BookOpenCheck,
  UserRound,
  CircleQuestionMark,
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
  const { examName, diplomaName } = useContext(ExamNameContext);
  const parts = pathname.split("/").filter(Boolean);

  const [header, setHeader] = useState<HeaderTitleType>({
    title: "Diplomas",
    icon: GraduationCap,
  });

  const headerMap: Record<string, HeaderTitleType> = {
    [ROUTES.DASHBOARD]: { title: "Diplomas", icon: GraduationCap },
    [ROUTES.ACCOUNT_SETTINGS]: { title: "Account Settings", icon: UserRound },
    [ROUTES.PROFILE]: { title: "Account Settings", icon: UserRound },
    [ROUTES.CHANGE_PASSWORD]: { title: "Account Settings", icon: UserRound },
  };

  useEffect(() => {
    if (!pathname) return;

    if (headerMap[pathname]) {
      setHeader(headerMap[pathname]);
      return;
    }

    if (
      parts[0] === "exams" &&
      (parts.length >= 3 || parts.includes("questions"))
    ) {
      setHeader({
        title: examName ? `${examName} Questions` : "Questions",
        icon: CircleQuestionMark,
      });
      return;
    }

    if (parts[0] === "exams" && parts[1]) {
      setHeader({
        title: diplomaName ? `${diplomaName} Exams` : "Exams",
        icon: BookOpenCheck,
      });
      return;
    }

    setHeader({
      title: "Dashboard",
      icon: GraduationCap,
    });
  }, [pathname, examName, diplomaName]);

  return header;
}
