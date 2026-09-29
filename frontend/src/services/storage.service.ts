import { STORAGE_KEYS } from "../config/constants";
import type { StoredUser } from "../types/auth";
import type { ChargeResponse } from "../types/snailpay";

const parseStoredValue = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const storageService = {
  getUser: (): StoredUser | null =>
    parseStoredValue<StoredUser>(STORAGE_KEYS.user),

  saveUser: (user: StoredUser): void => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },

  getSession: (): string | null => localStorage.getItem(STORAGE_KEYS.session),

  saveSession: (userId: string): void => {
    localStorage.setItem(STORAGE_KEYS.session, userId);
  },

  clearSession: (): void => {
    localStorage.removeItem(STORAGE_KEYS.session);
  },

  saveTransaction: (transaction: ChargeResponse): void => {
    const transactions =
      parseStoredValue<ChargeResponse[]>(STORAGE_KEYS.transactions) ?? [];
    localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify([...transactions, transaction]),
    );
  },
};
