export type Role = 'doctor' | 'patient'
export interface User {
    firstName: string,
    lastName: string,
    uid: string;
    email: string;
    role: Role
}