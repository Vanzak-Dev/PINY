import { useEffect, useState } from 'react';
import logo from '../../assets/hero/logo.svg';
import iconUser from '../../assets/hero/icon-user.svg';
import iconBag from '../../assets/hero/icon-bag.svg';
import { useCart } from '../../hooks/useCart';
import './Header.css';

const navLinks = ['Analise sua Pele', 'Piny Mask', 'Piny Stars'];

export default function Header({ isPdp }) {
  const [visible, setVisible] = useState(isPdp);
  const { open } = useCart();

  useEffect(() => {
    if (isPdp) {
      setVisible(true);
      return undefined;
    }
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isPdp]);

  return (
    <header className={`site-header${visible ? ' is-visible' : ''}`}>
      <nav className="site-header__nav">
        {navLinks.map((link) => (
          <a key={link} href="#" className="site-header__nav-link">{link}</a>
        ))}
      </nav>
      <img className="site-header__logo" src={logo} alt="PINY" />
      <div className="site-header__actions">
        <button type="button" className="site-header__icon-btn" aria-label="Conta">
          <img src={iconUser} alt="" />
        </button>
        <button type="button" className="site-header__icon-btn" onClick={open} aria-label="Sacola">
          <img src={iconBag} alt="" />
        </button>
      </div>
    </header>
  );
}
