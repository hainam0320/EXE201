import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(currentUser.role)) {
        // Chuyển hướng đến trang chủ nếu không có quyền truy cập
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;