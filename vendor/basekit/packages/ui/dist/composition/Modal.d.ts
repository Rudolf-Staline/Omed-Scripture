import { type ReactNode } from "react";
export type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    /** Close when clicking the backdrop (default true). */
    dismissable?: boolean;
    className?: string;
};
export declare const ModalView: ({ open, onClose, title, description, children, footer, size, dismissable, className, }: ModalProps) => import("react").ReactPortal | null;
export declare const Modal: import("@basekit/core").DeclarativeComponent<ModalProps>;
export type DrawerProps = Omit<ModalProps, "size"> & {
    side?: "left" | "right";
    width?: string;
};
export declare const DrawerView: ({ open, onClose, title, children, footer, side, width, dismissable, className, }: DrawerProps) => import("react").ReactPortal | null;
export declare const Drawer: import("@basekit/core").DeclarativeComponent<DrawerProps>;
//# sourceMappingURL=Modal.d.ts.map