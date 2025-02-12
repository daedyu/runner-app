import { SchoolResponse, SchoolsResponse } from '@/types/school/school.types';
import axios from 'axios';

const SCHOOL_API_URL = 'http://192.168.0.18:8080';

class SchoolRepository {
  public async searchSchools(): Promise<SchoolsResponse> {
      const response = await axios.get<SchoolsResponse>(
        `${SCHOOL_API_URL}/school/all`
      );
      return response.data;
  }
}

export default new SchoolRepository(); 