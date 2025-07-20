// import Groq from "groq-sdk";
const Groq = require("groq-sdk")
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

 export async function getGroqChatCompletion(prompt) {
    const respone = await  groq.chat.completions.create({
        messages: [
      {
          role: "user",
          content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
});
console.log(respone)
return respone
//   console.log(chatCompletion.choices[0]?.message?.content || "");

}

