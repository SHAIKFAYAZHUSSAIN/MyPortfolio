import type { NextConfig } from "next";

const config: NextConfig = {
  // Thread workers allow verification in environments that restrict child processes.
  experimental: { workerThreads: true, useTypeScriptCli: false },
};

export default config;
