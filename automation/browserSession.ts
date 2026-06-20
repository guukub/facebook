import { chromium, BrowserContext } from "playwright";
import path from "path";

export async function setupBrowserSession(): Promise<BrowserContext> {
  const userDataDir = path.join(process.cwd(), "automation", "user_data");
  
  // We use persistent context to keep the Facebook login session alive.
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false, // The user requested headed mode so they can see it or login if needed
    viewport: { width: 1280, height: 720 },
    args: ['--disable-notifications'] // Disable FB notifications popup
  });

  return context;
}
