interface PaginationProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNext: () => void;
  onPrev: () => void;
  currentPage?: number;
  totalEntries?: number;
  shownCount?: number;
}

export default function Pagination({
  hasNextPage,
  hasPrevPage,
  onNext,
  onPrev,
  currentPage = 1,
  totalEntries = 4209,
  shownCount = 12,
}: PaginationProps) {
  const from = (currentPage - 1) * shownCount + 1;
  const to = Math.min(currentPage * shownCount, totalEntries);

  return (
    <div className="arc-pagination">
      <div className="arc-page-info-text">
        Showing {from}-{to} of {totalEntries}
      </div>

      <div className="arc-pagination-actions">
        <button
          className="btn-ghost"
          onClick={onPrev}
          disabled={!hasPrevPage}
          style={{ opacity: hasPrevPage ? 1 : 0.3, cursor: hasPrevPage ? 'pointer' : 'not-allowed' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            arrow_back
          </span>
          Prev
        </button>

        <div className="arc-page-nums">
          <span className="arc-page-num arc-page-num-active">
            {String(currentPage).padStart(2, '0')}
          </span>
          {hasNextPage && (
            <span className="arc-page-num opacity-20" onClick={onNext}>
              {String(currentPage + 1).padStart(2, '0')}
            </span>
          )}
        </div>

        <button
          className="btn-ghost"
          onClick={onNext}
          disabled={!hasNextPage}
          style={{ opacity: hasNextPage ? 1 : 0.3, cursor: hasNextPage ? 'pointer' : 'not-allowed' }}
        >
          Next
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
