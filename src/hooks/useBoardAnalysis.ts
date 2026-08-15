import { useState, useCallback } from "react";
import { useScholarStore } from "@/store/useScholarStore";
import { BoardAnalysisResult, ChatMessage } from "@/types/scholar";
import { SAMPLE_BOARDS, SampleBoard } from "@/components/vision/SampleBoardsLibrary";

export interface ImageFilters {
  contrast: number; // 50 to 200%
  brightness: number; // 50 to 200%
  invert: boolean;
  sharpness: boolean;
  zoom: number; // 0.5 to 3
  pan: { x: number; y: number };
}

export function useBoardAnalysis() {
  const {
    activeBoardResult,
    setActiveBoardResult,
    activeImageUri,
    setActiveImageUri,
    boardHistory,
    saveBoardToHistory,
    deleteBoardFromHistory,
    loadBoardFromHistory: storeLoadBoardFromHistory,
    clearBoardHistory,
  } = useScholarStore();

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatStreaming, setIsChatStreaming] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Hello! I am your Lecture & Study Assistant. Upload or select any blackboard or homework photo to extract structured notes, solution steps, flashcards, or ask any question about the topic.",
      timestamp: "Just now",
    },
  ]);

  const [imageFilters, setImageFilters] = useState<ImageFilters>({
    contrast: 100,
    brightness: 100,
    invert: false,
    sharpness: false,
    zoom: 1,
    pan: { x: 0, y: 0 },
  });

  const resetFilters = useCallback(() => {
    setImageFilters({
      contrast: 100,
      brightness: 100,
      invert: false,
      sharpness: false,
      zoom: 1,
      pan: { x: 0, y: 0 },
    });
  }, []);

  const updateFilters = useCallback((updates: Partial<ImageFilters>) => {
    setImageFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  // Client-side image optimizer for fast, lightweight transmission and high vision fidelity
  const compressImage = async (file: File, maxDimension = 1600, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawResult = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawResult);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(rawResult);
        img.src = rawResult;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  // Process file upload (drag & drop or input)
  const processImageFile = useCallback(
    async (file: File, course?: { courseCode?: string; courseName?: string }) => {
      setIsAnalyzing(true);
      setErrorMessage(null);

      try {
        const dataUrl = await compressImage(file, 1600, 0.85);
        if (!dataUrl) {
          throw new Error("Unable to read image file.");
        }

        setActiveImageUri(dataUrl);

        // Call analysis API
        const response = await fetch("/api/analyze-board", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: dataUrl,
            mimeType: "image/jpeg",
            courseCode: course?.courseCode || "",
            courseName: course?.courseName || "",
          }),
        });

        if (!response.ok) {
          throw new Error(`Analysis failed with status ${response.status}`);
        }

        const data: BoardAnalysisResult = await response.json();
        if (course?.courseCode) data.courseCode = course.courseCode;
        if (course?.courseName) data.courseName = course.courseName;

        setActiveBoardResult(data);
        saveBoardToHistory(data, dataUrl);

        // Add intro message to chat
        const courseTag = data.courseCode ? ` for **[${data.courseCode}] ${data.courseName || ""}**` : "";
        setChatMessages([
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `I've analyzed your document on **${data.topicTitle}**${courseTag}! You can explore the structured solutions, step-by-step logic, active recall cards, or ask me any question below.`,
            timestamp: "Just now",
          },
        ]);
      } catch (err: any) {
        console.error("Error processing board image:", err);
        setErrorMessage(err?.message || "Failed to analyze board image.");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [setActiveBoardResult, setActiveImageUri, saveBoardToHistory]
  );

  // Load sample board instantly
  const loadSampleBoard = useCallback(
    (sample: SampleBoard) => {
      setActiveImageUri(sample.thumbnailSvg);
      setActiveBoardResult(sample.presetAnalysis);
      saveBoardToHistory(sample.presetAnalysis, sample.thumbnailSvg);
      resetFilters();
      setChatMessages([
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: `Loaded sample lecture: **${sample.presetAnalysis.topicTitle}**. Ask any theoretical question or step derivation!`,
          timestamp: "Just now",
        },
      ]);
    },
    [setActiveBoardResult, setActiveImageUri, saveBoardToHistory, resetFilters]
  );

  // Switch to an existing board from history
  const selectBoardHistoryItem = useCallback(
    (id: string) => {
      const board = boardHistory.find((b) => b.id === id);
      if (board) {
        storeLoadBoardFromHistory(id);
        resetFilters();
        setChatMessages([
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `Restored lecture board: **${board.topicTitle}** (Analyzed on ${new Date(board.analyzedAt).toLocaleDateString()}). Ask any follow-up question!`,
            timestamp: "Just now",
          },
        ]);
      }
    },
    [boardHistory, storeLoadBoardFromHistory, resetFilters]
  );

  // Send question to streaming chat
  const sendChatMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isChatStreaming) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const assistantMsgId = `bot-${Date.now()}`;
      const placeholderMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: "Thinking...",
        isStreaming: true,
      };

      setChatMessages((prev) => [...prev, userMsg, placeholderMsg]);
      setIsChatStreaming(true);

      try {
        const boardContext = activeBoardResult
          ? [
              `TOPIC: ${activeBoardResult.topicTitle}`,
              activeBoardResult.courseCode ? `COURSE: [${activeBoardResult.courseCode}] ${activeBoardResult.courseName || ""}` : "",
              `SUMMARY: ${activeBoardResult.summary}`,
              activeBoardResult.steps && activeBoardResult.steps.length > 0
                ? `DETAILED STEPS / PROBLEMS:\n${activeBoardResult.steps
                    .map(
                      (s) =>
                        `Step/Question ${s.stepNumber}: ${s.title}\n- Explanation: ${s.explanation}\n${s.formula ? `- Formula/Command: ${s.formula}` : ""}\n${s.intuition ? `- Note: ${s.intuition}` : ""}`
                    )
                    .join("\n\n")}`
                : "",
              activeBoardResult.keyFormulas && activeBoardResult.keyFormulas.length > 0
                ? `KEY FORMULAS / COMMANDS:\n${activeBoardResult.keyFormulas.join("\n")}`
                : "",
              `STRUCTURED NOTES:\n${activeBoardResult.structuredNotes}`,
            ]
              .filter(Boolean)
              .join("\n\n")
          : "No specific whiteboard uploaded yet.";

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...chatMessages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: boardContext,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error("Chat stream failed to connect.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: accumulatedText,
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    isStreaming: true,
                  }
                : msg
            )
          );
        }

        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
          )
        );
      } catch (chatErr) {
        console.error("Chat streaming error:", chatErr);
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: "Sorry, I encountered an issue generating the response. Please try again.",
                  isStreaming: false,
                }
              : msg
          )
        );
      } finally {
        setIsChatStreaming(false);
      }
    },
    [activeBoardResult, chatMessages, isChatStreaming]
  );

  return {
    activeBoardResult,
    activeImageUri,
    boardHistory,
    isAnalyzing,
    isChatStreaming,
    errorMessage,
    chatMessages,
    imageFilters,
    updateFilters,
    resetFilters,
    processImageFile,
    loadSampleBoard,
    selectBoardHistoryItem,
    deleteBoardFromHistory,
    clearBoardHistory,
    sendChatMessage,
    sampleBoards: SAMPLE_BOARDS,
  };
}
