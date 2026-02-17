export interface AuthUser {
    id?: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
}

export interface FlashPayload {
    success?: string | null;
    error?: string | null;
}

export interface ContactPayload {
    email?: string | null;
    linkedin?: string | null;
    github?: string | null;
}

export interface SharedPageProps extends Record<string, unknown> {
    auth: {
        user: AuthUser | null;
    };
    flash?: FlashPayload;
}

export interface AuthenticatedPageProps extends Record<string, unknown> {
    auth: {
        user: AuthUser;
    };
    flash?: FlashPayload;
}

export interface PaginationShape<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
