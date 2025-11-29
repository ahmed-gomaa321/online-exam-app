import AuthAside from "../_components/auth-aside";
import RegisterForm from "./_components/register-form";

export default function RegisterPage() {
  return (
    <section className="lg:grid lg:grid-cols-2">
      <AuthAside />
      <div className="overflow-y-auto py-12 max-h-screen flex items-center justify-center">
        <RegisterForm />
      </div>
    </section>
  );
}
