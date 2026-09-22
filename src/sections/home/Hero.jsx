import { useState } from "react";
import videoLeft from "../../assets/hero/Video-left.mp4";
import videoRight from "../../assets/hero/Video-right.mp4";
import leaf1 from "../../assets/hero/leaf-1.svg";
import leaf2 from "../../assets/hero/leaf-2.svg";
import leaf3 from "../../assets/hero/leaf-3.svg";
import leaf4 from "../../assets/hero/leaf-4.svg";
import logo from "../../assets/hero/logo.svg";
import iconUser from "../../assets/hero/icon-user.svg";
import iconBag from "../../assets/hero/icon-bag.svg";
import SearchPanel from "../../components/global/SearchPanel";
import "./Hero.css";

export default function Hero() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <section className="hero">
      <div className="hero__media">
        <video
          className="hero__video hero__video--left"
          src={videoLeft}
          autoPlay
          muted
          loop
          playsInline
        />
        <video
          className="hero__video hero__video--right"
          src={videoRight}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      <div className="hero__glow" />

      <div className="hero__leaf hero__leaf--1">
        <img src={leaf1} alt="" />
      </div>
      <div className="hero__leaf hero__leaf--2">
        <img src={leaf2} alt="" />
      </div>
      <div className="hero__leaf hero__leaf--3">
        <img src={leaf3} alt="" />
      </div>
      <div className="hero__leaf hero__leaf--4">
        <img src={leaf4} alt="" />
      </div>

      <div className="hero__logo">
        <img src={logo} alt="Piny" />
      </div>

      <header className="hero__header">
        <nav className="hero__nav">
          <p className="hero__nav-link">Analise sua Pele</p>
          <p className="hero__nav-link">Piny Mask</p>
          <p className="hero__nav-link">Piny Stars</p>
        </nav>
        <div className="hero__actions">
          <img src={iconUser} alt="Conta" />
          <img src={iconBag} alt="Sacola" />
          <button
            className="hero__search-trigger"
            type="button"
            aria-label="Pesquisar produtos"
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen(true)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </header>
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </section>
  );
}
