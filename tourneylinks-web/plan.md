We will restructure the Super Admin Dashboard (`src/app/system/dashboard/page.tsx`) to create a clear 4-step pipeline.

1. Create a new section called "Ingestion Pipeline (Sequential)".
2. Move the 4 core triggers into this section in order:
   - Step 1: Headless Spider Sweep (`SmartSpiderTrigger`)
   - Step 2: SaaS Platform Sweep (`PlatformSearchTrigger`)
   - Step 3: Universal AI Normalizer (`CheckbackTrigger`)
   - Step 4: Course Intelligence (`CrawlerTrigger`)
3. Move the `ApifySyncTrigger` to an "Optional Fallbacks" or "Manual Tools" section below the pipeline.
4. Clean up the top right header where `CheckbackTrigger` and `CrawlerTrigger` used to live.

I will implement this by replacing the relevant JSX in `src/app/system/dashboard/page.tsx`.
