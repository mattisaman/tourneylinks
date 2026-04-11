import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Define an endpoint for Sponsor Logos
  sponsorLogoUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized: Must be logged in to upload sponsor logos");
      return { clerkId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Sponsor Logo Upload complete for userId:", metadata.clerkId);
      console.log("File url:", file.url);
      return { uploadedBy: metadata.clerkId, url: file.url };
    }),
    
  // Define an endpoint for Pro Verification OCR (PGA Cards or Biz Cards)
  pgaCardImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized: Must be logged in to upload credentials");
      return { clerkId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PGA Card Upload complete for userId:", metadata.clerkId);
      console.log("File url:", file.url);
      return { uploadedBy: metadata.clerkId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
