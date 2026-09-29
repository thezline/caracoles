import type { ReactNode } from "react";
import { Brand } from "./Brand";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthLayout = ({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) => (
  <main className="auth-shell">
    <section className="auth-intro">
      <Brand />
      <div className="auth-intro__content">
        <span className="eyebrow">Circuito diario</span>
        <h1>La emoción está en cada centímetro.</h1>
        <p>
          Una pista sobria para seguir resultados, controlar tu saldo y
          disfrutar la carrera a tu ritmo.
        </p>
      </div>
      <div className="track-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
    <section className="auth-panel">
      <div className="auth-card">
        <header>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </header>
        {children}
        <footer>{footer}</footer>
      </div>
    </section>
  </main>
);
