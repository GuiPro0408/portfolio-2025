interface ZiggyRoute {
    (name: string, params?: unknown, absolute?: boolean): string;
    (): {
        current: (name?: string, params?: unknown) => boolean;
    };
}

declare const route: ZiggyRoute;

declare module '*.css';
