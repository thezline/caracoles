import { useCallback, useState } from "react";
import { ArrowUpRight, LogOut, Plus } from "lucide-react";
import { BalanceModal } from "../components/BalanceModal";
import { BetDonutChart } from "../components/BetDonutChart";
import { Brand } from "../components/Brand";
import { SnailWinsChart } from "../components/SnailWinsChart";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/format";

export const DashboardPage = () => {
  const { user, logout, addBalance } = useAuth();
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const closeModal = useCallback(() => setIsBalanceModalOpen(false), []);

  if (!user) return null;

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <Brand />
        <div className="topbar__actions">
          <span className="topbar__user">{user.fullName}</span>
          <button
            className="button button--ghost"
            type="button"
            onClick={logout}
          >
            <LogOut size={17} /> Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard">
        <header className="dashboard__heading">
          <div>
            <span className="eyebrow">Panel de carrera</span>
            <h1>Hola, {user.fullName.split(" ")[0]}</h1>
            <p>Este es el pulso de la pista durante la jornada.</p>
          </div>
          <span className="day-badge">
            <span /> Jornada activa
          </span>
        </header>

        <section className="balance-card">
          <div>
            <span className="balance-card__label">Saldo disponible</span>
            <strong>{formatCurrency(user.balance)}</strong>
            <span className="balance-card__currency">Pesos mexicanos</span>
          </div>
          <button
            className="button button--light"
            type="button"
            onClick={() => setIsBalanceModalOpen(true)}
          >
            <Plus size={18} /> Cargar saldo
          </button>
          <ArrowUpRight
            className="balance-card__decoration"
            size={110}
            strokeWidth={0.8}
            aria-hidden="true"
          />
        </section>

        <section className="dashboard-grid">
          <article className="data-card">
            <header className="data-card__header">
              <div>
                <span className="eyebrow">Rendimiento</span>
                <h2>Resultado de apuestas</h2>
              </div>
              <span className="data-card__meta">12 totales</span>
            </header>
            <BetDonutChart />
          </article>
          <article className="data-card data-card--wide">
            <header className="data-card__header">
              <div>
                <span className="eyebrow">6 carreras de hoy</span>
                <h2>Victorias por caracol</h2>
              </div>
              <span className="data-card__meta">6 victorias</span>
            </header>
            <SnailWinsChart />
          </article>
        </section>
      </main>

      {isBalanceModalOpen && (
        <BalanceModal
          user={user}
          onClose={closeModal}
          onApproved={addBalance}
        />
      )}
    </div>
  );
};
