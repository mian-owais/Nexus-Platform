interface IPayload {
    userId: string;
    role: 'entrepreneur' | 'investor';
}
export declare const generateToken: (userId: string, role: "entrepreneur" | "investor") => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyToken: (token: string) => IPayload;
export declare const verifyRefreshToken: (token: string) => any;
export declare const decodeToken: (token: string) => IPayload | null;
export {};
