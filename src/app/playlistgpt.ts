"use server";
import { OpenAI } from "openai";
import polly from "polly-js";

const openai = new OpenAI();

export type Song = {
  name: string;
  artist: string;
  uri: string;
  verified: boolean;
};

const assistantId = "asst_YXH58OLDB1rZ2rdDOHmNGFl0";

const retry = (fn: any) => {
  return polly()
    .waitAndRetry(2)
    .executeForPromise(async () => {
      try {
        return await fn();
      } catch (e) {
        return Promise.reject(e);
      }
    });
};

const retryForStatus = (fn: any, status: any) => {
  return polly()
    .waitAndRetry(5)
    .executeForPromise(async () => {
      try {
        let response = await fn();
        if (response.status !== status) {
          return Promise.reject(response);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    });
};

export async function createThread() {
  const thread = await retry(() => openai.beta.threads.create());
  return thread.id;
}

export async function pollForPlaylist(
  threadId: string,
  runId = null,
): Promise<Array<Song>> {
  if (runId !== null) {
    await retryForStatus(
      () => openai.beta.threads.runs.retrieve(threadId, runId),
      "completed",
    );
  }
  let response;
  try {
    response = await retry(() => openai.beta.threads.messages.list(threadId));
  } catch (e) {
    console.log(e);
    return [];
  }
  try {
    const songs = JSON.parse(response.data[0].content[0].text.value)
      .playlist as Array<Song>;
    return songs.map((s) => ({ ...s, verified: false }));
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function generatePlaylist(description: string, threadId: string) {
  await retry(() =>
    openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: description,
    }),
  );
  const run = await retry(() =>
    openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    }),
  );
  return run.id;
}
