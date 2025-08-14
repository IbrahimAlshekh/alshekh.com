import type { FC } from 'react';

/**
 * Shared UI types for the frontend application.
 * Keep generic, reusable types here to avoid duplication across pages/components.
 */
export type IconType = FC<{ className?: string }>;

export type StackItem = {
    name: string;
    logo: string;
    classes: string;
    dot: string;
};
