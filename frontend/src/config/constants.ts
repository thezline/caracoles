export const STORAGE_KEYS = {
  user: "pista-lenta:user",
  session: "pista-lenta:session",
  transactions: "pista-lenta:transactions",
} as const;

export const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://caracoles-production.up.railway.app/api";

export const BET_RESULTS = [
  { name: "Ganadas", value: 7 },
  { name: "Perdidas", value: 5 },
];

export const SNAIL_WINS = [
  { name: "Turbo", wins: 2 },
  { name: "Whiplash", wins: 1 },
  { name: "Burn", wins: 0 },
  { name: "Smoove Move", wins: 1 },
  { name: "Skidmark", wins: 1 },
  { name: "White Shadow", wins: 1 },
];
