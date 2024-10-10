

export interface Roles {
    doctor?: boolean;
    patient?: boolean
}

export interface User {
    uid: string;
    email: string;
    role: Roles;
}