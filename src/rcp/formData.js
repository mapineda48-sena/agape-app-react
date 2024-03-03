import _ from "lodash";
import { fieldNameArgs } from "./common";

export default function toFormData(args) {
  const files = toEntrieFormFile(args);

  const json = removeFile(args, files);

  const formData = new FormData();

  formData.append(fieldNameArgs, JSON.stringify(json));

  files.forEach(([name, file]) => formData.append(name, file));

  return formData;
}

export function toEntrieFormFile(obj, baseKey = "") {
  return _.transform(
    obj,
    (result, value, key) => {
      // Para arrays, la clave será el índice, por lo que construimos la ruta adecuadamente
      // ya sea usando punto para objetos o corchetes para índices de arrays.
      let currentKey = Array.isArray(obj)
        ? `${baseKey}[${key}]`
        : baseKey
        ? `${baseKey}.${key}`
        : key;

      if (_.isPlainObject(value) || Array.isArray(value)) {
        result.push(...toEntrieFormFile(value, currentKey));
        return;
      }

      if (value instanceof File) {
        result.push([currentKey, value]);
      }
    },
    []
  );
}

export function removeFile(src, files) {
  const dest = _.cloneDeep(src);

  files.map(([key]) => key).forEach((key) => _.unset(dest, key));

  return dest;
}
