import { Response } from '@/types/support/response.types'

export interface SchoolsResponse extends Response {
  data: SchoolResponse[];
}

export interface SchoolResponse {
  id: number;
  name: string;
  location: string;
  website: string;
  grade: number;
}