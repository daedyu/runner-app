import { useState, useCallback, useEffect } from 'react';
import schoolRepository from '@/repository/school/school.repository';
import { SchoolResponse, SchoolsResponse } from '@/types/school/school.types';

export default function useSchoolSearch() {
  const [loading, setLoading] = useState(false);
  const [allSchools, setAllSchools] = useState<SchoolResponse[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: SchoolsResponse = await schoolRepository.searchSchools();
      setAllSchools(response.data);
      setFilteredSchools(response.data);
    } catch (err) {
      setError('학교 목록을 불러오는데 실패했습니다.');
      setAllSchools([]);
      setFilteredSchools([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSchools();
  }, [fetchAllSchools]);

  const searchSchools = useCallback((keyword: string) => {
    if (!keyword.trim()) {
      setFilteredSchools(allSchools);
      return;
    }

    const filtered = allSchools.filter(school => 
      school.name.toLowerCase().includes(keyword.toLowerCase()) ||
      school.location.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [allSchools]);

  return {
    schools: filteredSchools,
    loading,
    error,
    searchSchools,
    refreshSchools: fetchAllSchools,
  };
} 