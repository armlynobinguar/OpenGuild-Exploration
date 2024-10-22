// lib/cn.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for combining class names
 * @param {...ClassValue[]} inputs - The class names to be merged
 * @returns {string} - The merged class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
