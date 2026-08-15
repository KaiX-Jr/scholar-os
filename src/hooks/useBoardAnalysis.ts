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
  } = useScholarStore();

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatStreaming, setIsChatStreaming] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Hello! I am your Lecture & Research Assistant. Upload or select any blackboard photo to extract structured notes, LaTeX derivations, flashcards, or ask any question about the board.",
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

  // Process file upload (drag & drop or input)
  const processImageFile = useCallback(
    async (file: File) => {
      setIsAnalyzing(true);
      setErrorMessage(null);

      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        const dataUrl = await base64Promise;

        setActiveImageUri(dataUrl);

        // Call analysis API
        const response = await fetch("/api/analyze-board", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: dataUrl,
            mimeType: file.type || "image/jpeg",
          }),
        });

        if (!response.ok) {
          throw new Error(`Analysis failed with status ${response.status}`);
        }

        const data: BoardAnalysisResult = await response.json();
        setActiveBoardResult(data);

        // Add intro message to chat
        setChatMessages([
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `I've analyzed your board on **${data.topicTitle}**! You can explore the structured LaTeX notes, step-by-step derivations, or ask me any question below.`,
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
    [setActiveBoardResult, setActiveImageUri]
  );

  // Load sample board instantly
  const loadSampleBoard = useCallback(
    (sample: SampleBoard) => {
      setActiveImageUri(sample.thumbnailSvg);
      setActiveBoardResult(sample.presetAnalysis);
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
    [setActiveBoardResult, setActiveImageUri, resetFilters]
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
          ? `TOPIC: ${activeBoardResult.topicTitle}\nSUMMARY: ${activeBoardResult.summary}\nNOTES:\n${activeBoardResult.structuredNotes}\nKEY FORMULAS:\n${activeBoardResult.keyFormulas?.join("\n")}`
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
    isAnalyzing,
    isChatStreaming,
    errorMessage,
    chatMessages,
    imageFilters,
    updateFilters,
    resetFilters,
    processImageFile,
    loadSampleBoard,
    sendChatMessage,
    sampleBoards: SAMPLE_BOARDS,
  };
}
