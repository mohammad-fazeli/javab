import fs from "fs";

export function removeFile(file: string) {
  try {
    fs.unlinkSync(`./${file}`);
  } catch {}
}
