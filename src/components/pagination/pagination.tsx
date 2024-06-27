import S from './pagination.module.css';
type PaginationProps = {
    totalPages: number;
    page: number;
    onPageChange: (pageNum: number) => void;
};
export const Pagination = ({
    totalPages,
    page,
    onPageChange,
}: PaginationProps) => {
    return (
        <div className={S.paginationContainer}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) =>
                    pageNum === 1 && totalPages <= 1 ? null : (
                        <button
                            className={S.paginationButton}
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            disabled={pageNum === page}
                        >
                            {pageNum}
                        </button>
                    )
            )}
        </div>
    );
};
