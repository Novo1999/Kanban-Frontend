import { generateUploadDropzone } from '@uploadthing/react';
import { URL, URL2 } from './customFetch';

export const UploadDropzone = generateUploadDropzone({
  url: `${import.meta.env.VITE_ENV === 'dev' ? URL2 : URL}/uploadthing`,
})

import { generateUploadButton } from "@uploadthing/react";

export const UploadButton = generateUploadButton({
  url: `${import.meta.env.VITE_ENV === 'dev' ? URL2 : URL}/uploadthing`,
});
