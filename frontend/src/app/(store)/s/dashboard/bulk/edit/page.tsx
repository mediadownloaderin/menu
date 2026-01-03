"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/lib/config";
import { Label } from "@/components/ui/label";
import ImageBucket from "@/components/dashboard/media-bucket";
import { Trash2, Link as LinkIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context/auth-context";

interface EditProduct {
  id: number;
  name: string;
  price: number | "";
  images: string[];
  categories: number[];
}

interface CategoryType {
  id: number;
  name: string;
}

export default function BulkEditPage() {
  const router = useRouter();
  const slug = useSearchParams().get("slug");
  const { token } = useAuth();
  const [products, setProducts] = useState<EditProduct[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
  const [showCategories, setShowCategories] = useState(true);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/category/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, [slug, token]);

  // fetch existing products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.backend_url}/api/menu/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(data.menus || []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug, token]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (index: number, field: keyof EditProduct, value: any) => {
    const newProducts = [...products];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newProducts[index] as any)[field] = value;
    setProducts(newProducts);
  };

  const toggleCategory = (pIndex: number, catId: number) => {
    const newProducts = [...products];
    if (newProducts[pIndex].categories.includes(catId)) {
      newProducts[pIndex].categories = newProducts[pIndex].categories.filter(
        (id) => id !== catId
      );
    } else {
      newProducts[pIndex].categories.push(catId);
    }
    setProducts(newProducts);
  };

  const addImage = (pIndex: number, url: string) => {
    const newProducts = [...products];
    newProducts[pIndex].images.push(url);
    setProducts(newProducts);
  };

  const removeImage = (pIndex: number, url: string) => {
    const newProducts = [...products];
    newProducts[pIndex].images = newProducts[pIndex].images.filter(
      (i) => i !== url
    );
    setProducts(newProducts);
  };

  const handleImageUrlChange = (productIndex: number, productId: number, url: string) => {
    setImageUrls((prev) => ({ ...prev, [productId]: url }));
    
    // Auto-add image when a valid URL is detected
    if (url?.trim()) {
      try {
        new URL(url); // Validate URL
        
        // Check if it looks like an image URL
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const isImageUrl = imageExtensions.some(ext => url.toLowerCase().includes(ext));
        
        if (isImageUrl) {
          // Small delay to allow user to finish pasting
          const timeoutId = setTimeout(() => {
            if (imageUrls[productId] === url) {
              addImage(productIndex, url);
              setImageUrls((prev) => ({ ...prev, [productId]: "" }));
              toast.success("Image added successfully");
            }
          }, 300);
          
          return () => clearTimeout(timeoutId);
        }
      } catch {
        // Not a valid URL, do nothing
      }
    }
  };

  const handleImageUrlBlur = (productIndex: number, productId: number) => {
    const url = imageUrls[productId];
    if (!url?.trim()) return;

    // Try to add image on blur if it's a valid URL
    try {
      new URL(url);
      addImage(productIndex, url);
      setImageUrls((prev) => ({ ...prev, [productId]: "" }));
      toast.success("Image added successfully");
    } catch {
      // Not a valid URL, do nothing
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${config.backend_url}/api/menu/${slug}/bulk`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(products),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success("Products updated successfully");
      router.push(`/${slug}/dashboard/products`);
    } catch (error) {
      console.error("Bulk update failed:", error);
      toast.error("Bulk update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <BouncingDotsLoader />;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bulk Edit Products</h1>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center gap-2"
        >
          {showCategories ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showCategories ? "Hide Categories" : "Show Categories"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {products.map((product, index) => (
            <div key={product.id} className="space-y-3 border p-4 rounded-lg">
              {/* Product Images */}
              {product.images.length > 0 ? (
                <div className="flex flex-wrap gap-3 mb-2">
                  {product.images.map((url, i) => (
                    <div
                      key={`${product.id}-${i}`}
                      className="relative w-24 h-24 rounded border overflow-hidden"
                    >
                      {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                        src={url}
                        alt="product"
                        className="w-full h-full object-cover"
                      />}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => removeImage(index, url)}
                        type="button"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                // Show input for adding image URL when product has no images
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Paste image URL to add automatically
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Paste image URL here (auto-adds)"
                        value={imageUrls[product.id] || ""}
                        onChange={(e) =>
                          handleImageUrlChange(index, product.id, e.target.value)
                        }
                        onBlur={() => handleImageUrlBlur(index, product.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleImageUrlBlur(index, product.id);
                          }
                        }}
                        className={`flex-1 pr-16 ${
                          (imageUrls[product.id]?.length || 0) > 50 
                            ? 'border-red-500 focus-visible:ring-red-500' 
                            : ''
                        }`}
                      />
                      {imageUrls[product.id] && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <span className={`text-xs ${
                            (imageUrls[product.id]?.length || 0) > 50 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-500'
                          }`}>
                            {imageUrls[product.id]?.length || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Paste any valid image URL (jpg, png, gif, webp, svg)
                    </p>
                    {imageUrls[product.id] && (
                      <p className={`text-xs ${
                        (imageUrls[product.id]?.length || 0) > 50 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {(imageUrls[product.id]?.length || 0) > 50 
                          ? 'URL exceeds 50 characters' 
                          : `${50 - (imageUrls[product.id]?.length || 0)} chars remaining`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 items-center">
                <Input
                  placeholder="Product Name"
                  value={product.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
                <ImageBucket onSelect={(url) => addImage(index, url)} />
              </div>

              {/* Categories - Conditionally rendered */}
              {showCategories && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <Label
                      key={cat.id}
                      className="flex items-center gap-2 p-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={product.categories.includes(cat.id)}
                        onChange={() => toggleCategory(index, cat.id)}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </Label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <Button
              type="button"
              className="bg-blue-600 text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save All"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}