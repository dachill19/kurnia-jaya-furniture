import { useState, useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { useLoadingStore } from '../stores/loadingStore';
import { useToast } from '../components/ui/use-toast';
import { ProductForm } from '../components/admin/ProductForm';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Trash2, Edit } from 'lucide-react';

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
  category?: { name: string };
}

export const AdminProductsPage = () => {
  const { products, getAllProducts, deleteProduct, error } = useProductStore();
  const { isLoadingKey } = useLoadingStore();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    }
  }, [error, toast]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast({ title: 'Success', description: 'Product deleted successfully' });
      } catch (err: any) {
        toast({ title: 'Error', description: err.message || 'Failed to delete product', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button onClick={() => { setSelectedProduct(null); setIsFormOpen(true); }}>
          Add Product
        </Button>
      </div>

      {isLoadingKey('all-products') ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={product.product_image?.find(img => img.is_main)?.image_url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="mt-2">Price: Rp {product.price.toLocaleString()}</p>
                {product.discount_price && (
                  <p>Discount: Rp {product.discount_price.toLocaleString()}</p>
                )}
                <p>Stock: {product.stock}</p>
                <p>Category: {product.category?.name || 'N/A'}</p>
                <p>Hot Product: {product.is_hot ? 'Yes' : 'No'}</p>
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSelectedProduct(product); setIsFormOpen(true); }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    disabled={isLoadingKey('delete-product')}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};