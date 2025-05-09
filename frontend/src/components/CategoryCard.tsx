import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { kebabCase } from "lodash";

interface CategoryCardProps {
    id: string;
    name: string;
    imageUrl: string;
    productCount: number;
}

const CategoryCard = ({
    id,
    name,
    imageUrl,
    productCount,
}: CategoryCardProps) => {
    return (
        <Link to={`/categories/${kebabCase(name)}`} className="block group">
            <motion.div
                className="relative h-80 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-serif font-bold">
                        {name}
                    </h3>
                    <p className="text-white/90 text-sm mt-1">
                        {productCount} products
                    </p>

                    <motion.div
                        className="mt-4 bg-white/20 backdrop-blur-sm w-fit px-4 py-2 rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.05 }}
                    >
                        Browse Collection
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
};

export default CategoryCard;
