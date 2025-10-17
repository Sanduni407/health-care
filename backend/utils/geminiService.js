import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze single blood report
export const analyzeSingleReport = async (report) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a helpful medical assistant. Analyze this blood test result and explain it in simple terms a patient can understand.

BLOOD TEST REPORT:
${report}

Please provide a SHORT summary (200-250 words) covering:

1. **Overall Health**: Is this report generally healthy?
2. **Key Values**: Which values are normal? Which are abnormal?
3. **What It Means**: Explain in simple words without medical jargon
4. **Simple Advice**: What should the patient do? (drink water, exercise, see doctor?)

Keep it simple and friendly. If something is concerning, mention seeing a doctor.`;

    console.log("Sending single report request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response received successfully");
    return { success: true, analysis: text };
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    
    if (err.message.includes("401")) {
      return {
        success: false,
        message: "Invalid Gemini API key. Please check your configuration.",
      };
    }
    
    if (err.message.includes("429")) {
      return {
        success: false,
        message: "API rate limit exceeded. Please try again later.",
      };
    }

    return {
      success: false,
      message: "Failed to analyze report: " + err.message,
    };
  }
};

// Compare two blood reports
export const analyzeReports = async (previousReport, currentReport) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a helpful medical assistant. Compare these two blood test results and explain what changed in simple terms a patient can understand.

PREVIOUS TEST:
${previousReport}

CURRENT TEST:
${currentReport}

Please provide a SHORT summary (200-300 words) covering:

1. **What Changed**: Which values went up or down?
2. **Good or Bad**: Are these changes normal and healthy?
3. **What It Means**: Explain in simple words, no medical jargon
4. **Simple Advice**: What should the patient do? (exercise, diet, see doctor?)

Keep it simple and friendly. Avoid complex medical terms. If something is concerning, mention seeing a doctor.`;

    console.log("Sending comparison request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response received successfully");
    return { success: true, analysis: text };
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    
    if (err.message.includes("401")) {
      return {
        success: false,
        message: "Invalid Gemini API key. Please check your configuration.",
      };
    }
    
    if (err.message.includes("429")) {
      return {
        success: false,
        message: "API rate limit exceeded. Please try again later.",
      };
    }

    return {
      success: false,
      message: "Failed to analyze reports: " + err.message,
    };
  }
};