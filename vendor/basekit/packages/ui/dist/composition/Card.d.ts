import { type ReactNode } from "react";
import type { Radius, Shadow, Size, Tone } from "@basekit/tokens";
export type CardProps = {
    children?: ReactNode;
    variant?: "plain" | "outlined" | "elevated";
    tone?: Tone;
    padding?: Size | "none";
    radius?: Radius;
    shadow?: Shadow;
    border?: boolean;
    interactive?: boolean;
    onClick?: () => void;
    className?: string;
    id?: string;
    hidden?: boolean;
    testId?: string;
};
declare const CardHeaderView: ({ title, description, actions, children, className, }: {
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
}) => import("react").JSX.Element;
declare const CardContentView: ({ children, className, }: {
    children?: ReactNode;
    className?: string;
}) => import("react").JSX.Element;
declare const CardFooterView: ({ children, className, }: {
    children?: ReactNode;
    className?: string;
}) => import("react").JSX.Element;
declare const CardTitleView: ({ children, className, }: {
    children?: ReactNode;
    className?: string;
}) => import("react").JSX.Element;
declare const CardDescriptionView: ({ children, className, }: {
    children?: ReactNode;
    className?: string;
}) => import("react").JSX.Element;
/**
 * Card. React usage: `<Card.View>` + `<Card.Header/Content/Footer>`.
 * Declarative usage: `Card({ children: [CardHeader(...), CardContent(...)] })`.
 */
export declare const Card: ((props?: import("@basekit/core").WithChildren<CardProps> | undefined) => import("@basekit/core").UINode<CardProps>) & {
    readonly componentName: string;
} & {
    View: ({ children, variant, tone, padding, radius, shadow, border, interactive, onClick, className, id, hidden, testId, }: CardProps) => import("react").JSX.Element | null;
    Header: ({ title, description, actions, children, className, }: {
        title?: ReactNode;
        description?: ReactNode;
        actions?: ReactNode;
        children?: ReactNode;
        className?: string;
    }) => import("react").JSX.Element;
    Content: ({ children, className, }: {
        children?: ReactNode;
        className?: string;
    }) => import("react").JSX.Element;
    Footer: ({ children, className, }: {
        children?: ReactNode;
        className?: string;
    }) => import("react").JSX.Element;
    Title: ({ children, className, }: {
        children?: ReactNode;
        className?: string;
    }) => import("react").JSX.Element;
    Description: ({ children, className, }: {
        children?: ReactNode;
        className?: string;
    }) => import("react").JSX.Element;
};
export declare const CardView: ({ children, variant, tone, padding, radius, shadow, border, interactive, onClick, className, id, hidden, testId, }: CardProps) => import("react").JSX.Element | null;
export declare const CardHeader: import("@basekit/core").DeclarativeComponent<{
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
}>;
export declare const CardContent: import("@basekit/core").DeclarativeComponent<{
    children?: unknown;
}>;
export declare const CardFooter: import("@basekit/core").DeclarativeComponent<{
    children?: unknown;
}>;
export { CardHeaderView, CardContentView, CardFooterView, CardTitleView, CardDescriptionView, };
//# sourceMappingURL=Card.d.ts.map