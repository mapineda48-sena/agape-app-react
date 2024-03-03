import _ from "lodash";
import { fieldNameArgs } from "../../src/rcp/common";
import formidable from "formidable";
import os from "os";

const form = formidable({ uploadDir: os.tmpdir() });

export default function parseFormData(cb) {
  return async (req, res, next) => {
    try {

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

  Object.entries(files).map(([key, file]) => _.set(args, key, file));

  return args;
}
