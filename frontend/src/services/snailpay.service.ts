import { API_URL } from "../config/constants";
import type { ChargeInput, ChargeResponse } from "../types/snailpay";

interface ApiErrorBody {
  message?: string;
}

const isChargeResponse = (value: unknown): value is ChargeResponse => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" && typeof candidate.status === "string"
  );
};

export const createCharge = async (
  input: ChargeInput,
): Promise<ChargeResponse> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/snailpay/charges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      "No pudimos conectar con SnailPay. Verifica que el servicio esté disponible.",
    );
  }

  const body: unknown = await response.json().catch(() => null);

  if (isChargeResponse(body)) return body;

  const errorBody = body as ApiErrorBody | null;
  throw new Error(
    errorBody?.message ?? "SnailPay no pudo procesar la solicitud.",
  );
};
