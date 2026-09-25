import React from "react";
import { Sparkles } from "lucide-react";
import montesuaImg from "@/assets/menu/montesuatextura.webp";
import "./MonteSuaTextura.css";

export default function MonteSuaTextura() {
  return (
    <main className="textura-page">
      <section className="textura-hero">
        <div className="textura-hero__content">
          <p className="textura-hero__eyebrow">MONTE SUA</p>
          <h1 className="textura-hero__title">
            <span className="textura-hero__title-line">TEXTURA</span>
            <span className="textura-hero__title-line textura-hero__title-line--accent">
              PERSONALIZADA
            </span>
          </h1>
          <p className="textura-hero__subtitle">
            Monte a textura ideal para sua pele combinando ativos e
            ingredientes que fazem a diferença na sua rotina.
          </p>
          <button
            className="btn-piny textura-hero__btn"
            onClick={() => (window.location.href = "/")}
          >
            <Sparkles className="btn-piny__icon" />
            <span>Em breve</span>
          </button>
        </div>
        <div className="textura-hero__image">
          <img src={montesuaImg} alt="Monte sua Textura" loading="eager" />
        </div>
      </section>
    </main>
  );
}
