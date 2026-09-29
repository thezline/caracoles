import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { FeedbackMessage } from "../components/FeedbackMessage";
import { FormField } from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import type { FieldErrors } from "../types/forms";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<LoginForm>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors<LoginForm> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      nextErrors.email = "Ingresa un correo válido.";
    if (!form.password) nextErrors.password = "Ingresa tu contraseña.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Bienvenido de vuelta"
      title="Inicia sesión"
      description="Accede a tu tablero y consulta los resultados del día."
      footer={
        <p>
          ¿Aún no tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(event) => {
            setForm({ ...form, email: event.target.value });
            setErrors({ ...errors, email: undefined });
          }}
          autoComplete="email"
          placeholder="nombre@correo.com"
          error={errors.email}
          disabled={isSubmitting}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={(event) => {
            setForm({ ...form, password: event.target.value });
            setErrors({ ...errors, password: undefined });
          }}
          autoComplete="current-password"
          placeholder="Tu contraseña"
          error={errors.password}
          disabled={isSubmitting}
        />
        {submitError && <FeedbackMessage type="error" message={submitError} />}
        <button
          className="button button--primary button--full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="spin" size={18} /> Ingresando
            </>
          ) : (
            "Ingresar"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
