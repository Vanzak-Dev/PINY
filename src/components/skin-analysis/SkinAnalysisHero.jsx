import React from "react";
import { Camera } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import "./SkinAnalysisHero.css";

import bgDesktop from "@/assets/images/skin-analysis-hero/skin-hero-bg-desktop.webp";
import bgMobile from "@/assets/images/skin-analysis-hero/skin-hero-bg-mobile.webp";
import modelsDesktop from "@/assets/images/skin-analysis-hero/skin-hero-models-desktop.webp";
import modelsMobile from "@/assets/images/skin-analysis-hero/skin-hero-models-mobile.webp";

export default function SkinAnalysisHero() {
  const { track } = useAnalytics("SkinAnalysisHome");

  const handleStart = () => {
    track("cta_iniciar_analise_click", { origem: "hero" });
    window.location.href = "/skin-analysis-test";
  };

  return (
    <section className="skin-hero">
      <img
        className="skin-hero__bg skin-hero__bg--desktop"
        src={bgDesktop}
        alt=""
        aria-hidden="true"
      />

      <img
        className="skin-hero__bg skin-hero__bg--mobile"
        src={bgMobile}
        alt=""
        aria-hidden="true"
      />

      <div className="skin-hero__desktop">
        <div className="skin-hero__models">
          <img
            src={modelsDesktop}
            alt="Modelos aplicando máscara facial"
            loading="eager"
          />
        </div>

        <div className="skin-hero__text">
          <p className="skin-hero__eyebrow">DESCUBRA SUA</p>

          <h1 className="skin-hero__title">
            <span className="skin-hero__title-rotina">ROTINA</span>
            <span className="skin-hero__title-personalizada">
              PERSONALIZADA
            </span>
          </h1>

          <p className="skin-hero__subtitle">
            Analise Sua Pele Em Segundos E Receba Uma Rotina Completa De
            Skincare Focada Em Acne, Manchas E Oleosidade.
          </p>

          <button
            className="btn-piny skin-hero__btn"
            onClick={handleStart}
          >
            <Camera className="btn-piny__icon" />
            <span>Começar Análise</span>
          </button>
        </div>
      </div>

      <div className="skin-hero__mobile">
        <div className="skin-hero__mobile-title">
          <p className="skin-hero__eyebrow">DESCUBRA SUA</p>

          <h1 className="skin-hero__title">
            <span className="skin-hero__title-rotina">ROTINA</span>
            <span className="skin-hero__title-personalizada">
              PERSONALIZADA
            </span>
          </h1>
        </div>

        <div className="skin-hero__mobile-image">
          <img
            src={modelsMobile}
            alt="Modelos aplicando máscara facial"
            loading="eager"
          />

          <div className="skin-hero__mobile-overlay">
            <p className="skin-hero__mobile-subtitle">
              Analise Sua Pele Em Segundos E Receba Uma Rotina Completa De
              Skincare Focada Em Acne, Manchas E Oleosidade.
            </p>

            <button
              className="btn-piny skin-hero__btn"
              onClick={handleStart}
            >
              <Camera className="btn-piny__icon" />
              <span>Começar Análise</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}