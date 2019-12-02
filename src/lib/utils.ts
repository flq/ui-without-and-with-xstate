import { memoize } from "./memoize";

export type SimpleHandler = () => any;

export const isRunningInJest = memoize(() => {
  return process.env.JEST_WORKER_ID !== undefined;
});
