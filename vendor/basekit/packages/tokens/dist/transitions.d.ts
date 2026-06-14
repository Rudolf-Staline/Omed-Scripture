export declare const transitions: {
    readonly fast: "120ms cubic-bezier(0.4, 0, 0.2, 1)";
    readonly normal: "180ms cubic-bezier(0.4, 0, 0.2, 1)";
    readonly slow: "260ms cubic-bezier(0.4, 0, 0.2, 1)";
};
export declare const zIndex: {
    readonly base: 0;
    readonly docked: 10;
    readonly sticky: 100;
    readonly overlay: 1000;
    readonly dropdown: 1100;
    readonly drawer: 1200;
    readonly modal: 1300;
    readonly popover: 1400;
    readonly toast: 1500;
    readonly tooltip: 1600;
};
export type ZIndexToken = keyof typeof zIndex;
export type TransitionToken = keyof typeof transitions;
//# sourceMappingURL=transitions.d.ts.map