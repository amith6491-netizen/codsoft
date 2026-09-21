// Resume storage abstraction.
// STORAGE_DRIVER=local (default) writes into /public/uploads/resumes so the
// demo works with zero config. Flip STORAGE_DRIVER=s3 and fill in the AWS_*
// vars in .env to store resumes in S3 instead — only this file changes.
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export interface StoredFile {
  url: string;
  fileName: string;
}

const driver = process.env.STORAGE_DRIVER ?? "local";

export async function saveResume(file: File, userId: string): Promise<StoredFile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${userId}-${Date.now()}-${safeName}`;

  if (driver === "s3") {
    return saveToS3(buffer, fileName, file.type);
  }
  return saveLocally(buffer, fileName);
}

async function saveLocally(buffer: Buffer, fileName: string): Promise<StoredFile> {
  const dir = path.join(process.cwd(), "public", "uploads", "resumes");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);
  return { url: `/uploads/resumes/${fileName}`, fileName };
}

async function saveToS3(buffer: Buffer, fileName: string, contentType: string): Promise<StoredFile> {
  // Install the AWS SDK to enable this: npm i @aws-sdk/client-s3
  // const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  // const client = new S3Client({ region: process.env.AWS_REGION });
  // await client.send(new PutObjectCommand({
  //   Bucket: process.env.AWS_S3_BUCKET,
  //   Key: `resumes/${fileName}`,
  //   Body: buffer,
  //   ContentType: contentType,
  // }));
  // return { url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/resumes/${fileName}`, fileName };
  throw new Error(
    "S3 storage driver is stubbed out — install @aws-sdk/client-s3 and uncomment saveToS3() in src/lib/storage.ts"
  );
}
