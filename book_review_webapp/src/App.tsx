import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import AppRoutes from './routing/AppRoutes';
import { AuthProvider } from './services/authContext';

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;