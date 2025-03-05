import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseFileName(fileName: string): string {
  const match = fileName.match(/^(\d+)([a-zA-Z0-9]+)-(.+)$/);

  if (!match) {
    throw new Error("Invalid file name format");
  }

  const version = match[1]; // Extracts the version number
  const lastPart = match[3]; // Extracts 'test.apk'

  return `version-${version}-${lastPart}`;
}