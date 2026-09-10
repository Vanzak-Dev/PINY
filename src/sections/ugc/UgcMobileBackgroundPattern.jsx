const placements = [
  [-109, -110], [105, -110],
  [0, 0], [214, 0],
  [-93, 111], [122, 111],
  [16, 222], [231, 222],
  [-75, 331], [140, 331],
  [42, 442], [256, 442],
];

export default function UgcMobileBackgroundPattern() {
  return (
    <svg
      className="ugc-mobile-background"
      viewBox="0 0 393 679"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <path
          id="ugc-mobile-background-shape"
          d="M98.7646 128.051C101.108 128.416 103.391 129.076 105.551 130.016C123.896 137.928 170.006 188.869 176.921 206.941C180.519 216.346 176.502 227.381 172.199 236.04C164.17 252.202 122.453 303.82 106.146 309.418C71.1525 311.263 34.863 237.377 26.0256 209.417C37.3515 180.303 62.9989 158.594 86.2339 137.848C90.1384 134.362 94.0666 130.522 98.7646 128.051Z"
        />
      </defs>
      <g transform="rotate(180 196.5 339.5)">
        {placements.map(([x, y], index) => (
          <use
            href="#ugc-mobile-background-shape"
            fill={index % 3 === 1 ? '#FFF547' : '#F4FE5C'}
            transform={`translate(${x} ${y})`}
            key={`${x}-${y}`}
          />
        ))}
      </g>
    </svg>
  );
}
