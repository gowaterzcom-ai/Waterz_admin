export interface CustomError {
    type: string;
    message: string;
    response?: any;
    status?: number;
}  