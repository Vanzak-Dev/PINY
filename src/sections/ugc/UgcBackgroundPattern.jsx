import UgcMobileBackgroundPattern from './UgcMobileBackgroundPattern';

export default function UgcBackgroundPattern() {
  return (
    <div className="ugc-reviews__background" aria-hidden="true">
      <svg className="ugc-desktop-background" viewBox="0 0 1920 1047" fill="none" preserveAspectRatio="none">
        <defs>
          <pattern id="ugc-background-pattern" width="294.5" height="303.5" patternUnits="userSpaceOnUse">
            <path
              d="M117.46 24.64c3.77-.47 6.75-.14 10.32 1.13 25.54 9.13 86.32 78.23 97.67 102.29 5.82 12.33 3.66 23.99-1.18 36.22-4.08 10.34-10.05 19.99-16.55 29.11-12.22 17.14-57.76 70.94-75.86 78.77-11.66 2.07-18.09-1.17-28.14-6.97-29.09-16.76-77.41-99.49-83.38-130.69 18.91-42.19 60.34-80.16 97.12-109.86Z"
              fill="#F4FE5C"
            />
            <path
              d="M127.78 25.77c25.54 9.13 86.32 78.23 97.67 102.29 5.82 12.33 3.66 23.99-1.18 36.22-4.08 10.34-10.05 19.99-16.55 29.11-12.22 17.14-57.76 70.94-75.86 78.77-11.66 2.07-18.09-1.17-28.14-6.97-29.09-16.76-77.41-99.49-83.38-130.69 18.91-42.19 60.34-80.16 97.12-109.86 3.77-.47 6.75-.14 10.32 1.13Z"
              fill="#FFF547"
            />
          </pattern>
        </defs>
        <rect width="1920" height="1047" fill="url(#ugc-background-pattern)" />
      </svg>
      <UgcMobileBackgroundPattern />
    </div>
  );
}
