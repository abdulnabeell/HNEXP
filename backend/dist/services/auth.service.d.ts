export declare const AuthService: {
    register(data: any): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(data: any): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getMe(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
};
//# sourceMappingURL=auth.service.d.ts.map