import { Response } from '@/types/support/response.types'

export interface SignInRequest {
    email: string,
    password: string,
}

export interface SignInResponse extends Response {
    data: {
        access: string,
        refresh: string
    }
}

export interface ReissueRequest {
    refresh: string
}