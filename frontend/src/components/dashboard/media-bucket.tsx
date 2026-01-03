import { ImageIcon, Loader2, Trash2, UploadCloud, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner';
import type { ImageType } from '@/lib/types';
import { config } from '@/lib/config';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context/auth-context';

interface ImageBucketProps {
    onSelect: (url: string) => void;
    text?: string
}

interface UploadFile {
    file: File;
    id: string;
    status: 'pending' | 'uploading' | 'completed' | 'error';
}

export function ImageBucket({ onSelect, text = "Select Image" }: ImageBucketProps) {
    const slug = useSearchParams().get("slug")
    const [images, setImages] = useState<ImageType[]>([]);
    const [open, setOpen] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const { token } = useAuth();

    const fetchImages = async () => {
        try {
            setFetching(true);
            const res = await fetch(`${config.backend_url}/api/file/${slug}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });
            if (!res.ok) throw new Error("Failed to fetch images");
            const data = await res.json();
            setImages(data.images);
        } catch (error) {
            console.error("Error fetching images:", error);
            toast.error("Failed to fetch images");
        } finally {
            setFetching(false);
        }
    };

    const uploadSingleImage = async (uploadFile: UploadFile): Promise<boolean> => {
        try {
            const formData = new FormData();
            formData.append('file', uploadFile.file);

            const response = await fetch(`${config.backend_url}/api/file/${slug}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Upload error:', error);
            return false;
        }
    };

    const uploadImages = async () => {
        if (files.length === 0) return;
        
        try {
            setUploading(true);
            setErrorMessage("");
            
            // Filter out files that are already completed or have errors
            const filesToUpload = files.filter(f => f.status === 'pending');
            
            let successCount = 0;
            let errorCount = 0;

            // Update all files to uploading status
            setFiles(prev => prev.map(f => 
                filesToUpload.some(uf => uf.id === f.id) 
                    ? { ...f, status: 'uploading' }
                    : f
            ));

            // Upload files sequentially
            for (const uploadFile of filesToUpload) {
                const success = await uploadSingleImage(uploadFile);
                
                if (success) {
                    setFiles(prev => prev.map(f => 
                        f.id === uploadFile.id ? { ...f, status: 'completed' } : f
                    ));
                    successCount++;
                } else {
                    setFiles(prev => prev.map(f => 
                        f.id === uploadFile.id ? { ...f, status: 'error' } : f
                    ));
                    errorCount++;
                }
            }

            // Refresh the image list after all uploads
            clearCompletedFiles();
            await fetchImages();

            // Show summary toast
            if (successCount > 0) {
                toast.success(`Successfully uploaded ${successCount} image(s)`);
            }
            if (errorCount > 0) {
                toast.error(`Failed to upload ${errorCount} image(s)`);
            }

        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (id: string, url: string) => {
        try {
            setDeletingId(id);
            setErrorMessage("");
            const res = await fetch(`${config.backend_url}/api/file/${slug}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "DELETE",
                body: JSON.stringify({ url })
            });

            if (res.ok) {
                await fetchImages();
                toast.success("Image deleted successfully");
            } else {
                toast.error("Failed to delete image");
            }
        } catch (error) {
            setErrorMessage(`${error}`)
            console.error(error);
            toast.error("Failed to delete image");
        } finally {
            setDeletingId(null)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        
        if (selectedFiles.length === 0) return;

        const validFiles: UploadFile[] = [];
        const invalidFiles: string[] = [];

        selectedFiles.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                invalidFiles.push(file.name);
            } else {
                validFiles.push({
                    file,
                    id: Math.random().toString(36).substr(2, 9),
                    status: 'pending'
                });
            }
        });

        if (invalidFiles.length > 0) {
            toast.error(`Files too large (max 5MB): ${invalidFiles.join(', ')}`);
        }

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
        }

        // Reset input value to allow selecting same files again
        e.target.value = '';
    }

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    }

    const clearAllFiles = () => {
        setFiles([]);
    }

    const clearCompletedFiles = () => {
        setFiles(prev => prev.filter(f => f.status !== 'completed' && f.status !== 'error'));
    }

    useEffect(() => {
        if (open) {
            fetchImages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const pendingCount = files.filter(f => f.status === 'pending').length;
    const uploadingCount = files.filter(f => f.status === 'uploading').length;
    const completedCount = files.filter(f => f.status === 'completed').length;
    const errorCount = files.filter(f => f.status === 'error').length;

    const getStatusIcon = (status: UploadFile['status']) => {
        switch (status) {
            case 'uploading':
                return <Loader2 className="w-3 h-3 animate-spin" />;
            case 'completed':
                return <CheckCircle className="w-3 h-3 text-green-600" />;
            case 'error':
                return <XCircle className="w-3 h-3 text-red-600" />;
            default:
                return null;
        }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            {text}
        </Button>
    </DialogTrigger>
    <DialogContent className="max-w-4xl w-[calc(100%-2rem)] sm:w-full h-[90vh] flex flex-col">
        <DialogHeader className="px-1 sm:px-0">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                Image Gallery
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
                Upload new images or select from your existing collection
            </DialogDescription>
        </DialogHeader>

        <div className="flex-1 h-auto overflow-y-auto px-1 sm:px-0">
            <div className="flex flex-col gap-6 pb-4">
                
                {/* Upload Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="mb-4">
                        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                            <UploadCloud className="w-5 h-5" />
                            Add New Images
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                            Upload images from your computer
                        </p>
                    </div>
                    
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
                        {/* File Input */}
                        <div className="relative w-full">
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="cursor-pointer text-sm border-blue-300 focus:border-blue-500"
                                id="image-upload"
                                multiple
                            />
                            <label
                                htmlFor="image-upload"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={uploadImages}
                                disabled={uploading || pendingCount === 0}
                                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4 mr-2" />
                                        Upload {pendingCount > 0 && `(${pendingCount})`}
                                    </>
                                )}
                            </Button>
                            
                            {files.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={clearAllFiles}
                                    disabled={uploading}
                                    className="sm:flex-none border-blue-300 text-blue-700 hover:bg-blue-100"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {/* Help Text */}
                    <p className="text-xs text-blue-600 mt-3">
        Supported formats: JPG, PNG, GIF, WEBP • Max file size: 5MB
      </p>
                </div>

                {/* Upload Progress */}
                {files.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Upload Progress</h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>Ready: {pendingCount}</span>
                            </div>
                            {uploadingCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                                    <span className="text-orange-600">Uploading: {uploadingCount}</span>
                                </div>
                            )}
                            {completedCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-green-600">Completed: {completedCount}</span>
                                </div>
                            )}
                            {errorCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-red-600">Failed: {errorCount}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="flex items-center p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errorMessage}
                    </div>
                )}

                {/* File Previews */}
                {files.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Selected Files</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                            {files.map((uploadFile) => (
                                <div key={uploadFile.id} className={`p-3 border rounded-lg flex items-center gap-3 ${
                                    uploadFile.status === 'completed' ? 'bg-green-50 border-green-200' :
                                    uploadFile.status === 'error' ? 'bg-red-50 border-red-200' :
                                    uploadFile.status === 'uploading' ? 'bg-orange-50 border-orange-200' :
                                    'bg-blue-50 border-blue-200'
                                }`}>
                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden flex-shrink-0 border">
                                        {// eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={URL.createObjectURL(uploadFile.file)}
                                            alt="Preview"
                                            className="object-cover w-full h-full"
                                        />}
                                        <div className="absolute top-1 right-1">
                                            {getStatusIcon(uploadFile.status)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{uploadFile.file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <p className={`text-xs capitalize ${
                                            uploadFile.status === 'completed' ? 'text-green-600' :
                                            uploadFile.status === 'error' ? 'text-red-600' :
                                            uploadFile.status === 'uploading' ? 'text-orange-600' :
                                            'text-blue-600'
                                        }`}>
                                            {uploadFile.status === 'pending' && 'Ready to upload'}
                                            {uploadFile.status === 'uploading' && 'Uploading...'}
                                            {uploadFile.status === 'completed' && 'Upload successful'}
                                            {uploadFile.status === 'error' && 'Upload failed'}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFile(uploadFile.id)}
                                        disabled={uploadFile.status === 'uploading'}
                                        className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Gallery */}
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Your Image Collection
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Click on any image to select it
                        </p>
                    </div>
                    
                    {fetching ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                            ))}
                        </div>
                    ) : images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-500 p-6">
                            <ImageIcon className="w-16 h-16" strokeWidth={1} />
                            <p className="text-center font-medium">No images in your collection yet</p>
                            <p className="text-sm text-center text-gray-400">
                                Upload your first image using the section above
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                            {images.map((img) => (
                                <div
                                    key={img.id}
                                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <button
                                        onClick={() => {
                                            onSelect(img.url);
                                            setOpen(false);
                                        }}
                                        className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                                        title="Click to select this image"
                                    >
                                        {// eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={img.url}
                                            alt="Gallery image"
                                            className="object-cover w-full h-full"
                                            loading="lazy"
                                        />}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs truncate">Click to select</p>
                                        </div>
                                    </button>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteImage(img.id, img.url);
                                                }}
                                                disabled={deletingId === img.id}
                                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-red-500 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                {deletingId === img.id ? (
                                                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                )}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Delete image</TooltipContent>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Footer Help Text */}
        <div className="border-t border-gray-200 pt-3 mt-2">
            <p className="text-xs text-gray-500 text-center">
                💡 Tip: You can upload multiple images at once and click any image to select it
            </p>
        </div>
    </DialogContent>
</Dialog>
    )
}

export default ImageBucket