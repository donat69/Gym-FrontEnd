export interface Member {
    id?: number;
    name: string;
    email: string;
    phone: number;
    address: string;
    birthDate: Date;
    gender: string;
    observations: string;
    key: string;
    profilePicture: string;
    createdBy?: number;
    tenantId?: number;
}
