export declare class PlatformNotification {
    id: number;
    user_id: number;
    type: 'mention' | 'assignment' | 'reminder' | 'deal_stage' | 'quote_accepted' | 'system';
    title: string;
    body: string | null;
    link: string | null;
    is_read: boolean;
    created_at: Date;
}
