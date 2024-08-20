import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
    const user = sessionStorage.getItem('User');

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default AuthGuard;
