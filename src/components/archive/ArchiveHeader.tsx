interface ArchiveHeaderProps {
  totalCount?: number;
  categoryName?: string;
  categoryDescription?: string;
}

export default function ArchiveHeader({ 
  totalCount = 4209, 
  categoryName,
  categoryDescription
}: ArchiveHeaderProps) {
  const displayTitle = categoryName ? `${categoryName}` : 'Analog Archive';
  const displayDesc = categoryDescription || 'A disciplined collection of visual culture and analog photography. Explore our technical database and editorial gallery featuring works from the 1960s to contemporary masters.';

  return (
    <div className="arc-header-grid">
      <div>
        <h2 className="arc-title">
          {displayTitle}
        </h2>
        <p className="arc-description">
          {displayDesc}
        </p>
      </div>
      
      <div className="arc-meta-info">
        <div className="arc-live-count">
          <span className="arc-pulse-dot" />
          Live Collection: {totalCount} Entries
        </div>
      </div>
    </div>
  );
}
