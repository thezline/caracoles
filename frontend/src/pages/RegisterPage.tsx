import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { FeedbackMessage } from "../components/FeedbackMessage";
import { FormField } from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import type { FieldErrors } from "../types/forms";

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const initialForm: RegisterForm = {
  fullName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const validate = (form: RegisterForm): FieldErrors<RegisterForm> => {
  const errors: FieldErrors<RegisterForm> = {};
  if (form.fullName.trim().length < 3)
    errors.fullName = "Ingresa tu nombre completo.";
  if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Ingresa un correo válido.";
  if (form.password.length < 8) errors.password = "Usa al menos 8 caracteres.";
  else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
    errors.password = "Incluye letras y al menos un número.";
  if (form.passwordConfirmation !== form.password)
    errors.passwordConfirmation = "Las contraseñas no coinciden.";
  return errors;
};

export const RegisterPage = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors<RegisterForm>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible crear la cuenta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Primera vuelta"
      title="Crea tu cuenta"
      description="Tus datos y tu saldo permanecerán guardados en este dispositivo."
      footer={
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="full-name"
          label="Nombre completo"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          autoComplete="name"
          placeholder="Tu nombre"
          error={errors.fullName}
          disabled={isSubmitting}
        />
        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
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
          onChange={(event) => updateField("password", event.target.value)}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          hint="Incluye letras y al menos un número."
          error={errors.password}
          disabled={isSubmitting}
        />
        <FormField
          id="password-confirmation"
          label="Confirmar contraseña"
          type="password"
          value={form.passwordConfirmation}
          onChange={(event) =>
            updateField("passwordConfirmation", event.target.value)
          }
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          error={errors.passwordConfirmation}
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
              <LoaderCircle className="spin" size={18} /> Creando cuenta
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
