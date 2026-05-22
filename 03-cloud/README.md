![Chapter 03: Going to the Cloud](images/chapter-header.png)

You've modernized the BookCatalog app to .NET 10. Now it's time to ship it: you'll use the GitHub Copilot app modernization extension's cloud-migration workflow to deploy the app to Azure. By the end, the modernized app runs in the cloud, and you'll know how to clean up the resources to avoid ongoing costs.

## 🎯 Learning Objectives

By the end of this chapter, you'll have:
- Used the extension's cloud-migration workflow to prepare the modernized BookCatalog app for Azure
- Deployed the .NET 10 app to Azure App Service and verified it runs in production
- Understood which Azure resources the extension provisions (App Service, SQL Database, etc.) and how to customize them
- Cleaned up Azure resources to avoid unnecessary costs

> ⏱️ **Estimated Time**: ~30 minutes (10 min setup + 15 min deployment + 5 min cleanup)

---

## ✅ Prerequisites

**From Previous Chapters:**
- Completed the Act workflow and have a working .NET 10 app (Chapter 02)
- BookCatalog solution open in Visual Studio 2022
- The app builds and runs locally without errors

**For This Chapter:**
- Active Azure subscription (free trial or paid) — [Sign up here](https://azure.microsoft.com/free/)
- Visual Studio 2022 signed in to your Azure account (**Tools** → **Options** → **Azure Service Authentication**)
- Contributor or Owner role on the target Azure subscription

> ⚠️ **Cost:** The default configuration uses Azure free tier resources where available. Estimated cost: **$0** during the free trial period. **Delete the resource group when done** to avoid ongoing charges. If you're past the free tier, expect ~$10–20/month for a basic App Service + SQL Database.

---

## ☁️ Starting the Cloud Migration

Trigger the extension's cloud-migration workflow:

1. Open the **GitHub Copilot** menu in Visual Studio.
2. Select **Deploy to Azure** → **Cloud Migration**.
3. Choose the **BookCatalog** project.
4. Select your Azure subscription from the dropdown.
5. Click **Start Deployment**.

**Expected output:**

The extension analyzes your project and prepares the Azure deployment configuration:

![Screenshot: Cloud Migration wizard shows "Analyzing project dependencies... Detecting database requirements... Generating deployment template..."](images/cloud-migration-wizard.png)

---

## 🔧 Reviewing the Deployment Configuration

The extension generates a default configuration based on your app's requirements:

| Resource | Default | Why |
|----------|---------|-----|
| **App Service Plan** | B1 (Basic tier, 1 core, 1.75 GB RAM) | Sufficient for small production workloads. Scales up if needed. |
| **App Service** | Linux, .NET 10 runtime | Runs your ASP.NET Core app. Linux is cheaper than Windows for .NET apps. |
| **Azure SQL Database** | Basic tier (5 DTU, 2 GB storage) | Matches the local SQL Server database used by Entity Framework. |
| **Region** | East US (default) | You can change this to a region closer to your users. |

### When to Customize

Accept the defaults if:
- This is a test deployment or proof-of-concept.
- Expected traffic is low (< 100 requests/day).

Customize if:
- **Higher performance needed:** Upgrade App Service Plan to S1 (Standard) or higher for production workloads.
- **Data residency requirements:** Change the region to match regulatory needs (e.g., EU for GDPR).
- **Cost sensitivity:** Downgrade SQL Database to Serverless tier if the app is idle most of the day.

To customize:

1. Click **Customize Deployment** in the wizard.
2. Change the App Service Plan tier, region, or database SKU.
3. Click **Apply**.

> 💡 **Tip:** For this tutorial, accept the defaults. You can scale up later via the Azure Portal.

---

## 🚀 Deploying to Azure

After reviewing the configuration, deploy the app:

1. Click **Deploy** in the wizard.
2. Confirm the resource group name (e.g., `rg-bookcatalog-prod`).
3. Click **Confirm**.

**Expected output:**

The extension provisions Azure resources and deploys your app. This takes 5–10 minutes:

![Screenshot: Deployment progress shows "Creating resource group... Provisioning App Service... Deploying application code... Applying database migrations..."](images/deployment-progress.png)

When complete, the wizard displays the App Service URL:

```
Deployment succeeded!
  └── App Service URL: https://bookcatalog-abc123.azurewebsites.net
  └── Resource Group: rg-bookcatalog-prod
  └── Region: East US
```

---

## ✅ Verifying the Deployment

Open the App Service URL in your browser:

```
https://bookcatalog-abc123.azurewebsites.net
```

**Expected output:**

The BookCatalog home page loads:

![Screenshot: Browser shows BookCatalog home page hosted on Azure](images/app-deployed.png)

Test the same critical user flows you tested locally:
- Navigate to `/Books` — does the book list load from Azure SQL Database?
- Create a new book — does it save?
- Edit an existing book — do changes persist?

If the app works, your deployment is successful!

### Checking Logs

If the app fails to load (e.g., HTTP 500 error), check the Application Insights logs:

1. Open the [Azure Portal](https://portal.azure.com).
2. Navigate to **Resource Groups** → `rg-bookcatalog-prod` → **Application Insights**.
3. Click **Logs** and query for exceptions:

```kusto
exceptions
| where timestamp > ago(1h)
| order by timestamp desc
```

**Common issues:**
- **Connection string not set:** The extension auto-migrates `appsettings.json`, but if the connection string is missing, add it manually in **App Service** → **Configuration** → **Connection strings**.
- **Database migrations not applied:** Run migrations manually using the Azure Cloud Shell:

```bash
dotnet ef database update --connection "Server=tcp:bookcatalog-sql.database.windows.net,1433;..."
```

---

## 🧹 Cleaning Up

When you're done testing, delete the Azure resources to avoid charges:

**Option 1: Delete via Azure Portal**

1. Open the [Azure Portal](https://portal.azure.com).
2. Navigate to **Resource Groups**.
3. Click `rg-bookcatalog-prod`.
4. Click **Delete resource group**.
5. Type the resource group name to confirm.
6. Click **Delete**.

**Expected output:**

```
Resource group 'rg-bookcatalog-prod' is being deleted. This may take a few minutes.
```

**Option 2: Delete via Azure CLI (faster)**

Open a terminal and run:

```bash
az group delete --name rg-bookcatalog-prod --yes --no-wait
```

**Expected output:**

```
Resource group 'rg-bookcatalog-prod' is being deleted in the background.
```

Verify deletion:

```bash
az group list --output table
```

The resource group should no longer appear in the list.

> ⚠️ **Important:** Deleting the resource group removes **all resources** inside it (App Service, SQL Database, Application Insights). You cannot undo this. If you want to keep the app running, skip the cleanup step.

---

## ✅ You Did It!

You've completed the full modernization journey: assessed a legacy ASP.NET MVC 5 app, identified blockers, executed the upgrade to .NET 10, and deployed the modernized app to Azure. You've learned a repeatable workflow you can apply to your own legacy codebases.

---

## 🔑 Key Takeaways

1. The extension's cloud-migration workflow automates Azure resource provisioning (App Service, SQL Database) and deploys your .NET 10 app with minimal manual configuration.
2. Default configurations use free/low-cost tiers suitable for test deployments. Customize the App Service Plan, region, or database SKU for production workloads.
3. Verify deployments by testing critical user flows in the cloud. Check Application Insights logs if issues arise.
4. Always delete Azure resource groups after testing to avoid ongoing charges. Use `az group delete` for fast cleanup.

---

## 🛠️ Troubleshooting

**Problem:** The deployment fails with "Unable to find Azure subscription."

**Solution:** Sign in to Azure in Visual Studio. Go to **Tools** → **Options** → **Azure Service Authentication** → **Account Selection**. Choose your Azure account and ensure your subscription is listed.

---

**Problem:** The app deploys successfully but returns HTTP 500 on every request.

**Solution:** Check Application Insights logs in the Azure Portal (see [Checking Logs](#checking-logs)). Common causes:
- Missing connection string (add it in **App Service** → **Configuration** → **Connection strings**).
- Database migrations not applied (run `dotnet ef database update` via Azure Cloud Shell).
- Missing environment variable (check `appsettings.json` vs. App Service configuration).

---

**Problem:** The Azure SQL Database connection times out.

**Solution:** Verify the App Service's IP address is allowed in the SQL Database firewall:
1. Open the [Azure Portal](https://portal.azure.com).
2. Navigate to **SQL databases** → `bookcatalog-db` → **Firewalls and virtual networks**.
3. Check **Allow Azure services and resources to access this server** is enabled.
4. Click **Save**.

---

> 📚 **What's next?** Share your modernized app with your team, explore the [.NET 10 migration guide](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10) to learn about new features, or contribute to this series by opening an issue or pull request on GitHub!
