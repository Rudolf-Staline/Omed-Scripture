import { type ReactNode } from "react";
export type BreadcrumbItem = {
    label: ReactNode;
    href?: string;
    /** Marks the current page (rendered as plain text with aria-current). */
    current?: boolean;
};
export type BreadcrumbProps = {
    id?: string;
    className?: string;
    items: BreadcrumbItem[];
    /** Separator between items (default "/"). */
    separator?: ReactNode;
    testId?: string;
    "aria-label"?: string;
    onItemClick?: (item: BreadcrumbItem, index: number) => void;
};
export declare const BreadcrumbView: ({ id, className, items, separator, testId, onItemClick, ...rest }: BreadcrumbProps) => import("react").JSX.Element;
export declare const Breadcrumb: import("@basekit/core").DeclarativeComponent<BreadcrumbProps>;
//# sourceMappingURL=Breadcrumb.d.ts.map