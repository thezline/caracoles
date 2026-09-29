import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, LockKeyhole, X } from "lucide-react";
import { createCharge } from "../services/snailpay.service";
import { storageService } from "../services/storage.service";
import type { User } from "../types/auth";
import type { FieldErrors } from "../types/forms";
import type { ChargeStatus } from "../types/snailpay";
import {
  formatCardNumber,
  formatCurrency,
  formatExpiration,
} from "../utils/format";
import { FeedbackMessage } from "./FeedbackMessage";
import { FormField } from "./FormField";

interface BalanceModalProps {
  user: User;
  onClose: () => void;
  onApproved: (amount: number) => void;
}

interface ChargeForm {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
  amount: string;
}

interface ResultState {
  status: ChargeStatus;
  message: string;
}

const initialForm: ChargeForm = {
  cardNumber: "",
  expirationDate: "",
  cvv: "",
  cardholderName: "",
  amount: "",
};

const validate = (form: ChargeForm): FieldErrors<ChargeForm> => {
  const errors: FieldErrors<ChargeForm> = {};
  const cardDigits = form.cardNumber.replace(/\s/g, "");
  const amount = Number(form.amount);

  if (!/^\d{16}$/.test(cardDigits))
    errors.cardNumber = "Ingresa los 16 dígitos de la tarjeta.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expirationDate))
    errors.expirationDate = "Usa el formato MM/AA.";
  if (!/^\d{3}$/.test(form.cvv)) errors.cvv = "Ingresa los 3 dígitos.";
  if (form.cardholderName.trim().length < 2)
    errors.cardholderName = "Ingresa el nombre del titular.";
  if (!Number.isFinite(amount) || amount <= 0)
    errors.amount = "Ingresa un monto mayor a 0.";
  else if (amount > 100000) errors.amount = "El monto máximo es $100,000.";

  return errors;
};

export const BalanceModal = ({
  user,
  onClose,
  onApproved,
}: BalanceModalProps) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors<ChargeForm>>({});
  const [result, setResult] = useState<ResultState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isSubmitting, onClose]);

  const updateField = (field: keyof ChargeForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setResult(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const transaction = await createCharge({
        card_number: form.cardNumber.replace(/\s/g, ""),
        expiration_date: form.expirationDate,
        cvv: form.cvv,
        cardholder_name: form.cardholderName.trim(),
        transaction_amount: Number(form.amount),
        payer_id: user.id,
        payer_email: user.email,
      });
      storageService.saveTransaction(transaction);

      if (transaction.status === "approved") {
        onApproved(transaction.transaction_amount);
        setResult({
          status: "approved",
          message: `${formatCurrency(transaction.transaction_amount)} fueron acreditados a tu saldo.`,
        });
        setForm(initialForm);
      } else if (transaction.status === "rejected") {
        setResult({
          status: "rejected",
          message:
            "La operación fue rechazada. Revisa los datos de la tarjeta e intenta de nuevo.",
        });
      } else {
        setResult({
          status: "error",
          message:
            "SnailPay no está disponible en este momento. Tu saldo no fue modificado.",
        });
      }
    } catch (error) {
      setResult({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "No fue posible procesar la recarga.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSubmitting && onClose()
      }
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="balance-title"
      >
        <header className="modal__header">
          <div>
            <span className="eyebrow">SnailPay</span>
            <h2 id="balance-title">Cargar saldo</h2>
            <p>Tu saldo se actualizará al confirmar la operación.</p>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </header>

        <form className="charge-form" onSubmit={handleSubmit} noValidate>
          <FormField
            id="card-number"
            label="Número de tarjeta"
            value={form.cardNumber}
            onChange={(event) =>
              updateField("cardNumber", formatCardNumber(event.target.value))
            }
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
            error={errors.cardNumber}
            disabled={isSubmitting}
          />
          <div className="form-row form-row--split">
            <FormField
              id="expiration"
              label="Vencimiento"
              value={form.expirationDate}
              onChange={(event) =>
                updateField(
                  "expirationDate",
                  formatExpiration(event.target.value),
                )
              }
              placeholder="MM/AA"
              inputMode="numeric"
              autoComplete="cc-exp"
              error={errors.expirationDate}
              disabled={isSubmitting}
            />
            <FormField
              id="cvv"
              label="CVV"
              type="password"
              value={form.cvv}
              onChange={(event) =>
                updateField(
                  "cvv",
                  event.target.value.replace(/\D/g, "").slice(0, 3),
                )
              }
              placeholder="000"
              inputMode="numeric"
              autoComplete="cc-csc"
              error={errors.cvv}
              disabled={isSubmitting}
            />
          </div>
          <FormField
            id="cardholder-name"
            label="Nombre completo"
            value={form.cardholderName}
            onChange={(event) =>
              updateField("cardholderName", event.target.value)
            }
            placeholder="Como aparece en la tarjeta"
            autoComplete="cc-name"
            error={errors.cardholderName}
            disabled={isSubmitting}
          />
          <FormField
            id="amount"
            label="Monto a cargar"
            type="number"
            value={form.amount}
            onChange={(event) => updateField("amount", event.target.value)}
            placeholder="0.00"
            inputMode="decimal"
            min="0.01"
            max="100000"
            step="0.01"
            error={errors.amount}
            disabled={isSubmitting}
          />

          {result && (
            <FeedbackMessage
              type={result.status === "approved" ? "success" : "error"}
              message={result.message}
            />
          )}

          <button
            className="button button--primary button--full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="spin" size={18} /> Procesando
              </>
            ) : (
              "Confirmar carga"
            )}
          </button>
          <p className="secure-note">
            <LockKeyhole size={14} /> Operación simulada. No se realiza ningún
            cobro real.
          </p>
        </form>
      </section>
    </div>
  );
};
