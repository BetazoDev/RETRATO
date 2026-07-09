interface EditorialTickerProps {
  titles: string[];
}

export default function EditorialTicker({ titles }: EditorialTickerProps) {
  if (titles.length === 0) return null;

  // Duplicate the array for seamless loop
  const items = [...titles, ...titles];

  return (
    <section className="ticker-sec">
      <div className="ticker-container">
        <div className="marquee-content">
          {items.map((title, i) => (
            <span key={i} className="ticker-content">
              <span className="ticker-text">{title}</span>
              <span className="ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
