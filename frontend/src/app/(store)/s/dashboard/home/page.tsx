"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'
import { config } from '@/lib/config';
import { copyToClipBoard } from '@/lib/utils';
import QRCode from "react-qr-code";
import { ArrowRight, Link, QrCode } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';


const HomePage = () => {
  const slug = useSearchParams().get("slug");
  const router = useRouter();
  const menuLink = `${config.frontend_url}/s?slug=${slug}`;
  const [qrDialogOpen, setQrDialogOpen] = useState(false);


  const downloadQRCode = useCallback(() => {
    const svg = document.getElementById("qr-code");
    if (!svg || !menuLink) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${slug}-menu-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }, [menuLink, slug]);


  return (
    <div className="space-y-6 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle><p className='flex items-center justify-start gap-2'>
              <Link className='h-5 w-5 text-blue-600 bg-blue-100 p-1 rounded ' />
              Your Menu Link
            </p></CardTitle>
            <CardDescription>
              <div className="text-sm text-muted-foreground">
                Share this link with your customers
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Input
                value={menuLink}
                readOnly
                disabled={!menuLink}
                className="flex-1 py-2 "
              />
              <div className=' w-full flex items-start gap-2'>
                <Button
                  onClick={() => {
                    copyToClipBoard(menuLink)
                  }}
                  variant="default"
                  className=' bg-green-600'
                  disabled={!menuLink}
                >
                  Copy Link
                </Button>
                <a href={menuLink} target="_blank" rel="noopener noreferrer">
                  <Button className=' bg-blue-600' variant="default" >
                    View Digital Menu
                  </Button>
                </a>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600" />
              Your QR Code
            </CardTitle>
            <CardDescription className="text-sm">
              Print or display this QR code for customers to scan your menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setQrDialogOpen(true)}
              disabled={!menuLink}
              className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
              aria-label="Show QR code"
            >
              Show QR Code
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Menu QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {menuLink && (
              <div className="p-4 w-40 h-40 bg-white rounded-lg flex items-center justify-center">
                <div className="scale-[0.15] origin-center">
                  <QRCode
                    id="qr-code"
                    value={`https://${menuLink}`}
                    size={1024}
                    level="H"
                    aria-label="QR Code for your menu"
                  />
                </div>
              </div>

            )}
            <div className="flex gap-2 w-full">
              <Button
                onClick={downloadQRCode}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!menuLink}
                aria-label="Download QR code"
              >
                Download QR Code
              </Button>
              <Button
                variant="outline"
                onClick={() => setQrDialogOpen(false)}
                className="flex-1"
                aria-label="Close dialog"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add Menu Items</CardTitle>
              <CardDescription className="mt-1">
                Add all your menu items
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <Button
              onClick={() => { router.push(`/s/dashboard/menu?slug=${slug}`) }}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
            >
              Go to Menu items page
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit your Restaurant Details</CardTitle>
              <CardDescription className="mt-1">
                Add details and change settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <Button
              onClick={() => { router.push(`/s/dashboard/setting?slug=${slug}`) }}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
            >
              Go to Settings Page
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage