# Bin Duty

Shared rota for emptying the dustbin: Kamran, then Abid, then Kamran again.
Free to host on Netlify. Roommates need no account, only the link.

## What it does

- Admin (Omar) taps "New load ready". The app picks the next person and starts the clock.
- Admin sends the link to the WhatsApp group (button included).
- The person opens the link, or scans the QR sticker on the dustbin, and taps "I did it".
- Tracks jobs done, on-time count and days late per person.
- From 1 full day after the load was opened it shows an angry emoji and the Bengali message.

## Files

    public/index.html              the whole page
    netlify/functions/api.mjs      the API (reads and writes the shared state)
    netlify/lib/logic.mjs          the rotation rules
    netlify.toml, package.json     Netlify settings

## Deploy (about 10 minutes, free)

1. Make a free GitHub account if you do not have one. Create a new repository
   (name it `bin-duty`, Public or Private both work).
2. Unzip this project. In the repository click "Add file" > "Upload files" and drag in
   everything inside the unzipped folder, keeping the folders (`public`, `netlify`) intact.
   Click "Commit changes".
3. Go to netlify.com, sign up free (use "Continue with GitHub").
4. "Add new site" > "Import an existing project" > GitHub > pick `bin-duty`.
   Leave Build command empty. The publish directory and functions folder are already in
   `netlify.toml`. Click Deploy.
5. Site configuration > Environment variables > Add a variable:
   key `ADMIN_PIN`, value a PIN or passphrase only you know. Use 8 or more characters.
6. Deployments > Trigger deploy > Deploy site (so the PIN is picked up).
7. Optional: Site configuration > Change site name, for a short link like `flatbin.netlify.app`.
8. Open the site on your phone. Scroll down, open "Admin", enter the PIN, tap Unlock.
   Download the QR sticker from there and print it.
9. Tap "New load ready" and send the link to the group.

## Things to know

- Free plan: Netlify gives 300 credits a month and stops the site when they run out.
  Normal use here costs a few credits. Each production deploy costs 15 credits, so do not
  redeploy dozens of times a month.
- Turn off Deploy Previews and branch deploys (Site configuration > Build & deploy) and
  deploy only from your main branch, so tests cannot touch the live data.
- Anyone with the link can tap "I did it". Only the admin PIN can open, remove or reopen loads.
- To change the rotation, edit the `next` line in `derive()` in `netlify/lib/logic.mjs`
  and the `NAME` list and scoreboard names in `public/index.html`.
