# createTestHarness: RPC call that creates a Workflow deadlocks Node

Minimal reproduction for a deadlock in Wrangler's `createTestHarness()` since
wrangler 4.125.0 (miniflare 5.20260820.0-alpha).

## Run

```sh
npm install
npm run repro
```

Requires Node.js 22.

## Expected

```text
listen() resolved
calling startWorkflow()...
OK: created workflow instance <id>
```

This is the output with `wrangler@4.124.0`.

## Actual

With `wrangler@4.125.0` through `4.149.0`:

```text
listen() resolved
calling startWorkflow()...
```

The process then stops making progress. The 30-second `setTimeout` in
`repro.mjs` never fires, because the Node.js main thread is blocked.

## What the repro does

- `worker.js` exports a `WorkerEntrypoint` with an RPC method,
  `startWorkflow()`, that calls `env.MY_WORKFLOW.create()`.
- `repro.mjs` starts the Worker with `createTestHarness()`, gets the
  entrypoint with `getWorker().getExport()`, and calls `startWorkflow()`.

## Versions

| wrangler | miniflare | Result |
| --- | --- | --- |
| 4.124.0 | 5.20260815.0-alpha | passes |
| 4.125.0 | 5.20260820.0-alpha | hangs |
| 4.149.0 | 5.20261006.1-alpha | hangs |

Change the `wrangler` version in `package.json` to compare.
