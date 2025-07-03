import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useCheckDisease } from '../api/CheckDisease';
import { toast } from 'sonner';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/shared/components/ui/dialog';
import { useQueryClient } from '@tanstack/react-query';

export const CheckDiseaseDialog = ({
  open,
  onOpenChange,
  TriggerButton,
  id,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [annotatedImagePreview, setAnnotatedImagePreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const queryClient = useQueryClient();

  const checkDiseaseMutation = useCheckDisease({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success('Disease check complete.');
        const preds = data?.data?.predictions || [];
        setPredictions(preds);
        if (preds.length === 0) {
          setAnnotatedImagePreview(null);
        }
        queryClient.invalidateQueries({
          queryKey: ['coconuts', String(id)],
        });
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || 'Failed to check disease.',
        );
        setPredictions([]); // Clear previous predictions on error
        setAnnotatedImagePreview(null); // Clear annotated image on error
      },
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPredictions([]); // Clear predictions when new image is selected
      setAnnotatedImagePreview(null); // Clear annotated image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
      setAnnotatedImagePreview(null); // Clear annotated image
      toast.error('Please select a valid image file.');
    }
  };

  const handleCheckDisease = () => {
    if (!imageFile) {
      toast.error('Please select an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('treeId', id); // Append the ID to the form data
    checkDiseaseMutation.mutate(formData);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Draw bounding boxes when predictions and image are ready
  useEffect(() => {
    if (predictions.length > 0 && imagePreview && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image(); // Use a new Image object for drawing

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        predictions.forEach((pred) => {
          // Adjust coordinates based on Roboflow's center x/y format
          const x = pred.x - pred.width / 2;
          const y = pred.y - pred.height / 2;
          const width = pred.width;
          const height = pred.height;

          // Style the box
          ctx.strokeStyle = 'red';
          ctx.lineWidth = Math.max(2, canvas.width * 0.002);
          ctx.strokeRect(x, y, width, height);

          // Style the label
          ctx.fillStyle = 'red';
          ctx.font = `bold ${Math.max(12, canvas.width * 0.015)}px Arial`;
          const text = `${pred.class} (${(pred.confidence * 100).toFixed(1)}%)`;
          const textWidth = ctx.measureText(text).width;
          const textHeight = parseInt(ctx.font, 10);

          // Draw background for label
          ctx.fillRect(x, y - textHeight - 4, textWidth + 8, textHeight + 4);

          // Draw label text
          ctx.fillStyle = 'white';
          ctx.fillText(text, x + 4, y - 4);
        });

        // Update the ANNOTATED image preview state
        setAnnotatedImagePreview(canvas.toDataURL('image/jpeg'));
      };

      img.onerror = () => {
        toast.error('Failed to load image for annotation.');
        setAnnotatedImagePreview(null);
      };

      // Set the source for the Image object to the original preview
      img.src = imagePreview;
    } else {
      // If no predictions or no image, clear the annotated preview
      setAnnotatedImagePreview(null);
    }
    // Dependency array: only re-run when predictions or the original imagePreview change.
  }, [predictions, imagePreview]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setImageFile(null);
      setImagePreview(null);
      setAnnotatedImagePreview(null);
      setPredictions([]);
      checkDiseaseMutation.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {TriggerButton}
      <DialogContent className="sm:max-w-[600px] overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Check Coconut Tree Disease</DialogTitle>
          <DialogDescription>
            Upload an image of the coconut tree to check for potential diseases.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {!imagePreview && (
            <Button
              variant="outline"
              onClick={triggerFileSelect}
              className="w-full"
              disabled={checkDiseaseMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" /> Select Image
            </Button>
          )}

          {imagePreview && (
            <div className="mt-4 border rounded-md p-2 flex flex-col items-center">
              <img
                src={annotatedImagePreview || imagePreview}
                alt="Selected preview"
                className="max-w-full h-auto max-h-[400px] object-contain"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <img
                ref={imageRef}
                src={imagePreview}
                style={{ display: 'none' }}
                alt=""
              />
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileSelect}
                className="mt-2"
                disabled={checkDiseaseMutation.isPending}
              >
                Change Image
              </Button>
            </div>
          )}

          {checkDiseaseMutation.isError && (
            <div className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {checkDiseaseMutation.error?.response?.data?.message ||
                'An error occurred.'}
            </div>
          )}

          {predictions.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Predictions:</h4>
              {predictions.map((pred, index) => (
                <div key={index} className="text-sm p-2 border rounded">
                  <span className="font-medium">{pred.class}</span> detected
                  with {(pred.confidence * 100).toFixed(1)}% confidence.
                </div>
              ))}
            </div>
          )}
          {checkDiseaseMutation.isSuccess && predictions.length === 0 && (
            <div className="mt-4 text-sm text-green-600">
              No diseases detected in the image.
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={checkDiseaseMutation.isPending}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleCheckDisease}
            disabled={!imageFile || checkDiseaseMutation.isPending}
          >
            {checkDiseaseMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {checkDiseaseMutation.isPending ? 'Checking...' : 'Check Disease'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
