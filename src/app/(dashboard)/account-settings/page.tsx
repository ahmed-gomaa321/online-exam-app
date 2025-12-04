import { ROUTES } from "@/lib/constants/routes";
import { redirect } from "next/navigation";

export default function AccountSettings() {
  return redirect(ROUTES.PROFILE);
}
