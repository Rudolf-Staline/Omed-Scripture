import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, createComponent } from "@basekit/core";
import { Icon, renderIcon, softToneStyles, solidDotStyles, textToneStyles, } from "../internal";
export const BadgeView = ({ text, children, tone = "neutral", variant = "soft", dot, iconLeft, className, hidden, }) => {
    if (hidden)
        return null;
    return (_jsxs("span", { className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-bk-xs font-medium", variant === "soft" && softToneStyles[tone], variant === "outline" &&
            cn("bg-transparent", textToneStyles[tone], "border-current"), variant === "solid" && solidToneSurface[tone], className), children: [dot && (_jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", solidDotStyles[tone]) })), renderIcon(iconLeft), children ?? text] }));
};
const solidToneSurface = {
    neutral: "bg-foreground text-background border-transparent",
    primary: "bg-primary text-primary-foreground border-transparent",
    accent: "bg-accent text-accent-foreground border-transparent",
    success: "bg-success text-success-foreground border-transparent",
    warning: "bg-warning text-warning-foreground border-transparent",
    danger: "bg-danger text-danger-foreground border-transparent",
};
export const Badge = createComponent("Badge");
export const LinkView = ({ href, children, text, tone = "primary", external, className, ...rest }) => (_jsxs("a", { href: href, target: external ? "_blank" : undefined, rel: external ? "noreferrer noopener" : undefined, className: cn("inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm", textToneStyles[tone], className), ...rest, children: [children ?? text, external && _jsx(Icon, { name: "external", size: 14, "aria-hidden": true })] }));
export const Link = createComponent("Link");
const avatarSize = {
    xs: "h-6 w-6 text-bk-xs",
    sm: "h-8 w-8 text-bk-sm",
    md: "h-10 w-10 text-bk-sm",
    lg: "h-12 w-12 text-bk-md",
    xl: "h-14 w-14 text-bk-lg",
};
const initials = (name) => name
    ? name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";
export const AvatarView = ({ src, alt, name, size = "md", className, }) => (_jsx("span", { className: cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft font-semibold text-primary", avatarSize[size], className), children: src ? (_jsx("img", { src: src, alt: alt ?? name ?? "", className: "h-full w-full object-cover" })) : name ? (_jsx("span", { "aria-hidden": true, children: initials(name) })) : (_jsx(Icon, { name: "user", "aria-hidden": true })) }));
export const Avatar = createComponent("Avatar");
export const DividerView = ({ orientation = "horizontal", label, className, }) => {
    if (orientation === "vertical") {
        return (_jsx("span", { role: "separator", "aria-orientation": "vertical", className: cn("inline-block w-px self-stretch bg-border", className) }));
    }
    if (label != null) {
        return (_jsxs("div", { className: cn("flex items-center gap-3 text-bk-xs text-muted-foreground", className), children: [_jsx("span", { className: "h-px flex-1 bg-border" }), label, _jsx("span", { className: "h-px flex-1 bg-border" })] }));
    }
    return _jsx("hr", { className: cn("border-0 border-t border-border", className) });
};
export const Divider = createComponent("Divider");
export const KbdView = ({ children, keys, className }) => (_jsx("kbd", { className: cn("inline-flex items-center gap-1 rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-bk-xs text-muted-foreground", className), children: keys ? keys.join(" + ") : children }));
export const Kbd = createComponent("Kbd");
export const SpinnerView = ({ size = 20, tone = "primary", label = "Chargement", className, }) => (_jsx(Icon, { name: "spinner", size: size, title: label, className: cn("animate-spin", textToneStyles[tone], className) }));
export const Spinner = createComponent("Spinner");
//# sourceMappingURL=Misc.js.map