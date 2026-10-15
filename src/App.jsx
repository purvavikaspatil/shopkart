import { BrowserRouter } from 'react-router-dom';
import AppProviders from '@/context/AppProviders';
import AppRoutes from '@/routes/AppRoutes';

/**
 * Application root.
 *
 * Router wraps the providers so context code (e.g. the toast that fires after
 * navigation) can use router hooks, and AppProviders installs the theme,
 * so every route renders inside both.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}
