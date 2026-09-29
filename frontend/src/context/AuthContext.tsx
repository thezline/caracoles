import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { storageService } from "../services/storage.service";
import type {
  LoginInput,
  RegisterInput,
  StoredUser,
  User,
} from "../types/auth";
import { createSalt, hashPassword } from "../utils/crypto";

interface AuthContextValue {
  user: User | null;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  addBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const toPublicUser = ({
  passwordHash: _hash,
  passwordSalt: _salt,
  ...user
}: StoredUser): User => user;

const getInitialUser = (): User | null => {
  const storedUser = storageService.getUser();
  const sessionId = storageService.getSession();
  return storedUser && storedUser.id === sessionId
    ? toPublicUser(storedUser)
    : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);

  const register = useCallback(async (input: RegisterInput): Promise<void> => {
    const existingUser = storageService.getUser();
    if (existingUser)
      throw new Error("Ya existe una cuenta registrada en este dispositivo.");

    const passwordSalt = createSalt();
    const storedUser: StoredUser = {
      id: crypto.randomUUID(),
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      balance: 0,
      passwordSalt,
      passwordHash: await hashPassword(input.password, passwordSalt),
    };

    storageService.saveUser(storedUser);
    storageService.saveSession(storedUser.id);
    setUser(toPublicUser(storedUser));
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<void> => {
    const storedUser = storageService.getUser();
    if (!storedUser)
      throw new Error("No hay una cuenta registrada en este dispositivo.");

    const passwordHash = await hashPassword(
      input.password,
      storedUser.passwordSalt,
    );
    const emailMatches = input.email.trim().toLowerCase() === storedUser.email;

    if (!emailMatches || passwordHash !== storedUser.passwordHash) {
      throw new Error("El correo o la contraseña son incorrectos.");
    }

    storageService.saveSession(storedUser.id);
    setUser(toPublicUser(storedUser));
  }, []);

  const logout = useCallback(() => {
    storageService.clearSession();
    setUser(null);
  }, []);

  const addBalance = useCallback((amount: number) => {
    const storedUser = storageService.getUser();
    if (!storedUser) return;

    const updatedUser = { ...storedUser, balance: storedUser.balance + amount };
    storageService.saveUser(updatedUser);
    setUser(toPublicUser(updatedUser));
  }, []);

  const value = useMemo(
    () => ({ user, register, login, logout, addBalance }),
    [user, register, login, logout, addBalance],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  return context;
};
