import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';
import { AppDispatch } from '../redux/store/store';
import { clearUserDetails } from '../redux/slices/userSlice';
import { CustomError } from '../types/error';

interface ErrorHandlerOptions {
  showToast?: boolean;
  redirect?: boolean;
}

export const handleApiError = (
  error: CustomError,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  options: ErrorHandlerOptions = { showToast: true, redirect: true }
) => {
  const { showToast = true, redirect = true } = options;
  const errorType = error?.type || 'UNEXPECTED_ERROR';
  const errorMessage = error?.message || 'An unexpected error occurred';

  const handleAuthError = () => {
    dispatch(clearUserDetails());
    if (redirect) {
      navigate('/login');
    }
    if (showToast) {
      toast.error('Unauthorized access. Please log in again.');
    }
  };

  const handleSessionExpired = () => {
    dispatch(clearUserDetails());
    if (redirect) {
      navigate('/session-expired');
    }
    if (showToast) {
      toast.error('Session expired. Please log in again.');
    }
  };

  const showErrorToast = (message: string) => {
    if (showToast) {
      toast.error(message);
    }
  };

  switch (errorType) {
    case 'VALIDATION_ERROR':
      showErrorToast('Validation error occurred. Please check your input.');
      break;

    case 'AUTH_ERROR':
      handleAuthError();
      break;

    case 'SESSION_EXPIRED':
      handleSessionExpired();
      break;

    case 'CONFLICT_ERROR':
      showErrorToast('Conflict detected: User already exists.');
      break;

    case 'SERVER_ERROR':
      showErrorToast('A server error occurred. Please try again later.');
      break;

    case 'NETWORK_ERROR':
      showErrorToast('Network error. Please check your internet connection.');
      break;

    case 'FORBIDDEN_ERROR':
      showErrorToast('Access denied. You do not have permission.');
      break;

    case 'NOT_FOUND':
      showErrorToast('The requested resource was not found.');
      break;

    default:
      showErrorToast(errorMessage);
      break;
  }
};