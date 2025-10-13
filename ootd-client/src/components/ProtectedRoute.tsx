import { Navigate } from 'react-router-dom';
import useUserStore from '../stores/useUserStore';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoggedIn } = useUserStore();

    if (!isLoggedIn) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;