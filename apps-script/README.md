# Sending quote requests to a Google Sheet

`Code.gs` receives quote requests from the wizard on trlightsnj.com and writes
one row per lead into a Google Sheet. Takes about five minutes to set up.

## 1. Make the Sheet

1. Go to <https://sheets.new> and name it something like **TR Lights — Quote Requests**.
2. Leave it empty. The script creates a `Leads` tab with headers on the first submission.

## 2. Add the script

1. In that Sheet: **Extensions → Apps Script**.
2. Delete the placeholder `function myFunction() {}`.
3. Paste in the entire contents of `Code.gs`.
4. Optional: to get an email on every new lead, set `NOTIFY_EMAIL` near the top,
   e.g. `var NOTIFY_EMAIL = 'cjvaleo@gmail.com';`
5. Click the **save** icon.

Leave `SHEET_ID` as `''`. Because the script lives inside the Sheet, it already
knows which Sheet to write to.

## 3. Deploy it as a web app

1. Top right: **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** `quote receiver`
   - **Execute as:** **Me (your@gmail.com)**
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Google asks for authorization the first time:
   **Authorize access** → pick your account → you'll see
   *"Google hasn't verified this app"* → **Advanced** →
   **Go to (project name) (unsafe)** → **Allow**.
   This warning is expected — it's your own script, and it's unverified only
   because you haven't submitted it for Google's review process.
6. Copy the **Web app URL**. It ends in `/exec`.

> **"Who has access" must be "Anyone."**
> "Anyone with Google account" makes the site's submissions fail, because
> visitors aren't signed in to Google when they submit.

## 4. Check the endpoint

Paste the `/exec` URL into a browser tab. You should see:

```json
{"ok":true,"message":"TR Lights quote endpoint is live."}
```

If you get a sign-in page instead, "Who has access" isn't set to **Anyone** —
redo step 3.

## 5. Put the URL into the site

In `index.html`, find this line near the top of the `<script>` block (~line 510):

```js
var SHEET_URL='';
```

Paste your URL between the quotes:

```js
var SHEET_URL='https://script.google.com/macros/s/AKfycb.....................b1c/exec';
```

Commit and push — Vercel redeploys automatically.

## 6. Test it end to end

Open the live site, run the wizard through with your own name and cell number,
and submit. You should land on the *"Got it! We'll text you your exact price
within 24 hours"* screen, and a new row should appear in the `Leads` tab.

## Updating the script later

After editing `Code.gs`, changes do **not** go live until you redeploy:
**Deploy → Manage deployments →** pencil icon **→ Version: New version → Deploy**.
The `/exec` URL stays the same, so there's nothing to change on the site.

## What a row looks like

| Column | Example | Notes |
| --- | --- | --- |
| Timestamp | `2026-09-26 11:24:03` | server-side, when the row was written |
| Name | `Chris Valeo` | required in the form |
| Phone | `(732) 555-0123` | required in the form |
| Email | `chris@example.com` | optional — may be blank |
| Address | `12 Ocean Ave, Toms River, NJ` | required in the form |
| Where | `Roofline, Peaks, Garage` | comma separated |
| Colors | `Warm white, Multicolor` | comma separated |
| Bushes | `3` | count |
| Trees | `1` | count |
| Extras est. ($) | `275` | **extras only** — see below |
| Discount ($) | `150` | `$50` site discount, `$150` before Oct 31 |
| Source | `www.trlightsnj.com` | hostname the request came from |

### About "Extras est."

This is **not** a whole-job quote. The site deliberately never quotes the
roofline, because that needs the measured footage — which is the whole point of
"we measure and text you the exact price."

The number is a floor for the add-ons only: bushes at the firm `$50` each, plus
trees at the `$125` small-tree rate. A medium tree is `$250` and large trees are
priced on site, so the real extras figure can be higher — never lower.

## If a save ever fails

The site is built so a failed save can't cost you a lead. If the request errors
out or takes more than 10 seconds, the wizard falls back to the old behavior:
it opens Messages with the full request pre-filled, and shows the copy-paste box
for desktop visitors. You'd still get the lead as a text, just not a row.

Failures are logged under **Apps Script → Executions** if you need to look.
