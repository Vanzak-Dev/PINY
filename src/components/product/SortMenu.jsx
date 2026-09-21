import { useEffect, useRef } from 'react';
import './SortMenu.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Em destaque' },
  { value: 'recent', label: 'O mais novo' },
  { value: 'highest', label: 'Classificações mais altas' },
  { value: 'lowest', label: 'Classificações mais baixas' },
];

export default function SortMenu({ sortOrder, onSortChange, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="sort-menu" ref={menuRef}>
      <h3 className="sort-menu__title">Ordenar por</h3>
      <ul className="sort-menu__list">
        {SORT_OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              className={`sort-menu__item${sortOrder === option.value ? ' is-selected' : ''}`}
              onClick={() => {
                onSortChange(option.value);
                onClose();
              }}
            >
              <span>{option.label}</span>
              {sortOrder === option.value && (
                <svg className="sort-menu__check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
