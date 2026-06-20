import { Page } from "playwright";
import { delay } from "./utils/delay";

export async function postToFacebookGroup(page: Page, groupUrl: string, caption: string, imageUrls: string[]) {
  // 1. Navigate to the group
  await page.goto(groupUrl, { waitUntil: "networkidle" });
  await delay(3000);

  // 2. Click "Write something..." area to open the create post modal
  // Note: Facebook's DOM is highly dynamic. We use text or aria-label selectors that are somewhat stable, but they might need adjusting depending on the language of the FB account.
  // Assuming English or Thai FB.
  const writePostSelectors = [
    `div[role="button"]:has-text("Write something...")`,
    `div[role="button"]:has-text("เขียนอะไรบางอย่าง...")`,
    `div:text("Write something...")`,
    `div:text("เขียนอะไรบางอย่าง...")`,
    `span:text("Write something...")`,
    `span:text("เขียนอะไรบางอย่าง...")`
  ];

  let clicked = false;
  for (const selector of writePostSelectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible()) {
      await el.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    throw new Error("Could not find the 'Write something' button.");
  }

  await delay(3000);

  // 3. Find the text area and type the caption
  // Usually the modal has a role="textbox" or contenteditable
  const textbox = page.locator(`div[role="textbox"][contenteditable="true"]`).first();
  await textbox.waitFor({ state: "visible" });
  
  // Facebook requires typing slowly or pasting. fill() might not trigger React events perfectly, but let's try fill or pressSequentially
  await textbox.click();
  // Using keyboard typing is safer for Facebook's editor
  await page.keyboard.insertText(caption);
  
  await delay(2000);

  // 4. Upload Images (Simplified)
  // If there are images, we need to handle file choosers. 
  // Since images are URLs, in a full implementation we'd download them locally first.
  // For this prototype, we'll skip the actual file download/upload step unless local paths are provided, to prevent complex temp file management in this snippet.
  if (imageUrls && imageUrls.length > 0) {
    // console.log("Images found, skipping actual upload for MVP unless local files are used.");
    // Example of file upload if we had local paths:
    // const [fileChooser] = await Promise.all([
    //   page.waitForEvent('filechooser'),
    //   page.locator('div[aria-label="Photo/Video"], div[aria-label="รูปภาพ/วิดีโอ"]').click()
    // ]);
    // await fileChooser.setFiles(localFilePaths);
    // await delay(5000);
  }

  // 5. Click Post button
  const postButtonSelectors = [
    `div[role="button"]:has-text("Post")`,
    `div[role="button"]:has-text("โพสต์")`,
    `div[aria-label="Post"]`,
    `div[aria-label="โพสต์"]`
  ];

  let posted = false;
  for (const selector of postButtonSelectors) {
    const btn = page.locator(selector).last(); // Usually the one in the modal is the last one in DOM or inside a dialog
    // A better approach is to scope to the dialog
    const dialogBtn = page.locator('div[role="dialog"]').locator(selector).first();
    
    if (await dialogBtn.isVisible()) {
      const isDisabled = await dialogBtn.getAttribute('aria-disabled');
      if (isDisabled === 'true') {
        throw new Error("Post button is disabled. Maybe caption is empty or still loading.");
      }
      await dialogBtn.click();
      posted = true;
      break;
    }
  }

  if (!posted) {
    throw new Error("Could not find the 'Post' button in the modal.");
  }

  // Wait for post to complete (modal disappears)
  await page.locator('div[role="dialog"]').waitFor({ state: "hidden", timeout: 15000 });
  await delay(2000);
}
