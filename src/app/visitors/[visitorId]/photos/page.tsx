'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export default function SitePhotosPage() {
  const { visitorId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!user || !visitorId) return;
      try {
        const photosCollection = collection(firestore, 'users', user.uid, 'visitors', visitorId as string, 'photos');
        const photoSnapshot = await getDocs(photosCollection);
        const photosList = photoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPhotos(photosList);
      } catch (error) {
        console.error("Error fetching photos: ", error);
        toast({
          variant: "destructive",
          title: "Failed to load photos",
          description: "Could not retrieve existing site photos.",
        });
      } finally {
        setIsLoadingPhotos(false);
      }
    };
    fetchPhotos();
  }, [user, visitorId, firestore, toast]);
  
  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
      getCameraPermission();
    } else {
        // Stop camera stream when dialog is closed
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [isCameraOpen, toast]);

  const uploadPhoto = async (dataUrl: string) => {
    if (!user || !visitorId) return;
    setIsUploading(true);

    try {
      const storageRef = ref(storage, `users/${user.uid}/visitors/${visitorId}/${new Date().getTime()}.jpg`);
      await uploadString(storageRef, dataUrl, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);

      const photosCollection = collection(firestore, 'users', user.uid, 'visitors', visitorId as string, 'photos');
      const newPhotoDoc = await addDoc(photosCollection, {
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
      });
      
      setPhotos(prev => [...prev, { id: newPhotoDoc.id, imageUrl: downloadURL }]);

      toast({
        title: "Photo Uploaded",
        description: "The site photo has been saved.",
      });
    } catch (error) {
      console.error("Error uploading photo: ", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not save the photo. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setIsCameraOpen(false);
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        uploadPhoto(dataUrl);
      }
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        uploadPhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <Header title="Site Photos" />
      <main className="flex-1 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Photos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="h-24 flex-col gap-2">
                        <Camera className="h-8 w-8" />
                        <span>Use Camera</span>
                    </Button>
                </DialogTrigger>
                 <DialogContent className="max-w-md">
                     <DialogHeader>
                         <DialogTitle>Live Camera</DialogTitle>
                     </DialogHeader>
                     <div className="flex flex-col gap-4">
                        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                           <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                           {hasCameraPermission === false && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                <Alert variant="destructive" className="w-auto">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Camera Access Denied</AlertTitle>
                                    <AlertDescription>
                                        Please enable camera permissions.
                                    </AlertDescription>
                                </Alert>
                            </div>
                           )}
                        </div>
                        <Button onClick={handleCapture} disabled={isUploading || hasCameraPermission !== true}>
                           {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                           Capture & Upload
                        </Button>
                        <canvas ref={canvasRef} className="hidden" />
                     </div>
                 </DialogContent>
             </Dialog>

            <Button variant="outline" size="lg" className="h-24 flex-col gap-2" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
              <span>Upload Photo</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Uploaded Photos</CardTitle>
            </CardHeader>
            <CardContent>
                 {isLoadingPhotos ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
                                <Image src={photo.imageUrl} alt="Site photo" layout="fill" objectFit="cover" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No photos uploaded yet.</p>
                        <p className="text-sm">Use the buttons above to add photos.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}