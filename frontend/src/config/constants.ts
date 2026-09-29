export const STORAGE_KEYS = {
  user: "pista-lenta:user",
  session: "pista-lenta:session",
  transactions: "pista-lenta:transactions",
} as const;

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export const BET_RESULTS = [
  { name: "Ganadas", value: 7 },
  { name: "Perdidas", value: 5 },
];

export const SNAIL_WINS = [
  { name: "Ámbar", wins: 2 },
  { name: "Bruma", wins: 1 },
  { name: "Cobre", wins: 0 },
  { name: "Duna", wins: 1 },
  { name: "Musgo", wins: 1 },
  { name: "Nácar", wins: 1 },
];
