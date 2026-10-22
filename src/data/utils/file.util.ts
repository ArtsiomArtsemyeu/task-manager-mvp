import fs from "fs/promises";
import path from "path";

const BASE_DATA_DIR = path.join(process.cwd(), "src", "data");

export async function readDataFromFile<T>(fileName: string): Promise<T> {
  try {
    const filePath = path.join(BASE_DATA_DIR, fileName);
    const data = await fs.readFile(filePath, "utf8");

    return JSON.parse(data) as T;
  } catch (error) {
    console.error(error);
    return [] as unknown as T;
  }
}

export async function writeDataToFile<T>(
  fileName: string,
  data: T,
): Promise<void> {
  const filePath = path.join(BASE_DATA_DIR, fileName);
  await fs.mkdir(BASE_DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}
