export type PaginationProps = {
    id?: string;
    className?: string;
    page?: number;
    defaultPage?: number;
    totalPages: number;
    /** Pages shown on each side of the current page. */
    siblingCount?: number;
    /** Pages always shown at the start and end. */
    boundaryCount?: number;
    disabled?: boolean;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    testId?: string;
    "aria-label"?: string;
    onPageChange?: (page: number) => void;
};
export declare const PaginationView: ({ id, className, page, defaultPage, totalPages, siblingCount, boundaryCount, disabled, showFirstLast, showPrevNext, testId, onPageChange, ...rest }: PaginationProps) => import("react").JSX.Element;
export declare const Pagination: import("@basekit/core").DeclarativeComponent<PaginationProps>;
//# sourceMappingURL=Pagination.d.ts.map