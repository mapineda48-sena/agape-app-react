import _ from "lodash";
import { fieldNameArgs } from "../../src/util/common";
import formidable from "formidable";
import os from "os";
import fs from "fs-extra";

const uploadDir = os.tmpdir();

export default function parseFormData(cb) {
  return async (req, res, next) => {
    try {
      const form = formidable({ uploadDir });

      const data = await form.parse(req);

      const args = parseArgs(...data);

      let payload = cb(...args);

      if (payload instanceof Promise) {
        payload = await payload;
      }

      res.json(payload);
    } catch (error) {
      next(error);
    }
  };
}

export function parseArgs(fields, files) {
  const args = JSON.parse(fields[fieldNameArgs]);

  Object.entries(files).map(([key, file]) => _.set(args, key, toFileWeb(file)));

  return args;
}

export function toFileWeb([input]) {
  const file = {};

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

  file.slice = notImplementedError;

  file.stream = function stream() {
    return fs.createReadStream(input.filepath);
  };

  file.text = notImplementedError;

  return file;
}

function notImplementedError() {
  throw new Error("not implemented error");
}