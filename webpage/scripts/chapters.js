// Slugs also identify saved progress. Keep them stable when source folders move.
export const chapters = [
  { slug: "overview", number: "01", title: "Start here", path: "README.md", core: true, era: "1960s", exerciseRevision: 2 },
  { slug: "00-introduction", number: "02", title: "Meet the app & tools", path: "02-introduction/README.md", core: true, era: "1970s", exerciseRevision: 2 },
  { slug: "prerequisites", number: "03", title: "Get ready", path: "03-prerequisites/README.md", core: true, era: "soundcheck", exerciseRevision: 2 },
  { slug: "01-assessment", number: "04", title: "Assess the app", path: "04-assessment/README.md", core: true, era: "1980s", exerciseRevision: 2 },
  { slug: "02-planning", number: "05", title: "Choose the plan", path: "05-planning/README.md", core: true, era: "1990s", exerciseRevision: 2 },
  { slug: "03-upgrade-execution", number: "06", title: "Upgrade & check", path: "06-upgrade-execution/README.md", core: true, era: "2000s-2010s", exerciseRevision: 2 },
  { slug: "04-cloud", number: "07", title: "Plan for Azure", path: "07-cloud/README.md", core: true, era: "2020s", exerciseRevision: 2 }
];

export const references = [
  { path: "shared-legacy-app/README.md", title: "Legacy sample", era: "workbench" },
  { path: "examples/modernized/README.md", title: "Completed reference", era: "2050s" },
  { path: "examples/azure/README.md", title: "Azure helper" },
  { path: "examples/assessments/bookcatalog/README.md", title: "Previous BookCatalog sample run", era: "1950s" },
  { path: "examples/assessments/bookcatalog/assessment-excerpts.md", title: "Recorded BookCatalog assessment" },
  { path: "examples/assessments/bookcatalog/planning-excerpts.md", title: "Recorded BookCatalog plan" },
  { path: "examples/assessments/bookcatalog/execution-excerpts.md", title: "BookCatalog upgrade in progress" },
  { path: "02-introduction/code/README.md", title: "Optional console sample" },
  { path: "docs/learner-record.md", title: "Optional learner record" },
  { path: "docs/data-transfer.md", title: "Optional data-transfer lab" },
  { path: "docs/advanced-checks.md", title: "Optional application checks" },
  { path: "docs/author-filter.md", title: "Optional author-filter challenge" },
  { path: "07-cloud/deployment.md", title: "Optional Azure deployment" },
  { path: "tools/BookCatalog.Data/README.md", title: "Selected-record helper" },
  { path: "docs/instructor-guide.md", title: "Optional instructor guide", era: "briefing" },
  { path: "docs/modernization-reference.md", title: "Modernization reference guide" },
  { path: "docs/validation.md", title: "Maintainer validation" },
  { path: "docs/writing.md", title: "Writing guide" },
  { path: "webpage/README.md", title: "Website guide" }
];

export const sectionAliases = {
  "overview": { "course-structure": "course-structure", "getting-started": "work-on-your-own-copy" },
  "00-introduction": {
    "chapter-00-introduction-to-modernization": "chapter-02-meet-bookcatalog-and-the-tools",
    "prerequisites": "check-before-installing",
    "your-first-assessment": "optional-your-first-assessment",
    "checkpoint-can-you-explain-the-starting-state": "checkpoint-what-would-a-build-miss"
  },
  "01-assessment": {
    "chapter-01-assessment": "chapter-04-assess-bookcatalog",
    "running-the-assessment": "ask-for-an-assessment",
    "reading-the-compatibility-report": "read-the-report-in-a-useful-order",
    "what-the-report-means-for-your-timeline": "what-the-numbers-do-not-prove",
    "troubleshooting": "if-the-assessment-differs-or-fails"
  },
  "02-planning": {
    "chapter-02-planning": "chapter-05-choose-the-upgrade-plan",
    "generating-the-upgrade-plan": "ask-for-the-plan",
    "5-task-breakdown": "define-runnable-groups"
  },
  "03-upgrade-execution": {
    "chapter-03-upgrade-execution": "chapter-06-upgrade-and-check-the-application",
    "approving-the-plan": "authorize-one-execution-group",
    "troubleshooting": "recover-without-discarding-your-work"
  },
  "04-cloud": {
    "chapter-04-going-to-the-cloud": "chapter-07-assess-and-plan-for-azure",
    "cleaning-up": "delete-the-dedicated-lab-group",
    "verifying-the-live-app": "publish-your-learner-application",
    "prerequisites": "check-tools-access-and-costs-first"
  }
};
