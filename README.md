# Aerata Demo Local

A desktop preview of Aerata. Use it to review the layout, navigation and mission workspace on a laptop or desktop, with the browser in landscape.

## Open the preview

1. Install Node.js 22.13 or later, which includes npm.
2. Download and unzip this repository, or clone it with Git.
3. Open a terminal in the project folder—the one containing `package.json`—and run:

```sh
npm ci
npm run dev
```

4. Open [localhost:4375](http://127.0.0.1:4375) in your browser.

Keep the terminal running while you review. Press **Ctrl+C** in the terminal when you’re done. You’ll appear as **Admin**, with no sign-in or password required.

## What to try

1. On **Today**, expand each box, switch between boxes and minimize them. Try resizing the browser too.
2. Go to **Missions → New mission → Expand Definition**. Enter a mission name and, optionally, a start and end time.
3. Explore **Area & airspace**, **Crew & assets**, and **Documents & release**. Your entries stay in place as you switch boxes.
4. Choose **Save local draft**, then return to **Missions** to find it in the list.
5. Browse the other sections to review their item-list and contents layouts. Those registers are intentionally empty.

This is a UI preview with no connected backend or sample records. Saved drafts clear when you reload the page; unsaved edits are lost when you leave a mission. Readiness and eligibility are not assessed.

## Share feedback

Tell us which page you were on, what you tried, and what felt unclear or didn’t work as expected. A screenshot and your browser window size help with layout issues.
