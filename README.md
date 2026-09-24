# Stable-AI GUI

A Next.js, React, and TypeScript frontend for selecting models and datasets, running red-team tests and benchmarks, and
viewing security reports. Shared state is managed with Zustand.

## Table of contents

- [Getting started](#getting-started)
- [Pages](#pages)
- [Main models](#main-models)
- [Zustand stores](#zustand-stores)
- [Backend calls](#backend-calls)

## Getting started

```bash
# Install all the modules that are needed
npm install

# eventually, if something goes wrong
npm audit fix --force

# run the application
npm run dev
```

Open `http://localhost:3000`. Run the backend separately; its default address is `http://localhost:8000`. Host, port,
and execution device can be changed through the global settings modal. For production, run `npm run build`, then
`npm start`.

## Pages

Routes follow the Next.js App Router structure under [app](app).

| Page            | Route                                              | Description                                                                                       |
|-----------------|----------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Home            | `/`                                                | Browse, filter, refresh, and select models and datasets from backend repositories.                |
| Testing lab     | `/pages/redteam/test`                              | Placeholder introduction to attack testing.                                                       |
| Evasion         | `/pages/redteam/test/evasion`                      | Attack an uploaded image; compare predictions, confidence, and perturbations.                     |
| Privacy         | `/pages/redteam/test/privacy`                      | Membership inference, property inference, reconstruction, and model inversion tests.              |
| Privacy alias   | `/tasks/redteam/test/privacy`                      | Renders the same Privacy page.                                                                    |
| Jailbreak       | `/pages/redteam/test/jailbreak`                    | Configure language-model attacks and attacker/judge models; inspect conversations and saved runs. |
| Benchmark       | `/pages/redteam/benchmark`                         | Run selected attacks on a model/dataset pair and monitor job progress.                            |
| Reports         | `/pages/report`                                    | Browse stored model reports and open a security report.                                           |
| Security report | `/pages/report/reportTITANN`                       | View metrics, benchmark comparisons, vulnerabilities, and export a PDF.                           |
| Attack details  | `/pages/report/reportTITANN/AttackPage?atkId=<id>` | Inspect metrics and parameters for an attack in the selected report.                              |

Report detail pages require a report selected in the current app state. Global settings is a modal. Data Quality
navigation is commented out and has no page implementation.

## Main models

The main TypeScript data models live in [app/interfaces](app/interfaces).

| Model                                                                                 | Purpose                                                                                             | Definition                                                                |
|---------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| `InfoProps`                                                                           | Shared ID, name, task, domain, input dimensions, and optional metadata.                             | [homePageInterface.tsx](app/interfaces/homePageInterface.tsx)             |
| `ModelInfo`, `Transformation`                                                         | Model metadata, training dataset, parameter count, provider/type, and preprocessing.                | [homePageInterface.tsx](app/interfaces/homePageInterface.tsx)             |
| `DatasetInfo`                                                                         | Shared metadata plus the dataset's `num_samples`.                                                   | [homePageInterface.tsx](app/interfaces/homePageInterface.tsx)             |
| `RegisterObjectProps`, `ParametersProps`                                              | Registered attacks/metrics, supported tasks, and configurable parameters.                           | [NNInterfaces.tsx](app/interfaces/NNInterfaces.tsx)                       |
| `JobResult`, `AttackStatus`                                                           | Benchmark progress, results, timings, errors, and status: pending, in progress, finished, or error. | [NNInterfaces.tsx](app/interfaces/NNInterfaces.tsx)                       |
| `ModelReportProps`, `ReportAttackProps`, `BenchmarkDataProps`                         | Model reports, per-attack metrics/parameters, and benchmark comparisons.                            | [reportInterfaces.tsx](app/interfaces/reportInterfaces.tsx)               |
| `SingleAttackInput`, `SingleAttackProps`                                              | Evasion requests and results: adversarial images, predictions, and confidence.                      | [testInterfaces.tsx](app/interfaces/testInterfaces.tsx)                   |
| `JailbreakAttackOutput`, `JailbreakTurn`, `BubbleInterface`, `JailbreakHistoryEntry`  | Jailbreak results, conversation turns, displayed messages, and saved-run summaries.                 | [testInterfaces.tsx](app/interfaces/testInterfaces.tsx)                   |
| `PrivacyDatasetInfo`, `PrivacyModelInfo`, `PrivacyAttackOutput`, `PrivacyArtifactRef` | Privacy targets, datasets, metrics, reconstructions, and artifacts.                                 | [privacyInterfaces.tsx](app/interfaces/privacyInterfaces.tsx)             |
| `ServerConfig`                                                                        | Backend connection, repository paths, upload limits, and worker settings.                           | [globalVariableInterface.tsx](app/interfaces/globalVariableInterface.tsx) |

AI models come from the backend repository. The frontend's `ModelType` supports :

* `Ollama`
* `Gemini`
* `OpenRouter`
* `HuggingFace`
* `plain`
* `timm`
* `torch_script`
* `torch_dynamo`
* `onnx`
* `api`

Tasks are:

1. `classification`,
2. `segmentation`
3. `detection`
4. `language`

jailbreak tests use a target model and optional attacker/judge models.

## Zustand stores

Components read shared state through store hooks and update it through setter actions. Persistence uses Zustand's
`persist` middleware.

| Store                                                   | State and actions                                                                                                                                                                 | Persistence                                                                                                                                                |
|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`useBackendVariablesStore`](app/store/globalStore.tsx) | Hostname, port, and device with individual setters. Defaults: `localhost`, `8000`, `gpu`.                                                                                         | `sessionStorage`, key `app-storage-global`; only hostname and port persist.                                                                                |
| [`useNNTrustStore`](app/store/nnTrustStore.tsx)         | Selected model/dataset, repository lists, attack/metric registries, selected attacks, benchmark state, and selected report.                                                       | `localStorage`, key `app-storage-models`; persists selections, lists, and registries. Benchmark execution state and the selected report are not persisted. |
| [`useJailbreakStore`](app/store/jailbreakStore.ts)      | Prompt, goal, attack parameters, attacker/judge models, conversations, results, execution flag, and backend startup ID. `setResults` updates results; `clearResults` resets them. | `localStorage`, key `app-storage-jailbreak-v6`; all serializable state persists.                                                                           |

The NNTrust store is explicitly rehydrated after the root layout mounts. The Jailbreak page clears stored results when
it detects a backend restart or fails to connect.

## Backend calls

Paths are relative to `http://{hostname}:{port}`. Calls are implemented
in [TITANNServices](app/functionalities/TITANNServices) and relevant pages/components. POST bodies use JSON.

| Method | Endpoint                                                         | Brief description                                                                    |
|--------|------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| GET    | `/`                                                              | Read the backend startup ID to detect restarts.                                      |
| GET    | `/info/variables`                                                | Load server configuration.                                                           |
| GET    | `/info/devices`                                                  | List execution devices.                                                              |
| GET    | `/info/path?path=<path>`                                         | Check whether a server path exists.                                                  |
| POST   | `/info/saveConfiguration`                                        | Save settings using a `new_config` object.                                           |
| GET    | `/repository/getList?model_type=<type>&repo_path=<repository>`   | List models, datasets, or reports.                                                   |
| POST   | `/repository/upload`                                             | Upload report JSON; helper is not called by current pages.                           |
| GET    | `/info/attacks`                                                  | Load registered attacks and parameters.                                              |
| GET    | `/info/metrics`                                                  | Load evaluation metrics.                                                             |
| POST   | `/test/single_attack`                                            | Run an evasion attack on an image.                                                   |
| POST   | `/test/jailbreaking`                                             | Run a jailbreak with configured models, prompt, and attack.                          |
| GET    | `/test/jailbreaking/history?attack_id=<id>`                      | List saved runs for an attack.                                                       |
| GET    | `/test/jailbreaking/history/<attackId>/<entryId>`                | Load a saved jailbreak run.                                                          |
| GET    | `/info/privacy/datasets`                                         | List privacy datasets.                                                               |
| GET    | `/info/privacy/models`                                           | List privacy models.                                                                 |
| POST   | `/privacy/run?device=<device>`                                   | Start a privacy job; device is `cpu` or `cuda`.                                      |
| GET    | `/privacy/status/<jobId>`                                        | Poll privacy job status.                                                             |
| GET    | `/privacy/result/<jobId>`                                        | Retrieve privacy metrics, metadata, and artifact references.                         |
| GET    | `/privacy/artifact/<jobId>/<artifactId>`                         | Fetch a generated artifact for display.                                              |
| POST   | `/job/start_benchmark`                                           | Start a benchmark for a model, dataset, and attacks.                                 |
| GET    | `/job/getJobs?benchmark_id=<id>`                                 | Poll jobs; optional filters: `model_id`, `dataset_id`, comma-separated `attacks_id`. |
| GET    | `/job/getReport?benchmark_id=<id>&model_id=<id>&dataset_id=<id>` | Retrieve a benchmark's model report.                                                 |
| GET    | `/job/getJobsId`                                                 | List job IDs; helper is not called by current pages.                                 |
| GET    | `/report/benchmarks`                                             | Retrieve benchmark comparisons; optional `id` filter.                                |
| POST   | `/report/benchmarks`                                             | Submit job configuration through the unused `startNewJob` helper.                    |
| POST   | `/report/generate_pdf`                                           | Generate a PDF from the selected report.                                             |

Saved jailbreak runs also support `DELETE /test/jailbreaking/history/<attackId>/<entryId>`. Legacy URL constants
in [urls.ts](app/properties/urls.ts) have no current call sites and are excluded from this table.
