import { createTestHarness } from "wrangler";

const server = createTestHarness();
await server.update({
  root: import.meta.dirname,
  workers: [
    {
      config: {
        name: "repro",
        main: "worker.js",
        compatibility_date: "2026-03-11",
        workflows: [{ name: "my-workflow", binding: "MY_WORKFLOW", class_name: "MyWorkflow" }],
      },
    },
  ],
});
await server.listen();
console.log("listen() resolved");

// This timer cannot fire while the main thread is blocked, so the process
// hangs instead of printing the timeout message.
setTimeout(() => {
  console.log("FAIL: startWorkflow() did not return within 30s");
  process.exit(1);
}, 30_000);

const api = await server.getWorker("repro").getExport();
console.log("calling startWorkflow()...");
const id = await api.startWorkflow();
console.log(`OK: created workflow instance ${id}`);
await server.close();
process.exit(0);
