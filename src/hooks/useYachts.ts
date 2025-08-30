import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/store/hook';
import { yachtAPI } from '../api/yachts';
import { handleApiError } from '../api/errorHandler';
import { Yacht } from '../types/yachts';
import { CustomError } from '../types/error';

export const useYachts = () => {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchYachts = async () => {
    try {
      setLoading(true);
      const data = await yachtAPI.getAllYachts();
      setYachts(data);
    } catch (error) {
      handleApiError(error as CustomError, dispatch, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYachts();
  }, []);

  return { yachts, loading, refetch: fetchYachts };
};