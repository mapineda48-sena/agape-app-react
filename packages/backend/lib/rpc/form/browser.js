import _ from "lodash";
import { ArgsKey } from "./integration";
import extractInstances from "./extractInstances";

// Converts JavaScript arguments to FormData for HTTP submission.
// This allows complex objects, including files, to be sent to the server.
export default function toFormData(args) {
  // Create a deep copy of the source to avoid mutating the original object
  const payload = _.cloneDeep(args);

  // Extract dates entries from the arguments
  const dates = extractInstances(payload, Date);

  // Extract file entries from the arguments
  const files = extractInstances(payload, File);

  // Create a new FormData object
  const formData = new FormData();

  // Append the JSON part to the FormData object
  formData.append(ArgsKey, JSON.stringify(payload));

  // Append the Dates to the FormData object
  formData.append(ArgsKey, JSON.stringify(dates));

  // Append each file to the FormData object
  files.forEach(([name, file]) => formData.append(name, file));

  return formData;
}