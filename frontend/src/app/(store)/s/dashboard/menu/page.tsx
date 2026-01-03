"use client"
import { AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog'
import BouncingDotsLoader from '@/components/ui/bounce-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Box, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { MenuType } from '@/lib/types'
import { config } from '@/lib/config'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/context/auth-context/auth-context'
import { useRestaurant } from '@/lib/context/restaurant-context/use-restaurant'
import { defaultCurrency } from '@/lib/data'


const AllMenuItems = () => {
  const router = useRouter();
  const slug = useSearchParams().get("slug");
  const { token } = useAuth();
  const [products, setProducts] = useState<MenuType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productDeleteId, setProductDeleteId] = useState<number | null>(null);
  const restaurant = useRestaurant()
  const currencySymbol = restaurant?.settings?.currency?.symbol || defaultCurrency.symbol;


  useEffect(() => {
    getAllProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${config.backend_url}/api/menu/menuId/${productDeleteId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Menu item deleted successfully")
        getAllProducts()
      } else {
        toast.error("Failed to delete Menu item");
      }
    } catch (error) {
      console.log(error);

    } finally {
      setProductDeleteId(null)
    }
  }
  const getAllProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${config.backend_url}/api/menu/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        toast.error("Failed to get Menu item")
      } else {
        const data = await res.json();
        console.log("PROD", data)
        setProducts(data.menus);
      }

    } catch (error) {
      console.log(error);
      toast.error("Internal server error")
    } finally {
      setIsLoading(false);
    }

  }
  return (
    <div className="max-w-6xl mx-auto md:p-4 space-y-6">
      <Card>
        <CardHeader className="px-6 py-5 border-b">
          <div className='flex items-center justify-between'>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Box className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">
                  All Menu items
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Add and Update all your menu item here
                </CardDescription>
              </div>
            </div>
            <Button disabled={!!productDeleteId} onClick={() => router.push(`/s/dashboard/menu/add?slug=${slug}`)}>
              <Plus className=' w-4 h-4 mr-2' />
              Add Menu item
            </Button>
          </div>
        </CardHeader>
        {
          isLoading ?
            <BouncingDotsLoader />
            :
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length > 0 ? (
                      products.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.images.length > 0 ? (
                              <div className="relative h-12 w-12">
                                { // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-cover rounded"
                                  />}
                              </div>
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-center text-gray-500">No <br></br> Image</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {product.salePrice && product.salePrice > 0 ? (
                                <>
                                  <span className="text-gray-500 line-through">
                                    {currencySymbol}{Number(product.price).toFixed(2)}
                                  </span>
                                  <span className="font-medium">
                                    {currencySymbol}{Number(product.salePrice).toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span>  {currencySymbol}{Number(product.price).toFixed(2)}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">


                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  disabled={!!productDeleteId}
                                  onClick={() => {
                                    router.push(`/s/dashboard/menu/update?slug=${slug}&id=${product.id}`);
                                  }}
                                  variant={'outline'}
                                  className=' w-8 h-8 p-1 mr-2'
                                > <Pencil className=' text-blue-600' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Menu item</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip >
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => {
                                    setProductDeleteId(product.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  disabled={!!productDeleteId}
                                  variant={'outline'}
                                  className=' w-8 h-8 p-1 mr-2 '
                                >

                                  {
                                    productDeleteId === product.id ? <Loader2 className=' w-4 h-4 animate-spin' />
                                      :
                                      <Trash2 className=' text-red-600' />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent >
                                <p>Delete Menu item</p>
                              </TooltipContent>
                            </Tooltip>




                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No menu item found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
        }

      </Card>
      {  /* <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
        </CardHeader>
        <CardFooter className=' flex gap-3'>
          <Button
            disabled={isLoading}
            onClick={() => router.push(`/s/dashboard/menu/bulk-add?slug=${slug}`)}
          >
            <Plus />
            Add Product in Bulk
          </Button>
       
        </CardFooter>
      </Card> */}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the Menu item and
              remove it from your restaurant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setProductDeleteId(null)}
            >Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AllMenuItems