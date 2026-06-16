export declare class IamUser {
    id: number;
    email: string;
    password: string;
    name: string;
    phone: string | null;
    avatar_url: string | null;
    role: 'admin' | 'user';
    status: 'active' | 'inactive' | 'invited' | 'deleted';
    last_login_at: Date | null;
    must_change_password: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
