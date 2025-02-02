import { InformationForm } from "../services/profile.service";

export type Role = 'doctor' | 'patient'
export interface User {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    uid: string;
    email: string;
    role: Role,
    personalInformation?: InformationForm,
    profilePic: string
}