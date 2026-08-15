"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Sun,
  Contrast,
  FlipHorizontal,
  Upload,
  Camera,
  Layers,
  Sparkles,
  BookOpen,
  Check,
  X,
} from "lucide-react";
import { ImageFilters } from "@/hooks/useBoardAnalysis";
import { useScholarStore } from "@/store/useScholarStore";

interface HighResImageViewerProps {
  imageUri: string | null;
  filters: ImageFilters;
  updateFilters: (updates: Partial<ImageFilters>) => void;
  resetFilters: () => void;
  onFileUpload: (file: File, course?: { courseCode?: string; courseName?: string }) => void;
  isAnalyzing: boolean;
}

export const HighResImageViewer: React.FC<HighResImageViewerProps> = ({
  imageUri,
  filters,
  updateFilters,
  resetFilters,
  onFileUpload,
  isAnalyzing,
}) => {
  const { courses } = useScholarStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);

  // Subject / Course tagging modal state
  const [pendingUpload, setPendingUpload] = useState<{
    file: File;
    previewUrl: string;
  } | null>(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("");
  const [customSubjectName, setCustomSubjectName] = useState<string>("");

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseCode) {
      setSelectedCourseCode(courses[0].courseCode);
    }
  }, [courses, selectedCourseCode]);

  const handleFileSelected = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    if (courses.length > 0) {
      setSelectedCourseCode(courses[0].courseCode);
    } else {
      setSelectedCourseCode("__custom__");
    }
    setPendingUpload({ file, previewUrl });
  };

  const handleConfirmUpload = () => {
    if (!pendingUpload) return;

    let courseInfo: { courseCode?: string; courseName?: string } | undefined;

    if (selectedCourseCode === "__custom__") {
      courseInfo = {
        courseCode: customSubjectName.trim().slice(0, 8).toUpperCase() || "GEN",
        courseName: customSubjectName.trim() || "General / Self-Study",
      };
    } else if (selectedCourseCode === "__general__") {
      courseInfo = {
        courseCode: "GEN",
        courseName: "General / Independent Study",
      };
    } else {
      const match = courses.find((c) => c.courseCode === selectedCourseCode);
      if (match) {
        courseInfo = {
          courseCode: match.courseCode,
          courseName: match.courseName,
        };
      }
    }

    onFileUpload(pendingUpload.file, courseInfo);
    URL.revokeObjectURL(pendingUpload.previewUrl);
    setPendingUpload(null);
  };

  const handleCancelUpload = () => {
    if (pendingUpload) {
      URL.revokeObjectURL(pendingUpload.previewUrl);
    }
    setPendingUpload(null);
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.min(3.5, Math.max(0.6, filters.zoom + delta));
    updateFilters({ zoom: newZoom });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (filters.zoom <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - filters.pan.x,
      y: e.clientY - filters.pan.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateFilters({
      pan: {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      },
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Camera Snapshot capture
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setIsCameraActive(false);
      alert("Could not access camera. Please check browser permissions.");
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "classroom-snapshot.jpg", {
            type: "image/jpeg",
          });
          handleFileSelected(file);
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative flex flex-col h-full rounded-2xl bg-black/40 border border-white/[0.08] overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Classroom Optical Feed
          </span>
          {filters.invert && (
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
              Inverted Clarity
            </span>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom(0.25)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.25)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetFilters}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowFiltersMenu(!showFiltersMenu)}
            className={`p-1.5 rounded-lg transition-all ${
              showFiltersMenu
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
            title="Contrast & Clarity Filters"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs flex items-center gap-1"
            title="Upload custom photo"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            onClick={startCamera}
            className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs flex items-center gap-1"
            title="Capture camera photo"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Camera</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0]);
                // reset input so user can pick the same file again if needed
                e.target.value = "";
              }
            }}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Filter Adjustment Drawer */}
      {showFiltersMenu && (
        <div className="p-3 bg-[#0e0e16]/90 border-b border-white/[0.08] backdrop-blur-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Contrast className="w-3 h-3 text-cyan-400" /> Contrast: {filters.contrast}%
            </span>
            <input
              type="range"
              min="50"
              max="200"
              value={filters.contrast}
              onChange={(e) => updateFilters({ contrast: Number(e.target.value) })}
              className="accent-cyan-400 h-1 bg-white/10 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> Brightness: {filters.brightness}%
            </span>
            <input
              type="range"
              min="50"
              max="200"
              value={filters.brightness}
              onChange={(e) => updateFilters({ brightness: Number(e.target.value) })}
              className="accent-amber-400 h-1 bg-white/10 rounded"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
            <button
              onClick={() => updateFilters({ invert: !filters.invert })}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.invert
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              Invert (Whiteboard / Chalk)
            </button>
          </div>
        </div>
      )}

      {/* Main Image Viewport / Dropzone */}
      <div
        ref={containerRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 flex items-center justify-center p-4 overflow-hidden min-h-[380px] lg:min-h-[500px] select-none ${
          filters.zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
      >
        {/* Analyzing Overlay Spinner */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-30 bg-[#08080c]/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
              <div className="w-full h-full rounded-full border-2 border-t-cyan-400 border-r-indigo-500 border-b-purple-500 border-l-transparent animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold text-white font-mono">
              PARSING OPTICAL BOARD DATA...
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              AI Neural Vision is extracting handwritten derivations, KaTeX symbols, and active recall cards.
            </p>
          </div>
        )}

        {/* Live Camera Viewport Modal */}
        {isCameraActive ? (
          <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-h-[380px] rounded-xl object-cover border border-cyan-400/40"
            />
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={captureSnapshot}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                📸 Snap & Analyze
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : imageUri ? (
          /* Rendered Board Image with Zoom/Pan/Filters */
          <div
            style={{
              transform: `translate(${filters.pan.x}px, ${filters.pan.y}px) scale(${filters.zoom})`,
              filter: `contrast(${filters.contrast}%) brightness(${filters.brightness}%) ${
                filters.invert ? "invert(100%) hue-rotate(180deg)" : ""
              }`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
            className="relative max-w-full max-h-full flex items-center justify-center rounded-xl shadow-2xl overflow-hidden pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUri}
              alt="Classroom Blackboard"
              className="max-h-[460px] w-auto object-contain rounded-xl"
            />
          </div>
        ) : (
          /* Empty Dropzone State */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-2xl hover:border-cyan-400/40 hover:bg-white/[0.02] transition-all cursor-pointer text-center max-w-md"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
              <Upload className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Drop Blackboard or Whiteboard Photo
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP or classroom camera snapshot. Or choose a preset sample below.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="p-2.5 px-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono">Zoom: {(filters.zoom * 100).toFixed(0)}%</span>
        <span>Drag to pan when zoomed • Double click to reset</span>
      </div>

      {/* Course / Subject Tagging Modal Dialog */}
      {pendingUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0e101f] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-500/10 overflow-hidden text-left">
            {/* Decorative glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    Assign Course / Subject
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Tag this blackboard to your course syllabus
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelUpload}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview Thumbnail */}
            <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-4 border border-white/10 bg-black/50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingUpload.previewUrl}
                alt="Preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-slate-300 border border-white/10">
                {(pendingUpload.file.size / 1024).toFixed(0)} KB • {pendingUpload.file.type || "image/jpeg"}
              </div>
            </div>

            {/* Subject Dropdown Selector */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  SELECT SUBJECT / COURSE:
                </label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="w-full bg-[#14172b] border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans cursor-pointer"
                >
                  {courses.length > 0 && (
                    <optgroup label="Your Enrolled Courses" className="bg-[#0e101f] text-slate-300">
                      {courses.map((course) => (
                        <option key={course.courseCode} value={course.courseCode} className="text-white">
                          [{course.courseCode}] {course.courseName}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Other Options" className="bg-[#0e101f] text-slate-300">
                    <option value="__custom__" className="text-cyan-300">+ Custom / Other Subject Name</option>
                    <option value="__general__" className="text-slate-300">General / Self-Study</option>
                  </optgroup>
                </select>
              </div>

              {/* Custom Subject Name Input */}
              {(selectedCourseCode === "__custom__" || courses.length === 0) && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Enter Subject or Course Title:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Quantum Chemistry, Computer Networks"
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    className="w-full bg-[#14172b] border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelUpload}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start AI Analysis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
