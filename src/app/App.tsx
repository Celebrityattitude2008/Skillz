import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from '../lib/auth-context';
import { ThemeProvider } from '../lib/theme-context';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
