import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "USER" | "ADMIN";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { user, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kj-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        );
    }

    if (user?.role === "ADMIN" && requiredRole !== "ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    if (requiredRole === "ADMIN" && user?.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
