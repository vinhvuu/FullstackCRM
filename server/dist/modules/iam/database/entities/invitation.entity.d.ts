export declare class IamInvitation {
    id: number;
    email: string;
    invited_by: number;
    role: 'admin' | 'user';
    token: string;
    status: 'pending' | 'accepted' | 'expired' | 'revoked';
    expires_at: Date;
    accepted_at: Date | null;
    created_at: Date;
}
