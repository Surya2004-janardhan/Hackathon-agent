const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Generic function that accepts a user prompt
async function getGroqChatCompletionHelper(prompt) {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return response;
}

// Optional: test runner like your original .then() example
async function getGroqChatCompletion(prompt) {
  const chatCompletion = await getGroqChatCompletionHelper(prompt);
  console.log(
    "here is the response:",
    // chatCompletion.choices[0]?.message?.content || ""
  );
  let response =  chatCompletion.choices[0]?.message?.content || "";
  let cleanResponse;
  try {
    // If response is a string containing a JSON object
    cleanResponse = JSON.parse(response);
  } catch (e) {
    // Try to sanitize first
    const sanitized = response.trim().match(/{[\s\S]*}/);
    if (sanitized) {
      cleanResponse = JSON.parse(sanitized[0]);
    } else {
      console.error("Failed to extract valid JSON from response.");
      // return ege: "Invalid response format from LLM" });
      return e.error
    }
  }
return cleanResponse

}
// getGroqChatCompletion("hi how are u groq")

module.exports = {getGroqChatCompletion}

// Uncomment to test
// main();
