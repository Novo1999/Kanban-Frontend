import { generateUploadDropzone } from '@uploadthing/react';

export const UploadDropzone = generateUploadDropzone({
  url: `${import.meta.env.VITE_ENV === 'dev' ? DEV_URL : PROD_URL}/uploadthing`,
})

import { generateUploadButton } from "@uploadthing/react";
import { DEV_URL, PROD_URL } from './customFetch';

export const UploadButton = generateUploadButton({
  url: `${import.meta.env.VITE_ENV === 'dev' ? DEV_URL : PROD_URL}/uploadthing`,
});
