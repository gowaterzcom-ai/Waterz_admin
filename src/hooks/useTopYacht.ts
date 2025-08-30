import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { yachtAPI } from '../api/yachts';
import { handleApiError } from '../api/errorHandler';
import { Yacht } from '../types/yachts';
import { CustomError } from '../types/error';
import { setLoading } from '../redux/slices/loadingSlice';
import { useAppDispatch } from '../redux/store/hook';
export const useTopYachts = () => {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchYachts = async () => {
    try {
      dispatch(setLoading(true));
      const data = await yachtAPI.getTopYachts();
      setYachts(data);
      setError(null);
    } catch (err) {
      dispatch(setLoading(false));
      setError('Failed to load yachts. Please try again later.');
      handleApiError(err as CustomError, dispatch, navigate);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchYachts();
  }, []);

  return { yachts, error, refetch: fetchYachts };
};



// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch } from '../redux/store/hook';
// import { yachtAPI } from '../api/yachts';
// import { handleApiError } from '../api/errorHandler';
// import { Yacht } from '../types/yachts';
// import { CustomError } from '../types/error';

// export const useTopYachts = () => {
//   const [yachts, setYachts] = useState<Yacht[]>([]);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const fetchYachts = async () => {
//     try {
//       setLoading(true);
//       const data = await yachtAPI.getTopYachts();
//       setYachts(data);
//     } catch (error) {
//       handleApiError(error as CustomError, dispatch, navigate);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchYachts();
//   }, []);

//   return { yachts, loading, refetch: fetchYachts };
// };