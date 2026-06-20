import { prisma } from "../src/lib/prisma";

let isRunning = true;

async function start() {
  logInfo("Starting Auto Facebook Group Poster...");
  
  const context = await setupBrowserSession();
  const page = await context.newPage();

  // First, let's go to Facebook to ensure we are logged in.
  await page.goto("https://www.facebook.com");
  logInfo("Please ensure you are logged into Facebook in the opened browser window.");
  logInfo("Waiting 10 seconds for you to verify...");
  await new Promise(r => setTimeout(r, 10000));

  while (isRunning) {
    try {
      // Check for automation settings
      const setting = await prisma.automationSetting.findFirst();
      if (setting && !setting.isActive) {
        logInfo("Automation is currently PAUSED. Waiting 30 seconds...");
        await new Promise(r => setTimeout(r, 30000));
        continue;
      }

      // Find the next pending post queue
      const queueItem = await prisma.postQueue.findFirst({
        where: { status: "PENDING" },
        include: { group: true, property: true },
        orderBy: { createdAt: "asc" }
      });

      if (!queueItem) {
        // No items to post, wait a bit
        await new Promise(r => setTimeout(r, 15000));
        continue;
      }

      logInfo(`Processing queue item: Property '${queueItem.property.name}' to Group '${queueItem.group.name}'`);

      // Update status to POSTING
      await prisma.postQueue.update({
        where: { id: queueItem.id },
        data: { status: "POSTING" }
      });

      try {
        let imageUrls = [];
        try {
          imageUrls = JSON.parse(queueItem.images || "[]");
        } catch (e) {}

        await postToFacebookGroup(page, queueItem.group.url, queueItem.caption, imageUrls);

        // Success
        await prisma.postQueue.update({
          where: { id: queueItem.id },
          data: { status: "SUCCESS", postedAt: new Date() }
        });
        logSuccess(`Successfully posted to '${queueItem.group.name}'`);

        // Delay between posts to avoid spam
        const minDelay = setting?.minDelay || 60;
        const maxDelay = setting?.maxDelay || 180;
        logInfo(`Waiting randomly between ${minDelay} and ${maxDelay} seconds before next post...`);
        await randomDelay(minDelay * 1000, maxDelay * 1000);

      } catch (err: any) {
        // Failed
        logError(`Failed to post to '${queueItem.group.name}': ${err.message}`);
        await prisma.postQueue.update({
          where: { id: queueItem.id },
          data: { status: "FAILED", errorMessage: err.message }
        });
        
        // Wait a bit on error before trying the next one
        await new Promise(r => setTimeout(r, 30000));
      }

    } catch (e: any) {
      logError(`Main loop error: ${e.message}`);
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  await context.close();
  logInfo("Automation stopped.");
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  logInfo("Caught interrupt signal, shutting down...");
  isRunning = false;
});

start().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
