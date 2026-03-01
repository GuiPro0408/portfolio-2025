interface ZiggyRoute {
    (name: string, params?: unknown, absolute?: boolean): string;
    (): {
        current: (name?: string, params?: unknown) => boolean;
    };
}

declare const route: ZiggyRoute;

interface Window {
    axios: typeof import('axios').default;
}

declare module '*.css';

// React 18 runtime does not map fetchPriority (camelCase) to the DOM attribute.
// The lowercase HTML attribute fetchpriority IS passed through by React 18 without warnings.
declare namespace React {
    interface ImgHTMLAttributes<_T> {
        fetchpriority?: 'high' | 'low' | 'auto';
    }
}
