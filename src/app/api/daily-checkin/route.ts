import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

interface DailyCheckinPayload {
  action: "generate_question" | "evaluate_answer";
  courseList?: { code: string; name: string }[];
  recentBoards?: {
    topicTitle: string;
    summary: string;
    keyFormulas?: string[];
    structuredNotes?: string;
    courseCode?: string;
    courseName?: string;
  }[];
  question?: string;
  topic?: string;
  userAnswer?: string;
  expectedAnswer?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: DailyCheckinPayload = await req.json();
    const { action, courseList = [], recentBoards = [], question, topic, userAnswer } = body;

    const apiKey = (process.env.GEMINI_API_KEY || "").replace(/^["']|["']$/g, "").trim();

    if (action === "generate_question") {
      // Build detailed syllabus / board context
      const boardDetails = recentBoards
        .slice(0, 5)
        .map((b, i) => {
          const parts = [
            `[Document/Board ${i + 1}: ${b.topicTitle}]`,
            b.courseCode ? `Course: [${b.courseCode}] ${b.courseName || ""}` : "",
            `Summary: ${b.summary}`,
            b.keyFormulas && b.keyFormulas.length > 0 ? `Key Commands/Formulas: ${b.keyFormulas.join("; ")}` : "",
            b.structuredNotes ? `Notes Excerpt: ${b.structuredNotes.slice(0, 350)}...` : ""
          ].filter(Boolean);
          return parts.join(" | ");
        })
        .join("\n\n");

      const coursesFormatted =
        courseList.length > 0
          ? courseList.map((c) => `- [${c.code}] ${c.name}`).join("\n")
          : "- [DBMS] Database Management Systems\n- [CS] Operating Systems & Shell Scripting\n- [MATH] Discrete Mathematics";

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });

          const prompt = `You are Professor Gemini, an elite university professor conducting a daily 60-second oral check-in and active recall quiz for a student.

=== STUDENT ACADEMIC PROFILE ===
Enrolled Courses:
${coursesFormatted}

Recently Uploaded Blackboard & Assignment Problem Sets:
${boardDetails || "None uploaded yet — generate from enrolled courses."}
================================

QUIZ GENERATION INSTRUCTIONS:
1. Ground the question DIRECTLY in the student's actual study material:
   - If the student has uploaded blackboard or assignment documents (such as Linux shell file management commands, DBMS SQL, Calculus, etc.), prioritize generating a high-yield quiz question directly testing a core concept, command, formula, or problem from those uploaded materials.
   - If no blackboard/documents are uploaded, generate a high-yield quiz question from one of their ENROLLED courses (${courseList.map((c) => c.code).join(", ") || "DBMS, CS"}).
2. The question must test practical, real-world academic knowledge (e.g. bash command syntax like chmod/ls/mkdir/cat/redirection, SQL queries, algorithm invariants, mathematical theorems).
3. Provide 4 distinct multiple-choice options with exactly one correct option.
4. Provide a clear, intuitive 1-2 sentence professor explanation.

Return STRICTLY a JSON object with this exact schema (no markdown fences, no text outside JSON):
{
  "id": "q-${Date.now()}",
  "courseCode": "Course code of the question (e.g. ${courseList[0]?.code || 'DBMS'})",
  "courseName": "Course name (e.g. ${courseList[0]?.name || 'Database Management Systems'})",
  "topic": "Specific concept or command being tested",
  "sourceType": "${recentBoards.length > 0 ? "board" : "syllabus"}",
  "question": "The question text",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctOptionIndex": 0,
  "sampleAnswer": "Model 1-2 sentence explanation",
  "explanation": "Clear explanation of why the correct option is right",
  "formula": "Key code syntax or LaTeX formula e.g. chmod 744 <filename>"
}`;

          let rawText = "";
          try {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                temperature: 0.2,
              },
            });
            rawText = response.text || "";
          } catch {
            const fallbackModelResponse = await ai.models.generateContent({
              model: "gemini-2.0-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                temperature: 0.2,
              },
            });
            rawText = fallbackModelResponse.text || "";
          }

          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, question: parsed });
          }
        } catch (apiErr) {
          console.warn("Gemini check-in generation fallback:", apiErr);
        }
      }

      // Dynamic Contextual Fallback based on student's actual enrolled courses & uploaded boards
      const targetCourse = courseList[0] || { code: "DBMS", name: "Database Management Systems & Linux Lab" };
      const hasUploadedBoard = recentBoards.length > 0;
      const boardTopic = hasUploadedBoard ? recentBoards[0].topicTitle : "File System Permissions & Shell Commands";

      const dynamicFallback = hasUploadedBoard
        ? {
            id: `q-${Date.now()}`,
            courseCode: recentBoards[0].courseCode || targetCourse.code,
            courseName: recentBoards[0].courseName || targetCourse.name,
            topic: boardTopic,
            sourceType: "board" as const,
            question: `In Linux file permissions, which command grants the owner read, write, and execute permissions (rwx), while restricting group and others to read-only access (r--)?`,
            options: [
              "chmod 744 <filename>",
              "chmod 755 <filename>",
              "chmod 644 <filename>",
              "chmod 777 <filename>"
            ],
            correctOptionIndex: 0,
            sampleAnswer: "chmod 744 assigns 7 (4+2+1 = rwx) to owner, 4 (read) to group, and 4 (read) to others.",
            explanation: "In octal mode, 7 represents Read (4) + Write (2) + Execute (1) for user/owner, while 4 represents Read-only for group and others.",
            formula: "chmod 744 <filename>"
          }
        : {
            id: `q-${Date.now()}`,
            courseCode: targetCourse.code,
            courseName: targetCourse.name,
            topic: `${targetCourse.name} Fundamentals`,
            sourceType: "syllabus" as const,
            question: `In ${targetCourse.name}, what is the primary role of data normalization and indexing?`,
            options: [
              "Eliminate data redundancy and accelerate query retrieval",
              "Increase storage consumption deliberately",
              "Prevent multi-user concurrent read operations",
              "Convert all relational tables into raw unindexed flat files"
            ],
            correctOptionIndex: 0,
            sampleAnswer: "Normalization reduces data redundancy, while indexing optimizes query search speed.",
            explanation: "Normalization organizes tables to reduce anomalies, and B-Tree indexes provide logarithmic time lookup for fast queries.",
            formula: "O(\\log N) \\text{ index lookup}"
          };

      return NextResponse.json({ success: true, question: dynamicFallback });
    }

    if (action === "evaluate_answer") {
      const {
        question = "",
        topic = "",
        userAnswer = "",
        expectedAnswer = "",
        formula = "",
        explanation = "",
        isChoiceMode = false,
        selectedIndex = null,
        correctIndex = null,
        options = [],
      } = body as {
        question?: string;
        topic?: string;
        userAnswer?: string;
        expectedAnswer?: string;
        formula?: string;
        explanation?: string;
        isChoiceMode?: boolean;
        selectedIndex?: number | null;
        correctIndex?: number | null;
        options?: string[];
      };

      // 1. Instant deterministic evaluation for multiple-choice questions
      if (isChoiceMode && correctIndex !== null && selectedIndex !== null) {
        const isCorrect = selectedIndex === correctIndex;
        const correctLetter = String.fromCharCode(65 + correctIndex);
        const selectedLetter = String.fromCharCode(65 + selectedIndex);
        const correctText = options[correctIndex] || expectedAnswer || "";
        const selectedText = options[selectedIndex] || userAnswer || "";

        if (isCorrect) {
          return NextResponse.json({
            success: true,
            evaluation: {
              isCorrect: true,
              masteryScore: 100,
              letterGrade: "A+",
              feedback: `✅ Correct! You selected [${selectedLetter}]: ${selectedText}. ${explanation || expectedAnswer}`,
              keyTakeaway: explanation || `Core concept for ${topic}`,
              recommendedAction: "Concept mastered! Recorded into your daily habit streak.",
            },
          });
        } else {
          return NextResponse.json({
            success: true,
            evaluation: {
              isCorrect: false,
              masteryScore: 0,
              letterGrade: "F",
              feedback: `❌ Incorrect. You selected [${selectedLetter}]: "${selectedText}". The correct answer is [${correctLetter}]: "${correctText}". ${explanation || expectedAnswer}`,
              keyTakeaway: `Correction: ${correctText} — ${explanation || expectedAnswer}`,
              recommendedAction: "Review the active recall flashcard below to master this concept.",
            },
          });
        }
      }

      // 2. AI-powered evaluation for written/typed answers
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });

          const prompt = `You are Professor Gemini, rigorously grading a student's answer in a university daily oral concept check-in.

=== QUESTION & GROUND TRUTH ===
Topic: ${topic}
Question: ${question}
Expected Answer / Concept: ${expectedAnswer || explanation}
Key Formula / Command: ${formula || "N/A"}
Explanation: ${explanation}

=== STUDENT SUBMITTED ANSWER ===
"${userAnswer}"
===============================

STRICT GRADING INSTRUCTIONS:
1. Compare the student's answer directly with the Expected Answer / Concept.
2. If the student's answer is wrong, factually inaccurate, irrelevant, nonsensical, or contradicts the core concept:
   - Set "isCorrect": false
   - Set "masteryScore": between 0 and 30
   - Set "letterGrade": "F" or "D"
   - In "feedback", explicitly state that the answer is incorrect, explain why, and provide the correct concept.
3. If the student's answer is partially correct but incomplete:
   - Set "isCorrect": false
   - Set "masteryScore": between 40 and 65
   - Set "letterGrade": "C"
   - In "feedback", point out what was missing and how to complete it.
4. Only if the student's answer demonstrates accurate conceptual understanding:
   - Set "isCorrect": true
   - Set "masteryScore": between 85 and 100
   - Set "letterGrade": "A" or "A+"
   - In "feedback", confirm why their answer is accurate.

Return STRICTLY a JSON object with this exact schema (no markdown fences, no text outside JSON):
{
  "isCorrect": boolean,
  "masteryScore": number,
  "letterGrade": string,
  "feedback": string,
  "keyTakeaway": string,
  "recommendedAction": string
}`;

          let rawEval = "";
          try {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
              },
            });
            rawEval = response.text || "";
          } catch {
            const fallbackEvalResp = await ai.models.generateContent({
              model: "gemini-2.0-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
              },
            });
            rawEval = fallbackEvalResp.text || "";
          }

          const jsonMatch = rawEval.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, evaluation: parsed });
          }
        } catch (evalErr) {
          console.warn("Gemini check-in evaluation fallback:", evalErr);
        }
      }

      // 3. Fallback semantic evaluation for written answers when API is unreachable
      const cleanUser = (userAnswer || "").toLowerCase().trim();
      const cleanExpected = (expectedAnswer || explanation || "").toLowerCase();
      const keywords = cleanExpected
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3);

      const matchedCount = keywords.filter((kw) => cleanUser.includes(kw)).length;
      const isSemanticallyAccurate = keywords.length > 0 && matchedCount >= Math.min(2, Math.ceil(keywords.length * 0.3));

      if (isSemanticallyAccurate) {
        return NextResponse.json({
          success: true,
          evaluation: {
            isCorrect: true,
            masteryScore: 90,
            letterGrade: "A",
            feedback: `Accurate understanding demonstrated! ${explanation || expectedAnswer}`,
            keyTakeaway: explanation || `Core concept for ${topic}`,
            recommendedAction: "Recorded into your daily habit matrix.",
          },
        });
      } else {
        return NextResponse.json({
          success: true,
          evaluation: {
            isCorrect: false,
            masteryScore: 20,
            letterGrade: "F",
            feedback: `❌ Incorrect or incomplete. The expected concept is: ${expectedAnswer || explanation}`,
            keyTakeaway: `Key Takeaway: ${explanation || expectedAnswer}`,
            recommendedAction: "Flip the active recall flashcard below to study the correct concept.",
          },
        });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Daily checkin API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
