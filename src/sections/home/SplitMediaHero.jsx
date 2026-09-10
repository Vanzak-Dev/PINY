import "./SplitMediaHero.css";

function ResponsiveMedia({ media, alt }) {
  if (!media?.src) return null;

  if (media.type === "video") {
    return (
      <video
        className="split-media-hero__media"
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt || undefined}
      >
        {media.mobileSrc && (
          <source src={media.mobileSrc} media="(max-width: 767px)" />
        )}
        <source src={media.src} />
      </video>
    );
  }

  return (
    <picture>
      {media.mobileSrc && (
        <source srcSet={media.mobileSrc} media="(max-width: 767px)" />
      )}
      <img
        className="split-media-hero__media"
        src={media.src}
        alt={alt || ""}
        loading="eager"
        fetchPriority="high"
      />
    </picture>
  );
}

export default function SplitMediaHero({
  leftMedia,
  rightMedia,
  overlayImage,
  leftAlt = "",
  rightAlt = "",
  overlayAlt = "",
  className = "",
}) {
  return (
    <section className={`split-media-hero ${className}`.trim()}>
      <div className="split-media-hero__panel split-media-hero__panel--left">
        <ResponsiveMedia media={leftMedia} alt={leftAlt} />
      </div>

      <div className="split-media-hero__panel split-media-hero__panel--right">
        <ResponsiveMedia media={rightMedia} alt={rightAlt} />
      </div>

      {overlayImage && (
        <img
          className="split-media-hero__overlay"
          src={overlayImage}
          alt={overlayAlt}
          loading="eager"
          fetchPriority="high"
        />
      )}
    </section>
  );
}
