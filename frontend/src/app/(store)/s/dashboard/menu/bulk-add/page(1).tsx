"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/lib/config";
import { Label } from "@/components/ui/label";
import ImageBucket from "@/components/dashboard/media-bucket";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

interface BulkProduct {
  name: string;
  price: number | "";
  images: string[];
  categories: number[];
}

interface CategoryType {
  id: number;
  name: string;
}

export default function BulkUploadPage() {
  const slug = useSearchParams().get("slug");
  const { token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<BulkProduct[]>([
    { name: "", price: "", images: [], categories: [] },
  ]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

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

  // handle changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (index: number, field: keyof BulkProduct, value: any) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
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

  const addRow = () => {
    setProducts([...products, { name: "", price: "", images: [], categories: [] }]);
  };

  const removeRow = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.backend_url}/api/menu/${slug}/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(
          products.map((p) => ({
            name: p.name,
            price: Number(p.price) || 0,
            images: p.images,
            categories: p.categories,
          }))
        ),
      });

      if (!res.ok) throw new Error("Upload failed");
      router.push(`/s/dashboard/menu?slug=${slug}`);
    } catch (error) {
      console.error("Bulk upload failed:", error);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Bulk Upload Menu items</h1>

      <Card>
        <CardContent className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="space-y-3 border p-4 rounded-lg">
              {/* Product Images (above name/price) */}
              {product.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-2">
                  {product.images.map((url, i) => (
                    <div
                      key={`${index}-${i}`}
                      className="relative w-24 h-24 rounded border overflow-hidden"
                    >
                    {  // eslint-disable-next-line @next/next/no-img-element
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeRow(index)}
                  disabled={products.length === 1}
                >
                  Remove
                </Button>
              </div>

              {/* Categories */}
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
            </div>
          ))}

          <div className="flex gap-3">
            <Button type="button" onClick={addRow}>
              + Add Another Menu item
            </Button>
            <Button
              type="button"
              className="bg-blue-600 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload All"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}