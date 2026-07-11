/**
 * @deprecated
 * The Zustand global store has been replaced by Redux Toolkit.
 * Please use the Redux store instead:
 *
 *   import { store, useAppSelector, useAppDispatch } from "@/store";
 *   import { sharedActions } from "@/store/slices/shared.slice";
 */

// Re-export Redux store utilities for backward compatibility
export { store, useAppSelector, useAppDispatch } from "@/store";
export type { RootState, AppDispatch } from "@/store";
