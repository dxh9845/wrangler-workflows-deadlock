import { WorkerEntrypoint, WorkflowEntrypoint } from "cloudflare:workers";

export class MyWorkflow extends WorkflowEntrypoint {
  async run() {
    return "done";
  }
}

export default class Api extends WorkerEntrypoint {
  async fetch() {
    return new Response("ok");
  }

  // Called from Node through the test harness RPC proxy.
  async startWorkflow() {
    const instance = await this.env.MY_WORKFLOW.create();
    return instance.id;
  }
}
