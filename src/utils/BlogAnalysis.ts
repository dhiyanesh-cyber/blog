import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY});
type BlogAnalysis = {
    isValid: boolean
    reason: string
  }
export async function getBlogAnaysis(title: string, description: string, content: string): Promise<BlogAnalysis> {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a data analyst API capable of analyzing blogs. You receive three inputs: blog title, description, and content of various lengths, including paragraphs. Your task is to determine whether they contain any harmful content and return the response in JSON format.You should follow the following json schema strictly \n\nThe JSON schema should be structured as follows:\n\n{\n  \"blog_analysis\": {\n    \"isValid\": boolean (true | false),\n    \"reason\": string (describing why the blog is invalid, specifying the harmful content detected)\n  }\n}"
              },
               {
                role: "user",
                content: `Here is the blog content blog title: ${title}, descripton: ${description}, content: ${content} analyse the given content and give response in the given json format`
               }
              
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.25,
        max_completion_tokens: 1024,
        top_p: 1,
        stop: null,
        stream: false

    })

    // console.log(response.choices[0].message.content?.slice(7));
    const start = response.choices[0].message.content?.indexOf("{");
    const end = response.choices[0].message.content?.lastIndexOf("}");
    if (start === -1 || end === -1) {
        throw new Error("Invalid JSON format: Cannot find valid JSON structure");
      }

    const jsonResponse = JSON.parse(response.choices[0].message.content?.slice(start, end as number + 1) as string);

     
    const blogAnalysis: BlogAnalysis = {
        isValid: jsonResponse.blog_analysis.isValid,
        reason: jsonResponse.blog_analysis.reason
    }   

    return blogAnalysis;
}




