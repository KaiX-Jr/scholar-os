import fs from "fs";
import path from "path";

async function downloadAllAssets() {
  const assetsDir = path.resolve("./public/assets");
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const files = [
    { name: "paris-hero-1.jpg", id: "1H-YRC1lLjeOiBdXUU4NS2LIAjx1V6_0U" },
    { name: "paris-hero-2.jpg", id: "1TzG-Y-0SNekuQ6Ls4geFwMpmg2jPN6cn" },
    { name: "paris-hero-3.jpg", id: "1E4i_h6VdMFpg7ZqxgRytzw2HF5VCurot" },
    { name: "plane-window.mp4", id: "1RLaJ1CCpT7VqC7zUPRhYogBfB3x9p8gW" },
  ];

  for (const file of files) {
    const filePath = path.join(assetsDir, file.name);
    console.log(`Downloading ${file.name}...`);
    const url = `https://drive.google.com/uc?export=download&id=${file.id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${file.name}: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved ${file.name} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
  }
  console.log("All assets downloaded successfully!");
}

downloadAllAssets().catch(console.error);
