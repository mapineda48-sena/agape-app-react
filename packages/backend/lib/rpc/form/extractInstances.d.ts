// Define the types for the extractInstances function.

import { File } from "web-standards";

/**
 * Recursively finds and returns entries of a specific instance type from the provided object.
 * It constructs the keys in a way that reflects the structure of the object,
 * suitable for FormData or other purposes.
 * @param payload The object from which to extract instances.
 * @param instanceType The constructor function of the type to extract (e.g., File, Date).
 * @param baseKey The base key from which to start the path construction, default is an empty string.
 * @returns An array of tuples, each containing the path to the instance in the object and the instance itself.
 */
export default function extractInstances<T>(
  payload: any,
  instanceType: new (...args: any[]) => T,
  baseKey?: string
): Array<[string, T]>;
