// This file is the new primary source for greetings page images.

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// I've hardcoded the image data here to remove any JSON import issues.
// This should reliably load the image from the public folder.
export const PlaceHolderImages: ImagePlaceholder[] = [
  {
    "id": "diwali-poster",
    "description": "A festive poster for Diwali.",
    "imageUrl": "/Diwali.png", // Points to public/Diwali.png
    "imageHint": "Diwali festival"
  }
];
