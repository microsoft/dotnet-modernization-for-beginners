export const illustrations = [
  {
    id: "journey", document: "README.md", era: "1960s",
    title: "One app, a new foundation",
    caption: "Follow the seven chapters from the starting point through Azure planning.",
    description: "Start with BookCatalog, meet the tools, get ready, read the assessment report, shape the plan, run and review the upgrade, and prepare an Azure plan."
  },
  {
    id: "workflow", document: "02-introduction/README.md", era: "1970s",
    title: "Assess, plan, upgrade, review",
    caption: "Read the report, shape the plan, then review and run the app.",
    description: "Read the modernization agent's assessment report. Add a requirement only if needed. Request an upgrade plan, review its choices, and check its tasks. Let the agent make the approved changes. Review the changes and run the application. If a requirement was missed, return to the plan."
  },
  {
    id: "soundcheck", document: "03-prerequisites/README.md", era: "soundcheck",
    title: "Soundcheck: get ready",
    caption: "Check your tools, open BookCatalog, and try the app before the assessment.",
    description: "Three soundcheck tickets show the setup sequence: check your installed tools and Copilot access, open the BookCatalog solution in your learner copy, then run the app and try adding and editing a sample book. If your tools are ready, go straight to running BookCatalog."
  },
  {
    id: "route-choices", document: "03-prerequisites/README.md", era: "soundcheck",
    title: "One app, two upgrade routes",
    caption: "Start with the same BookCatalog app. Choose stage-by-stage direction or a continuous Autopilot workflow.",
    description: "BookCatalog on .NET Framework 4.8 is the starting point for both routes. In Visual Studio, direct assessment, planning, and execution through Guided flow and use the course's in-place EF Core approach. In the Copilot app, attach the folder, give one goal, and let Autopilot carry the work forward while you follow Canvas and steer as needed. This route keeps EF6 during a temporary side-by-side migration. Both routes end with a .NET 10 app that you run and check after saving an edit and restarting."
  },
  {
    id: "autopilot-flow", document: "03-prerequisites/copilot-app.md", era: "autopilot",
    title: "One goal, continuous progress",
    caption: "Copilot carries the upgrade through its stages. You follow Canvas, steer when needed, and try the result.",
    description: "Attach the BookCatalog folder and give the goal of upgrading to .NET 10. Autopilot handles assessment, planning, code changes, and validation without a new prompt at each stage. Follow the work in Canvas and steer the plan when needed without restarting the workflow. Then run BookCatalog yourself and check that a saved book edit remains after restarting the application."
  },
  {
    id: "investigation", document: "04-assessment/README.md", era: "1980s",
    title: "Make the report useful",
    caption: "Read the agent's report. Add a requirement only if needed.",
    description: "Open the assessment report, confirm BookCatalog and .NET 10, and read the findings. Add an application requirement if something is missing, or keep the report unchanged. Save the report for planning and for discussions with your team."
  },
  {
    id: "plan", document: "05-planning/README.md", era: "1990s",
    title: "Shape the upgrade plan",
    caption: "Request the plan, review the choices, then check its tasks before execution.",
    description: "Ask the modernization agent to create a .NET 10 plan. Choose an in-place ASP.NET Core MVC upgrade with EF Core and demo database creation. Read the saved plan and check that its final task includes launching, adding a book, editing it, and restarting. Run the app in Chapter 06, not while planning."
  },
  {
    id: "architecture", document: "06-upgrade-execution/README.md", era: "2000s-2010s",
    title: "Inside the upgraded application",
    caption: "Follow the request to the database and the rendered response back to the browser.",
    description: "The browser sends a request to BooksController. The controller uses the injected ApplicationDbContext, which executes operations against BookCatalogModernizedLab. The controller selects a Razor view. The view renders the response for the browser."
  },
  {
    id: "azure", document: "07-cloud/README.md", era: "2020s",
    title: "A proposed home in Azure",
    caption: "Separate runtime access from administrator setup. This picture is a plan, not a deployed environment.",
    description: "A public sample user reaches BookCatalog on App Service. The app reads its connection setting from Key Vault and accesses Books in Azure SQL. Its runtime managed identity authorizes both operations. An approved administrator creates the schema from the EF Core model and adds demo seed data. The sample has no application-user authentication."
  }
];

export function illustrationPath(id, mode) {
  if (!illustrations.some(item => item.id === id)) throw new Error(`Unknown illustration: ${id}`);
  if (!["light", "dark"].includes(mode)) throw new Error(`Unknown color mode: ${mode}`);
  return `docs/illustrations/${id}-${mode}.svg`;
}
