import { useState } from "react";
import logo from "../../assets/hero/logo.svg";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import SearchPanel from "./SearchPanel";
import { useCart } from "../../hooks/useCart";
import "./Header.css";

export default function Header() {
  const { items, open } = useCart();
  const itemCount = items.reduce((sum, { quantity }) => sum + quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
    <header className="site-header">
      <div className="site-header__inner">
        <button type="button" className="site-header__menu-btn" aria-label="Menu" onClick={() => setMobileMenuOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
            <rect width="2" height="20" rx="1" transform="matrix(0 1 1 0 2 19)" fill="#1C8C44"/>
            <rect width="2" height="20" rx="1" transform="matrix(0 1 1 0 2 12)" fill="#1C8C44"/>
            <rect width="2" height="20" rx="1" transform="matrix(0 1 1 0 2 5)" fill="#1C8C44"/>
          </svg>
        </button>
        <a className="site-header__logo" href="/" aria-label="Piny — Página inicial">
          <img src={logo} alt="Piny" />
        </a>
        <nav className="site-header__nav">
          <a className="site-header__nav-link" href="#">Analise sua Pele</a>
          <a className="site-header__nav-link" href="#">Monte sua Textura</a>
          <div className="site-header__nav-item--has-mega">
            <a className="site-header__nav-link" href="#">Piny Mask</a>
            <MegaMenu />
          </div>
          <a className="site-header__nav-link" href="#">Piny Stars</a>
        </nav>
        <div className="site-header__actions">
          <button type="button" className="site-header__action" aria-label="Buscar" onClick={() => setSearchOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
              <circle cx="11.6667" cy="11.6667" r="10.6667" stroke="#1C8C44" strokeWidth="2"/>
              <path d="M19.8333 19.8333L27.9999 28" stroke="#1C8C44" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button type="button" className="site-header__action site-header__action--cart" aria-label="Carrinho" onClick={open}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="29" viewBox="0 0 28 29" fill="none">
              <path d="M4.72754 11H22.2725C22.473 11.0002 22.6427 11.1488 22.6689 11.3477L24.8008 27.5479C24.8322 27.7874 24.6449 28 24.4033 28H2.59668C2.35507 28 2.16776 27.7874 2.19922 27.5479L4.33105 11.3477C4.35729 11.1488 4.52698 11.0002 4.72754 11Z" stroke="#1C8C44" strokeWidth="2"/>
              <path d="M8 13V7C8 3.68629 10.4624 1 13.5 1C16.5375 1 19 3.68629 19 7V13" stroke="#1C8C44" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {itemCount > 0 && <span className="site-header__cart-count">{itemCount}</span>}
          </button>
        </div>
      </div>
    </header>
    <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
