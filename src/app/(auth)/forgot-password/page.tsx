import AuthAside from "../_components/auth-aside";
import ForgotPasswordForm from "./_components/forgot-password-form";

export default function ForgotPassword() {
  return (
    <section className="lg:grid lg:grid-cols-2">
      <AuthAside />
      <div className="lg:py-12 h-screen flex items-center justify-center">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
