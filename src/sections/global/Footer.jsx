import { useState } from "react";
import "./Footer.css";

const logo = "/footer/Logo1.svg";
const rostopiny = "/footer/rostopiny.webp";
const vanzak = "/footer/vanzak1.svg";
const banners = "/footer/Banners.svg";
const facebookIcon = "/footer/Facebook.svg";
const instaIcon = "/footer/Insta.svg";

const MENU_COLUMNS = [
  {
    title: "PRODUTOS",
    items: [
      { label: "Piny Mask Original", href: "/produtos/piny-mask-original" },
      { label: "Piny Mask Argila Rosa", href: "/produtos/piny-mask-argila-rosa" },
      { label: "Piny Mask Argila Preta", href: "/produtos/piny-mask-argila-preta" },
      { label: "Piny Mask Argila Verde", href: "/produtos/piny-mask-argila-verde" },
      { label: "Piny Stars", href: "/produtos/piny-stars" },
    ],
  },
  {
    title: "INSTITUCIONAL",
    items: [
      { label: "Sobre Nós", href: "/sobre-nos" },
      { label: "Blog", href: "/blog" },
      { label: "Seja um Afiliado", href: "/afiliados" },
    ],
  },
  {
    title: "CONTATO",
    items: [
      { label: "Segunda à Sexta, das 9h às 18h" },
      { label: "+55 42 4002-8922", href: "tel:+554240028922" },
      { label: "SAC: suporte@piny.com", href: "mailto:suporte@piny.com" },
    ],
    social: true,
  },
];

export default function Footer() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (title) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  return (
    <footer className="footer">
      <div className="footer__main footer__inner">
        {/* Left block: logo + menu columns */}
        <div className="footer__left">
          <img className="footer__logo" src={logo} alt="Piny" />

          <div className="footer__menus">
            {MENU_COLUMNS.map((col) => (
              <div className="footer__col" key={col.title}>
                {/* Desktop title */}
                <h3 className="footer__col-title">{col.title}</h3>

                {/* Mobile accordion header */}
                <button
                  className="footer__accordion-header"
                  onClick={() => toggleMenu(col.title)}
                  aria-expanded={openMenu === col.title}
                >
                  <span>{col.title}</span>
                  <span className="footer__accordion-icon">
                    {openMenu === col.title ? "−" : "+"}
                  </span>
                </button>

                {/* Items — visible on desktop always, on mobile only when open */}
                <ul
                  className="footer__items"
                  data-open={openMenu === col.title}
                >
                  {col.items.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a href={item.href}>{item.label}</a>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </li>
                  ))}
                  {col.social && (
                    <li className="footer__social">
                      <a
                        href="https://www.facebook.com/pinybrasil/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                      >
                        <img src={facebookIcon} alt="Facebook" />
                      </a>
                      <a
                        href="https://www.instagram.com/pinybrasil/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <img src={instaIcon} alt="Instagram" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right block: rostopiny */}
        <div className="footer__right">
          <img src={rostopiny} alt="Piny" className="footer__rostopiny" />
        </div>
      </div>

      {/* Divider between main and bottom — follows page-width */}
      <div className="footer__divider footer__inner" />

      {/* Bottom section */}
      <div className="footer__bottom footer__inner">
        <a
          href="https://www.vanzaklabs.com/?utm_source=beleza-brasileira"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__vanzak"
        >
          <img src={vanzak} alt="Vanzak Labs" />
        </a>
        <img src={banners} alt="Formas de pagamento" className="footer__banners" />
      </div>
    </footer>
  );
}
