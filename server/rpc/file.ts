import { File as FileFormidable } from "formidable";
import fs from "fs-extra";

export function toFileWeb(input: FileFormidable): File {
  const file: any = {};

  file.name = input.originalFilename;
  file.size = input.size;
  file.type = input.mimetype;

  file.arrayBuffer = function arrayBuffer() {
    return fs
      .readFile(input.filepath)
      .then((res) =>
        res.buffer.slice(res.byteOffset, res.byteOffset + res.byteLength)
      );
  };

  file.slice = notImplmentError;

  file.stream = function stream() {
    return fs.createReadStream(input.filepath);
  };

  file.text = notImplmentError;

  return file;
}

function notImplmentError() {
  throw new Error("not implemnet");
}