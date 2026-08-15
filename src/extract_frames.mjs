import ffmpegPath from "ffmpeg-static";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";

const framesDir = path.resolve("./public/frames");
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

const inputVideo = path.resolve("./public/assets/plane-window.mp4");
const outputPattern = path.join(framesDir, "frame_%03d.jpg");

console.log("Extracting frames using ffmpeg at:", ffmpegPath);
console.log("Input:", inputVideo);
console.log("Output:", outputPattern);

// Extract frames at 24fps, scaled to 1920x1080 (or native 1080p), high quality jpg (qscale 2)
const args = [
  "-i", inputVideo,
  "-vf", "fps=24,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
  "-qscale:v", "2",
  outputPattern
];

execFile(ffmpegPath, args, (err, stdout, stderr) => {
  if (err) {
    console.error("FFmpeg error:", err);
    process.exit(1);
  }
  const files = fs.readdirSync(framesDir).filter(f => f.endsWith(".jpg"));
  console.log(`Successfully extracted ${files.length} frames into /public/frames/`);
  console.log("First frame:", files[0]);
  console.log("Last frame:", files[files.length - 1]);
});
