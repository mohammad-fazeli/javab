import sharp from "sharp";
import fs from "fs";
import path from "path";

export const compress = async (file: string) => {
  const ext = path.extname(file);
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
    try {
      const metadata = await sharp(`public/files/practice/${file}`).metadata();
      if (metadata.width) {
        if (metadata.width > 1000) {
          const buffer = await sharp(`public/files/practice/${file}`)
            .resize(1000)
            .toBuffer();
          fs.writeFileSync(`public/files/practice/${file}`, buffer);
        }
      }
    } catch (err: any) {
      throw "Error in resizing image";
    }
  }
};
