import { Client } from "minio";
import policy from "./policyPublic.json";
import { ReadStream } from "fs";
import { PassThrough } from "stream";

const bucket = "agape";
const publicPath = "public/";
const bucketRegion = "us-east-1";
const expiry = 24 * 60 * 60;
const octetStream = "application/octet-stream";

export default class Storage {
  private static minio: Client;

  public static async uploadPublic(
    stream: ContentFile,
    filename: string,
    mimeType = octetStream
  ) {
    const minio = this.GetClient();

    const objectName = publicPath + filename;

    await minio.putObject(bucket, objectName, stream, contentType(mimeType));

    const urlPrivate = await minio.presignedGetObject(
      bucket,
      objectName,
      expiry
    );

    const url = new URL(urlPrivate);

    url.search = "";

    return url.toString();
  }

  public static async uploadFile(file: File, filename: string) {
    const minio = this.GetClient();

    const arrayBytes = await file.arrayBuffer();

    const objectName = publicPath + filename;

    await minio.putObject(
      bucket,
      objectName,
      Buffer.from(arrayBytes),
      contentType(file.type)
    );

    const urlPrivate = await minio.presignedGetObject(
      bucket,
      objectName,
      expiry
    );

    const url = new URL(urlPrivate);

    url.search = "";

    return url.toString();
  }

  protected static GetClient() {
    if (!Storage.minio) {
      throw Error("storage is not init");
    }

    return Storage.minio;
  }

  public static async Init(uri: string) {
    const { hostname, username, password, port, protocol } = new URL(uri);

    const minio = new Client({
      endPoint: hostname,
      accessKey: username,
      secretKey: password,
      port: port ? parseInt(port) : undefined,
      useSSL: protocol === "https:",
    });

    const existsBucket = await minio.bucketExists(bucket);

    if (!existsBucket) {
      await minio.makeBucket(bucket, bucketRegion);
      await minio.setBucketPolicy(bucket, JSON.stringify(policy));
    }

    this.minio = minio;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}

function contentType(mimeType: string) {
  return {
    "Content-Type": mimeType,
  };
}

/**
 * Types
 */
type ContentFile = ReadStream | PassThrough | Buffer;
