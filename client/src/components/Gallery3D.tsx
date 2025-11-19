import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { type GalleryImage } from "@shared/schema";

const defaultImages = [
  { id: "default-1", url: "/images/gallery-1.png", filename: "Store Interior 1" },
  { id: "default-2", url: "/images/gallery-2.png", filename: "Store Interior 2" },
  { id: "default-3", url: "/images/gallery-3.png", filename: "Store View" },
];

export function Gallery3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useBodyScrollLock(isFullscreenOpen);

  const { data: uploadedImages = [] } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const allImages = [...defaultImages, ...uploadedImages];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({
        title: "Bild gelöscht",
        description: "Das Bild wurde aus der Galerie entfernt.",
      });
    },
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - dragStart;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (dragOffset > threshold) {
      setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    } else if (dragOffset < -threshold) {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }
    
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openFullscreen = (index: number) => {
    setFullscreenImageIndex(index);
    setIsFullscreenOpen(true);
  };

  const nextFullscreenImage = () => {
    setFullscreenImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevFullscreenImage = () => {
    setFullscreenImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const getImageStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalImages = allImages.length;
    
    let adjustedDiff = diff;
    if (diff > totalImages / 2) {
      adjustedDiff = diff - totalImages;
    } else if (diff < -totalImages / 2) {
      adjustedDiff = diff + totalImages;
    }

    const isCenter = adjustedDiff === 0;
    const absAdjustedDiff = Math.abs(adjustedDiff);
    
    const dragOffsetPercent = isDragging ? (dragOffset / window.innerWidth) * 100 : 0;
    
    return {
      transform: `
        translateX(${adjustedDiff * 85 + dragOffsetPercent}%) 
        translateZ(${isCenter ? 0 : -absAdjustedDiff * 200}px) 
        rotateY(${adjustedDiff * -15}deg)
        scale(${isCenter ? 1 : 1 - absAdjustedDiff * 0.2})
      `,
      opacity: absAdjustedDiff > 2 ? 0 : 1 - absAdjustedDiff * 0.3,
      zIndex: 10 - absAdjustedDiff,
    };
  };

  return (
    <div className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-6">
        <h2 className="font-poppins text-3xl md:text-5xl font-bold text-ocean mb-4 text-center" data-testid="text-gallery-title">
          Unsere Galerie
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-10 font-lato" data-testid="text-gallery-subtitle">
          Entdecken Sie unseren einladenden Raum
        </p>

        {/* 3D Carousel */}
        <div className="mb-6">
          <div 
            className="perspective-1000 h-[320px] md:h-[550px] lg:h-[650px] relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute inset-0 flex items-center justify-center preserve-3d select-none">
              {allImages.map((image, index) => {
                const isCenter = index === currentIndex;
                return (
                  <div
                    key={image.id}
                    className="absolute w-[320px] md:w-[550px] lg:w-[700px] h-[240px] md:h-[400px] lg:h-[500px] transition-all duration-700 ease-out"
                    style={getImageStyle(index)}
                    data-testid={`gallery-image-${index}`}
                  >
                    <Card 
                      className="w-full h-full overflow-hidden relative group"
                      onClick={() => isCenter && openFullscreen(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.filename}
                        loading="lazy"
                        className={`w-full h-full object-cover ${isCenter ? 'cursor-pointer' : ''}`}
                      />
                      {isCenter && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-foreground p-3 rounded-full">
                            <ZoomIn className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                      {!image.id.startsWith('default-') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(image.id);
                          }}
                          className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          data-testid={`button-delete-${image.id}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons - Under Gallery */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 hover:bg-ocean hover:text-white hover:border-ocean transition-all"
              data-testid="button-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <span className="font-poppins text-base md:text-lg font-semibold text-muted-foreground">
              {currentIndex + 1} / {allImages.length}
            </span>
            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 hover:bg-ocean hover:text-white hover:border-ocean transition-all"
              data-testid="button-next"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-4 border-white/20 shadow-2xl ring-2 ring-white/10">
          <DialogTitle className="sr-only">
            {allImages[fullscreenImageIndex]?.filename || 'Bild'}
          </DialogTitle>
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            <img
              src={allImages[fullscreenImageIndex]?.url}
              loading="lazy"
              alt={allImages[fullscreenImageIndex]?.filename}
              className="max-w-full max-h-full object-contain"
              data-testid="fullscreen-image"
            />
            
            {/* Fullscreen Navigation */}
            <Button
              onClick={prevFullscreenImage}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background"
              data-testid="button-fullscreen-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextFullscreenImage}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background"
              data-testid="button-fullscreen-next"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 px-4 py-2 rounded-full">
              <span className="font-poppins text-sm" data-testid="text-image-counter">
                {fullscreenImageIndex + 1} / {allImages.length}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
