import { cn } from "./cn";
export const variants = (config) => (selection = {}) => {
    const classes = [config.base];
    Object.keys(config.variants).forEach((group) => {
        const chosen = selection[group] ?? config.defaults?.[group];
        if (chosen == null)
            return;
        const value = config.variants[group][chosen];
        if (value)
            classes.push(value);
    });
    return cn(...classes);
};
//# sourceMappingURL=variants.js.map