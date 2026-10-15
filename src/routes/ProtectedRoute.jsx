import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks';

/**
 * Gate for pages that need a signed-in user. Unauthenticated visitors are sent
 * to /login with the attempted path in `state.from` so login can bounce back.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  // Wait for the stored session to load before deciding, to avoid a flash
  // redirect on refresh.
  if (booting) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
