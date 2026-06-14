import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const paths = {
    filter: _jsx("path", { d: "M3 5h18M6 12h12M10 19h4" }),
    undo: _jsx("path", { d: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-4" }),
    close: _jsx("path", { d: "M18 6 6 18M6 6l12 12" }),
    check: _jsx("path", { d: "m20 6-11 11-5-5" }),
    "check-circle": (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "m9 12 2 2 4-4" })] })),
    info: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "M12 11v5M12 8h.01" })] })),
    warning: _jsx("path", { d: "M12 3 2 20h20L12 3ZM12 10v4M12 17h.01" }),
    error: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "M12 8v4M12 16h.01" })] })),
    search: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "11", cy: "11", r: "7" }), _jsx("path", { d: "m21 21-4.3-4.3" })] })),
    plus: _jsx("path", { d: "M12 5v14M5 12h14" }),
    calendar: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "17", rx: "2" }), _jsx("path", { d: "M16 2v4M8 2v4M3 10h18" })] })),
    "chevron-down": _jsx("path", { d: "m6 9 6 6 6-6" }),
    "chevron-right": _jsx("path", { d: "m9 6 6 6-6 6" }),
    "chevron-left": _jsx("path", { d: "m15 6-6 6 6 6" }),
    menu: _jsx("path", { d: "M4 6h16M4 12h16M4 18h16" }),
    "arrow-right": _jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }),
    trash: _jsx("path", { d: "M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" }),
    settings: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "3" }), _jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 7.5 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.5-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8.5a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.5V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 8.5a1.65 1.65 0 0 0 1.5 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" })] })),
    user: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "8", r: "4" }), _jsx("path", { d: "M4 21a8 8 0 0 1 16 0" })] })),
    external: (_jsx("path", { d: "M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })),
    spinner: _jsx("path", { d: "M21 12a9 9 0 1 1-6.2-8.5" }),
};
export const Icon = ({ name, size = "1em", title, ...props }) => (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": title ? undefined : true, role: title ? "img" : undefined, ...props, children: [title ? _jsx("title", { children: title }) : null, paths[name]] }));
//# sourceMappingURL=Icon.js.map