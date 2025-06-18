import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const AdminHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    // Handler untuk logout
    const handleLogout = async () => {
        try {
            await logout();
            // Redirect ke home page setelah logout berhasil
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-end">
            <div className="flex items-center gap-4">
                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 border-red-600"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </header>
    );
};

export default AdminHeader;
