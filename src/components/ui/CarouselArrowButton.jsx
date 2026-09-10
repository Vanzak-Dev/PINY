import './CarouselArrowButton.css';

export default function CarouselArrowButton({ direction, onClick, label }) {
  const isNext = direction === 'next';

  return (
    <button
      className={`carousel-arrow carousel-arrow--${direction}`}
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <svg className="carousel-arrow__desktop-icon" viewBox="0 0 98 76" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="96" height="73" rx="16" fill="#000B06" />
        <g className="carousel-arrow__front">
          <rect x="2" y="2" width="92" height="69" rx="14" fill="#FEFEFD" stroke="#000B06" strokeWidth="4" />
          <path
            d="M37 34.5C38.3807 34.5 39.5 35.6193 39.5 37C39.5 38.3807 38.3807 39.5 37 39.5V37V34.5ZM34.2322 38.7678C33.2559 37.7915 33.2559 36.2085 34.2322 35.2322L50.1421 19.3223C51.1184 18.346 52.7014 18.346 53.6777 19.3223C54.654 20.2986 54.654 21.8816 53.6777 22.8579L39.5355 37L53.6777 51.1421C54.654 52.1184 54.654 53.7014 53.6777 54.6777C52.7014 55.654 51.1184 55.654 50.1421 54.6777L34.2322 38.7678ZM37 37V39.5H36V37V34.5H37V37Z"
            fill="#000B06"
          />
        </g>
      </svg>
      <svg className="carousel-arrow__mobile-icon" viewBox="0 0 33 25" fill="none" aria-hidden="true">
        <rect x="0.657959" y="0.986877" width="31.5789" height="24.0132" rx="5.26316" fill="#000B06" />
        <g className="carousel-arrow__front">
          <rect x="1" y="1" width="29.5789" height="22.0132" rx="4.26316" fill="#FEFEFD" stroke="#000B06" strokeWidth="2" />
          <path d="M19.408 11.171C18.8557 11.171 18.408 11.6187 18.408 12.171C18.408 12.7233 18.8557 13.171 19.408 13.171V12.171V11.171ZM20.444 12.8781C20.8345 12.4876 20.8345 11.8544 20.444 11.4639L14.0801 5.09995C13.6895 4.70943 13.0564 4.70943 12.6658 5.09995C12.2753 5.49048 12.2753 6.12364 12.6658 6.51417L18.3227 12.171L12.6658 17.8279C12.2753 18.2184 12.2753 18.8516 12.6658 19.2421C13.0564 19.6326 13.6895 19.6326 14.0801 19.2421L20.444 12.8781ZM19.408 12.171V13.171H19.7369V12.171V11.171H19.408V12.171Z" fill="#000B06" />
        </g>
      </svg>
      <span className="carousel-arrow__hit-area" aria-hidden="true" />
    </button>
  );
}
