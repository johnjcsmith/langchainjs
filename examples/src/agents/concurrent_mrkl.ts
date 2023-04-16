import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import process from "process";
import { getTracingCallbackManager } from "langchain/callbacks";

export const run = async () => {
  const model = new OpenAI({ temperature: 0 });
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "Austin,Texas,United States",
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];

  const executor = await initializeAgentExecutor(
    tools,
    model,
    "zero-shot-react-description",
    true
  );
  console.log("Loaded agent.");

  const input = `Who is Olivia Wilde's boyfriend? What is his current age raised to the 0.23 power?`;

  console.log(`Executing with input "${input}"...`);

  const [resultA, resultB, resultC] = await Promise.all([
    executor.call({ input }, await getTracingCallbackManager()),
    executor.call({ input }, await getTracingCallbackManager()),
    executor.call({ input }, await getTracingCallbackManager()),
  ]);

  console.log(`Got output ${resultA.output}`);
  console.log(`Got output ${resultB.output}`);
  console.log(`Got output ${resultC.output}`);
};
