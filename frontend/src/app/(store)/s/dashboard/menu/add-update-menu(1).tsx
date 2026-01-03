import ImageBucket from '@/components/dashboard/media-bucket'
import BouncingDotsLoader from '@/components/ui/bounce-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { config } from '@/lib/config'
import { useAuth } from '@/lib/context/auth-context/auth-context'
import { useRestaurant } from '@/lib/context/restaurant-context/use-restaurant'
import { defaultCurrency } from '@/lib/data'
import type { CategoryType, VariantType } from '@/lib/types'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const AddUpdateMenu = ({ slug, id }: { slug: string, id?: number }) => {
    const { token } = useAuth();
    const isEditMode = !!id;
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [newCategory, setNewCategory] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const [type, setType] = useState("simple");
    const [link, setLink] = useState("");
    const [unit, setUnit] = useState("");
    const [minOrder, setMinOrder] = useState(1);
    const [stock, setStock] = useState(-1);

    const [categoryLoading, setCategoryLoading] = useState(false);
    const [newCategoryLoading, setNewCategoryLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // variants
    const [variant, setVariant] = useState<VariantType[]>([]);
    const [variantType, setVariantType] = useState("");
    const [variantValue, setVariantValue] = useState("");
    const [variantPrice, setVariantPrice] = useState(0);

    const restaurant = useRestaurant()
    const currencySymbol = restaurant?.settings?.currency?.symbol || defaultCurrency.symbol;


    // --- add/remove variant ---
    const addVariant = () => {
        if (!variantType || !variantValue) {
            toast.error("Please enter variant type and value");
            return;
        }
        setVariant(prev => [...prev, { type: variantType, value: variantValue, price: variantPrice }]);
        setVariantType("");
        setVariantValue("");
        setVariantPrice(0);
    }

    const removeVariant = (i: number) => {
        setVariant(prev => prev.filter((_, idx) => idx !== i));
    }

    const handleImageDelete = (url: string) => {
        setImages(prev => prev.filter((i) => i !== url))
    }

    const toogleCategory = (id: number) => {
        setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])
    }

    const getProductDetails = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${config.backend_url}/api/menu/menuId/${id}`);
            if (!res.ok) {
                toast.error("Failed to load Product data");
            } else {
                const data = await res.json();
                const p = data;

                setImages(p.images ?? []);
                setName(p.name ?? "");
                setDescription(p.description ?? "");
                setPrice(p.price ?? 0);
                setType(p.type ?? "simple");
                setLink(p.link ?? "");
                setSalePrice(p.salePrice ?? 0);
                setSelectedCategories(p.categories ?? []);
                setVariant(p.variants ?? []);
                setMinOrder(p.minOrder ?? 1);
                setUnit(p.unit ?? "");
                setStock(p.stock ?? -1);
            }
        } catch (error) {
            console.log("ERROR", error);
            toast.error("Internal server error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await getAllCategory();
            if (isEditMode) {
                await getProductDetails();
            }
            setIsLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, id]);

    const addNewCategory = async () => {
        try {
            setNewCategoryLoading(true);
            setIsUpdating(true);
            if (!newCategory) {
                toast.error("Please add a Category Name")
            } else {
                const res = await fetch(`${config.backend_url}/api/category/${slug}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ name: newCategory.trim() })
                })
                if (!res.ok) {
                    toast.error("Failed to add new category")
                } else {
                    toast.success("Category added successfully");
                    setNewCategory("");
                    getAllCategory()
                }
            }

        } catch (error) {
            console.log(error)
        } finally {
            setNewCategoryLoading(false);
            setIsUpdating(false);
        }
    }

    const getAllCategory = async () => {
        try {
            setCategoryLoading(true)
            const res = await fetch(`${config.backend_url}/api/category/${slug}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
            );

            const data = await res.json();
            setCategories(data.categories);
        } catch (error) {
            console.log(error);
            toast.error("Failed to get all categories");
        } finally {
            setCategoryLoading(false)
        }
    }

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            if (selectedCategories.length === 0) {
                toast.error("Please select any category")
                return
            }
            const res = await fetch(
                isEditMode ? `${config.backend_url}/api/menu/menuId/${id}` : `${config.backend_url}/api/menu/${slug}`
                , {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    method: isEditMode ? "PUT" : "POST",
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        images: images,
                        price: price,
                        salePrice: salePrice,
                        type: type,
                        categories: selectedCategories,
                        variants: type === 'variant' ? variant : [],
                        link: type === 'affiliate' ? link : "",
                        minOrder: minOrder,
                        stock: stock,
                        unit: unit
                    })
                });

            if (!res.ok) {
                toast.error(isEditMode ? "Failed to update menu" : "Failed to create menu");
            } else {
                toast.success(isEditMode ? "Menu item updated successfully" : "Menu item added successfully");
                router.push(`/s/dashboard/menu?slug=${slug}`)
            }
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? "Failed to update menu" : "Failed to create menu");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <form onSubmit={handleAddProduct} className='w-full p-2 sm:p-4 max-w-6xl mx-auto'>
            {
                isLoading ? <BouncingDotsLoader /> : <>
                    <Card className='w-full'>
                        <CardHeader className='pb-4'>
                            <CardTitle className='text-lg sm:text-xl font-bold'>
                                {isEditMode ? 'Update Menu Item' : 'Add New Menu Item'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {/* Images */}
                            <div className='space-y-3'>
                                <Label className='block font-medium text-sm sm:text-base'>Menu Item Images</Label>
                                <ImageBucket text='Upload and Select Images' onSelect={(url) => { setImages((prev) => [...prev, url]) }} />

                                {images.length > 0 && (
                                    <div className='flex flex-wrap gap-2 mt-3'>
                                        {images.map((url, i) => (
                                            <div key={i} className='relative w-20 h-20 sm:w-32 sm:h-32 rounded-md overflow-hidden border'>
                                                {   // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={url}
                                                        alt='product'
                                                        className='w-full h-full object-cover'
                                                    />}
                                                <Button
                                                    variant={'destructive'}
                                                    size='sm'
                                                    className='absolute top-1 right-1 w-6 h-6 p-0'
                                                    onClick={() => handleImageDelete(url)}
                                                    type='button'
                                                >
                                                    <Trash2 className='w-3 h-3' />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div className='space-y-2'>
                                <Label className='block font-medium text-sm sm:text-base'>Menu Item Name</Label>
                                <Input
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Enter menu item name'
                                    value={name}
                                    required
                                    className='text-sm sm:text-base'
                                />
                            </div>

                            {/* Description */}
                            <div className='space-y-2'>
                                <Label className='block font-medium text-sm sm:text-base'>Menu Item Description</Label>
                                <Textarea
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder='Enter Menu Item description'
                                    value={description}
                                    rows={4}
                                    className='text-sm sm:text-base resize-vertical min-h-[100px]'
                                />
                            </div>

                            {/* Price and Sale Price */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label className='block font-medium text-sm sm:text-base'>Price</Label>
                                    <Input
                                        type='number'
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        placeholder='Product Price'
                                        value={price}
                                        required
                                        className='text-sm sm:text-base'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className='block font-medium text-sm sm:text-base'>Sale Price</Label>
                                    <Input
                                        type='number'
                                        onChange={(e) => setSalePrice(Number(e.target.value))}
                                        placeholder='Sale Price'
                                        value={salePrice}
                                        className='text-sm sm:text-base'
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className='space-y-4'>
                                <Label className='font-medium text-sm sm:text-base block'>Categories</Label>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border rounded-lg'>
                                    {categories.length > 0 ? categories.map((cat) => (
                                        <Label key={cat.id} className='flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer'>
                                            <Input
                                                type='checkbox'
                                                className='w-4 h-4'
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => toogleCategory(cat.id)}
                                            />
                                            <span className='text-sm'>{cat.name}</span>
                                        </Label>
                                    )) : <p className=' flex items-start justify-center text-sm'>No categories avilable please add one</p>}
                                </div>

                                <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
                                    <Input
                                        className='flex-1 text-sm sm:text-base'
                                        placeholder='Add new category'
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        disabled={newCategoryLoading}
                                    />
                                    <Button
                                        type='button'
                                        disabled={newCategoryLoading || !newCategory.trim()}
                                        onClick={addNewCategory}
                                        className='w-full sm:w-auto'
                                    >
                                        {newCategoryLoading ? (
                                            <>
                                                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Category'
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Product Type */}
                            <div className='p-4 rounded-lg border bg-gray-50/50'>
                                <Label className='block font-medium text-sm sm:text-base mb-4'>Menu Item Type</Label>
                                <Tabs value={type} onValueChange={setType}>
                                    <TabsList className='grid w-full grid-cols-2 mb-4'>
                                        <TabsTrigger value='simple' className='text-xs sm:text-sm'>Simple</TabsTrigger>
                                        <TabsTrigger value='variant' className='text-xs sm:text-sm'>Variant</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value='variant' className='space-y-4'>
                                        <Label className='block font-medium text-sm sm:text-base'>Menu Item Variants</Label>
                                        <div className='flex flex-col sm:flex-row gap-2 mb-4'>
                                            <Input
                                                placeholder='Type (e.g. Size, Color)'
                                                value={variantType}
                                                onChange={(e) => setVariantType(e.target.value)}
                                                className='flex-1 text-sm'
                                            />
                                            <Input
                                                placeholder='Value (e.g. XL, Red)'
                                                value={variantValue}
                                                onChange={(e) => setVariantValue(e.target.value)}
                                                className='flex-1 text-sm'
                                            />
                                            <Input
                                                type='number'
                                                placeholder='Price'
                                                value={variantPrice}
                                                onChange={(e) => setVariantPrice(Number(e.target.value))}
                                                className='w-24 text-sm'
                                            />
                                            <Button
                                                type='button'
                                                onClick={addVariant}
                                                className='w-full sm:w-auto'
                                            >
                                                Add
                                            </Button>
                                        </div>

                                        {variant.length > 0 && (
                                            <div className='space-y-2'>
                                                {variant.map((v, i) => (
                                                    <div key={i} className='flex justify-between items-center p-3 border rounded-lg bg-white'>
                                                        <span className='text-sm'>
                                                            {v.type}: {v.value} — {currencySymbol}{v.price}
                                                        </span>
                                                        <Button
                                                            size='sm'
                                                            variant='destructive'
                                                            onClick={() => removeVariant(i)}
                                                            type='button'
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value='affiliate' className='space-y-2'>
                                        <Label className='block font-medium text-sm sm:text-base'>Affiliate Link</Label>
                                        <Input
                                            placeholder='https://example.com/product'
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            className='text-sm sm:text-base'
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* Settings Sections */}
                            <div className='space-y-4'>
                                {/* Minimum Order */}
                                {/* <div className="rounded-lg border p-4 bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm sm:text-base text-gray-800">Minimum Order Quantity</p>
                                            <p className="text-xs sm:text-sm text-gray-500">Set minimum quantity for order</p>
                                        </div>
                                        <Switch
                                            checked={minOrder > 1}
                                            onCheckedChange={(checked) => setMinOrder(checked ? 2 : 1)}
                                        />
                                    </div>

                                    {minOrder > 1 && (
                                        <div className="space-y-2 pl-0 sm:pl-11">
                                            <Label htmlFor="min-order" className="text-sm font-medium">
                                                Minimum Quantity
                                            </Label>
                                            <Input
                                                type="number"
                                                id="min-order"
                                                value={minOrder}
                                                onChange={(e) => setMinOrder(Number(e.target.value))}
                                                placeholder="Enter minimum quantity"
                                                className="bg-white text-sm"
                                                min={1}
                                            />
                                        </div>
                                    )}
                                </div> */}

                                {/* Unit */}
                                {/* <div className="rounded-lg border p-4 bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm sm:text-base text-gray-800">Product Unit</p>
                                            <p className="text-xs sm:text-sm text-gray-500">Set measurement unit for product</p>
                                        </div>
                                        <Switch
                                            checked={unit !== ""}
                                            onCheckedChange={(checked) => setUnit(checked ? "pcs" : "")}
                                        />
                                    </div>

                                    {unit !== "" && (
                                        <div className="space-y-2 pl-0 sm:pl-11">
                                            <Label htmlFor="unit" className="text-sm font-medium">
                                                Unit Name
                                            </Label>
                                            <Input
                                                id="unit"
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                                placeholder="e.g., pcs, kg, pack"
                                                className="bg-white text-sm"
                                            />
                                        </div>
                                    )}
                                </div> */}

                                {/* Stock Management */}
                                {/* <div className="rounded-lg border p-4 bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm sm:text-base text-gray-800">Stock Management</p>
                                            <p className="text-xs sm:text-sm text-gray-500">Manage product inventory</p>
                                        </div>
                                        <Switch
                                            checked={stock !== -1}
                                            onCheckedChange={(checked) => setStock(checked ? 1 : -1)}
                                        />
                                    </div>

                                    {stock !== -1 && (
                                        <div className="space-y-2 pl-0 sm:pl-11">
                                            <Label htmlFor="stock" className="text-sm font-medium">
                                                Stock Quantity
                                            </Label>
                                            <Input
                                                type="number"
                                                id="stock"
                                                value={stock}
                                                onChange={(e) => setStock(Number(e.target.value))}
                                                placeholder="Enter stock quantity"
                                                className="bg-white text-sm"
                                                min={0}
                                            />
                                        </div>
                                    )}
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className='mt-6 flex flex-col-reverse sm:flex-row gap-3 items-center justify-end'>
                        <Button
                            type='button'
                            disabled={isUpdating}
                            onClick={() => router.push(`/s/dashboard/menu?slug=${slug}`)}
                            variant={'outline'}
                            className='w-full sm:w-auto border-gray-300'
                        >
                            Cancel
                        </Button>

                        <Button
                            type='submit'
                            disabled={isUpdating || categoryLoading}
                            className='w-full sm:w-auto'
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                    {isEditMode ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                isEditMode ? "Update Menu Item" : "Add Menu Item"
                            )}
                        </Button>
                    </div>
                </>
            }
        </form>
    )
}

export default AddUpdateMenu