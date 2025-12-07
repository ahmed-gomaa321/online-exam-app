import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="absolute px-4 w-full h-full flex justify-center items-center">
      <Loader className="animate-spin" size={40} />
    </div>
  );
}
