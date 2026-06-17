export declare class IamUserSession {
    id: number;
    user_id: number;
    refresh_token_hash: string;
    expires_at: Date;
    revoked: boolean;
    user_agent: string | null;
    ip_address: string | null;
    created_at: Date;
}
