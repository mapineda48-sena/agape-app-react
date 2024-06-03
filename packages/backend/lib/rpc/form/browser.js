import _ from "lodash";
import { fieldNameArgs } from "../config";

// Converts JavaScript arguments to FormData for HTTP submission.
// This allows complex objects, including files, to be sent to the server.
export default function toFormData(args) {
  // Extract file entries from the arguments
  const files = toEntrieFormFile(args);

  // Remove file entries from the original arguments to prepare the JSON part of FormData
  const json = removeFile(args, files);

  // Create a new FormData object
  const formData = new FormData();

  // Append the JSON part to the FormData object
  formData.append(fieldNameArgs, JSON.stringify(json));

  // Append each file to the FormData object
  files.forEach(([name, file]) => formData.append(name, file));

  return formData;
}

// Recursively finds and returns file entries from the provided object.
// It constructs the keys in a way that reflects the structure of the object,
// suitable for FormData.
export function toEntrieFormFile(obj, baseKey = "") {
  return _.transform(
    obj,
    (result, value, key) => {
      // For arrays, the key will be the index, so we construct the path appropriately
      // using dot notation for objects or square brackets for array indices.
      let currentKey = Array.isArray(obj)
        ? `${baseKey}[${key}]`
        : baseKey
        ? `${baseKey}.${key}`
        : key;

      // If the value is an object or array, recursively process it
      if (_.isPlainObject(value) || Array.isArray(value)) {
        result.push(...toEntrieFormFile(value, currentKey));
        return;
      }

      // If the value is a File, add it to the result list
      if (value instanceof File) {
        result.push([currentKey, value]);
      }
    },
    []
  );
}

// Removes file entries from the source object, based on the keys found in the files list.
// This is used to prepare the non-file part of the object for JSON serialization.
export function removeFile(src, files) {
  // Create a deep copy of the source to avoid mutating the original object
  const dest = _.cloneDeep(src);

  // Remove the keys corresponding to files from the copy
  files.map(([key]) => key).forEach((key) => _.unset(dest, key));

  return dest;
}
