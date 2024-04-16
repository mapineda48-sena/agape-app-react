import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { ReadStream } from "fs";
import { IStorage, ContentFile } from "./IStorage"; // Asumiendo que la interfaz está en IStorage.ts

export class AzureBlobStorage implements IStorage {
  private publicContainer = "public";
  private containerClient: ContainerClient;

  constructor(connectionString: string) {
    const serviceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = serviceClient.getContainerClient(this.publicContainer);
  }

  public async sync() {
    await this.containerClient.createIfNotExists({
      access: "container",
    });
  }

  public async uploadPublic(
    stream: ContentFile,
    filename: string,
    mimeType: string = "application/octet-stream"
  ): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadStream(stream as any, undefined, undefined, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });
    const url = blockBlobClient.url;
    return url;
  }

  public async uploadFile(file: File, filename: string): Promise<string> {
    const buffer = await file.arrayBuffer();
    const blockBlobClient = this.containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(Buffer.from(buffer), {
      blobHTTPHeaders: { blobContentType: file.type },
    });
    const url = blockBlobClient.url;
    return url;
  }
}
