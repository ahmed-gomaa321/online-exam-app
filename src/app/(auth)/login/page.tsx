import AuthAside from "../_components/auth-aside";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <section className="lg:grid lg:grid-cols-2">
      <AuthAside />
      <LoginForm />
    </section>
  );
}
