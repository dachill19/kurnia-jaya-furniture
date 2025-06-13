import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="container-custom py-16 text-center">
            <div className="text-center max-w-md mx-auto">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Maaf, halaman yang Anda cari tidak ditemukan.
                </p>
                <Button asChild>
                    <Link to="/">
                        <ChevronLeft size={16} className="mr-2" />
                        Kembali ke Beranda
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
