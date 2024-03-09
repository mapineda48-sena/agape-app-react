import os from "os";
import fs from "fs-extra";
import _ from "lodash";
import formidable, { Fields, Files } from "formidable";
import { Request, Response, NextFunction } from "express";
import { fieldNameArgs } from "../../src/config";

const uploadDir = os.tmpdir();

export default function parseFormData(cb: (...args: unknown[]) => unknown) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = formidable({ uploadDir });

      const data: [Fields, Files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      const args = parseArgs(data[0], data[1]);

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

export function parseArgs(fields: Fields, files: Files): unknown[] {
  const json = fields[fieldNameArgs]?.toString();

  if (!json) {
    throw new Error("unknown form data");
  }

  const args: unknown[] = JSON.parse(json);

  Object.entries(files).map(([key, file]) => _.set(args, key, toFileWeb(file)));

  return args;
}

export function toFileWeb([input]: formidable.File[] = []) {
  const file: unknown = {
    name: input.originalFilename || "",
    size: input.size,
    type: input.mimetype || "",

    arrayBuffer: function arrayBuffer() {
      return fs
        .readFile(input.filepath)
        .then((res) =>
          res.buffer.slice(res.byteOffset, res.byteOffset + res.byteLength)
        );
    },

    slice: notImplementedError,

    stream: function stream() {
      return fs.createReadStream(input.filepath);
    },

    text: notImplementedError,
  };

  return file as File;
}

function notImplementedError(): void {
  throw new Error("not implemented error");
}
