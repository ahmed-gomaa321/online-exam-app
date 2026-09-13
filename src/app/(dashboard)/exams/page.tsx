import { ROUTES } from "@/lib/constants/routes";
import { redirect } from "next/navigation";

export default async function ExamsDiploma() {
  redirect(ROUTES.DASHBOARD);
}
