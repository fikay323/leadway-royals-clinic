export interface loginRequest {
    email: string,
    password: string,
}

export interface registerRequest extends loginRequest {
    phoneNumber: string,
    role: string,
    firstName: string,
    lastName: string,
}