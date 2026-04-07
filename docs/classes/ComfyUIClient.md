# ComfyUIClient

## Purpose
Client for a ComfyUI server. Queues workflows, polls status, downloads images, and saves them locally.

## Construction
- `new ComfyUIClient(config)`: reads `config.imagegen.server.host`/`port` and builds base URL.

## Instance API
- `generatePromptId()`: UUID for prompts.
- `queuePrompt(workflow, promptId)`: POSTs to `/prompt`, returns `{ success, promptId, data|error }`.
- `getHistory(promptId)`: GETs `/history/:id`, returns `{ success, data, isComplete }`.
- `getImage(filename, subfolder, folderType)`: GETs `/view`, returns `Buffer`.
- `waitForCompletion(promptId, maxWaitTime, pollInterval)`: polls until outputs are available or times out; returns image list.
- `testConnection()`: GETs `/queue`, returns boolean (note: uses `baseTimeoutMilliseconds`, which must exist in scope).
- `sleep(ms)`: Promise-based delay helper.
- `saveImage(imageData, imageId, originalFilename, saveDirectory)`: writes file and returns `{ success, filename, filepath, size }`.

## Notes
- `queuePrompt` and `getHistory` catch and return errors instead of throwing.
- `queuePrompt` error detail fallback chain: `error.response.data` → `error.message` → `error.code` (e.g. `ECONNREFUSED`) with URL → generic message. This ensures useful diagnostics on Windows where connection errors can have blank `error.message`.
- `saveImage` ensures output directory exists.

## Debugging
Run `node scripts/test_comfyui.js` (or `node scripts/test_comfyui.js 8000` to test a specific port) to:
1. Probe connectivity to ComfyUI on both the configured port and fallback port 8000
2. Check available checkpoints and custom nodes
3. Render the workflow template with sample data and validate JSON output
4. Submit the rendered workflow to ComfyUI with full error reporting
