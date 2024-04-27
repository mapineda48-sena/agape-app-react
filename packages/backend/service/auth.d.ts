export function login(auth: { username: string, password: string }): Promise<void>;
export function isAuthenticated(): Promise<boolean>;
export function logout(): Promise<{ message: string }>;

export const isAuth: boolean;
export const sync: Promise<void>;
