# MotionText Migration Plan (Editor)

Goal: Replace the editor’s video/subtitle rendering path with motiontext-renderer while preserving UX and timeline semantics.

## Scope & Non‑Goals
- In scope: subtitle/text rendering, plugin effects, timeline sync, skip logic integration, preview UI.
- Out of scope: backend APIs, transcription pipeline, storage formats (SRT/VTT/ASS export remain).

## Milestones

1) Audit & Baseline (M0)
- Inventory current paths: `VideoPlayer` (overlay), `videoSegmentManager`, `src/utils/editor/*` clip ops, store usage.
- Capture baseline behavior (play/pause, skip deleted, subtitle changes).
- Deliverable: short audit notes + screenshots, list of public APIs touched.

2) Share MotionText Infra (M1)
- Promote/reuse Asset Store pieces: `pluginLoader.ts`, `scenarioGenerator.ts`, `useMotionTextRenderer.ts` into a shared module (e.g., `src/utils/motiontext/`), re-export from original paths to avoid breakage.
- Ensure GSAP and plugin loader initialized once app-wide.
- Deliverable: shared module, no behavioral changes.

3) Editor Overlay Skeleton (M2)
- Add `EditorMotionTextOverlay` component mounted absolutely over the `<video>` in `VideoPlayer`.
- Attach the same `<video>` to renderer via `attachMedia(videoRef.current)`; size to 16:9 stage.
- Deliverable: renderer mounts; empty scenario renders without errors.

4) Scenario Mapping v1 (M3)
- Implement `generateEditorScenarioForClip(clip, settings, stage=640×360)` returning one text child + pluginChain.
- On timeupdate, load the active clip’s scenario; debounce updates (120ms).
- Deliverable: active subtitle shows via MotionText; old HTML overlay hidden behind a flag.

5) Timeline Sync & Skip (M4)
- Drive renderer with video time via `renderer.seek(video.currentTime)`; pause/play follow video.
- Keep `videoSegmentManager` for skip/deletion; use it to determine active clip only.
- Deliverable: seamless sync during scrubbing, skip-to-next works.

6) Scenario Mapping v2 (M5)
- Optional: multi-cue scenario (contiguous plugin segments) to avoid reloads between clips.
- Preload plugins per scenario using `preloadPluginsForScenario`.
- Deliverable: smooth transitions across clip boundaries.

7) Settings & Feature Flag (M6)
- Add `EDITOR_MOTIONTEXT` flag (env or store). Toggle old/new overlay.
- Deliverable: default off in production, on in dev.

8) Tests & QA (M7)
- Unit: scenario generator, time mapping adapter.
- Integration (jsdom): overlay mounts, updates on store changes.
- E2E (Playwright): subtitle changes on play, skip over deletions, resize stability.
- Deliverable: green CI (`yarn lint`, `type-check`, `test`, `test:e2e`).

9) Rollout & Cleanup (M8)
- Enable flag by default, monitor; remove old subtitle overlay + dead utils when stable.
- Deliverable: migration notes, code cleanup PR.

## Risks & Mitigations
- Resize/timing jitter: always `attachMedia`, debounce updates.
- Plugin registration order: call `configurePluginLoader()` before first render.
- Performance: preload only needed plugins; keep scenario structure stable.

## Acceptance Checklist
- Subtitles render via MotionText with chosen plugin.
- Sync with video time including scrubbing and rate changes.
- Deleted ranges skipped; no flicker at boundaries.
- Tests pass; no regressions in editor controls.
