import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface User {
    name: string;
    email: string;
    phone: string;
    password: string;
    rol: 'superadmin' | 'admin_pais' | 'editor';   // ← nuevo
    pais_asignado: string | null;
}

export type IUser = RowRecord<User>;
export type CustomResponse<TResponse> = void | TResponse | Response;

export interface UserService<TResponse> {
    create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
    // login(req:Request, res:Response)    : Promise<CustomResponse<TResponse>>;
    // getUserCredentials(req:Request, res:Response) : Promise<Response<User>>;
}