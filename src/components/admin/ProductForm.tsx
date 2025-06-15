import { useState, useEffect } from "react";
import { useProductStore } from "@/stores/productStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_price: number | null;
    stock: number;
    category_id: string;
    is_hot: boolean;
    product_image?: { image_url: string; is_main: boolean }[];
}

interface ProductFormProps {
    product?: Product;
    onClose?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    product,
    onClose,
}) => {
    const { categories, createProduct, updateProduct, getCategories } =
        useProductStore();
    const { isLoadingKey } = useLoadingStore();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        discount_price: product?.discount_price || null,
        stock: product?.stock || 0,
        category_id: product?.category_id || "",
        is_hot: product?.is_hot || false,
    });
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        product?.product_image?.map((img) => img.image_url) || []
    );

    useEffect(() => {
        if (categories.length === 0) {
            getCategories();
        }
    }, [categories, getCategories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                discount_price: formData.discount_price
                    ? Number(formData.discount_price)
                    : null,
                stock: Number(formData.stock),
                category_id: formData.category_id,
                is_hot: formData.is_hot,
            };

            if (product) {
                await updateProduct(product.id, productData, images);
                toast({
                    title: "Success",
                    description: "Product updated successfully",
                });
            } else {
                await createProduct(productData, images);
                toast({
                    title: "Success",
                    description: "Product created successfully",
                });
            }
            onClose?.();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save product",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6 p-1">
                <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        placeholder="Enter product description"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                price: Number(e.target.value),
                            })
                        }
                        placeholder="Enter price"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="discount_price">
                        Discount Price (Optional)
                    </Label>
                    <Input
                        id="discount_price"
                        type="number"
                        value={formData.discount_price || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                discount_price: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                            })
                        }
                        placeholder="Enter discount price"
                    />
                </div>
                <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                stock: Number(e.target.value),
                            })
                        }
                        placeholder="Enter stock quantity"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={formData.category_id}
                        onValueChange={(value) =>
                            setFormData({ ...formData, category_id: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is_hot"
                        checked={formData.is_hot}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_hot: !!checked })
                        }
                    />
                    <Label htmlFor="is_hot">Mark as Hot Product</Label>
                </div>
                <div>
                    <Label htmlFor="images">Product Images</Label>
                    <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        {imagePreviews.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt="Preview"
                                className="w-full h-24 object-cover rounded"
                            />
                        ))}
                    </div>
                </div>
                <div className="flex space-x-2 sticky bottom-0 bg-white pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={
                            isLoadingKey("create-product") ||
                            isLoadingKey("update-product")
                        }
                    >
                        {isLoadingKey("create-product") ||
                        isLoadingKey("update-product")
                            ? "Saving..."
                            : product
                            ? "Update Product"
                            : "Create Product"}
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
