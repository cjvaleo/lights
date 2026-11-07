# TR Lights: conversion tracking and form test

## What changed (Nov 6, 2026)

| Area | Before | After |
| --- | --- | --- |
| Hero | Headline, deals and buttons. No photo of a real job above the fold. | Real install photo (top of the hero on phones, under the buttons on desktop) plus a trust row: Fully insured · Lights included · Takedown included · Based in Toms River. |
| Quote form | No proof near the form. | Three real install photos and "Recent TR Lights installs" above the form. |
| Permanent-lights path | Permanent page buttons went to the generic form. | `/?svc=permanent#quote` opens the form with Permanent lights already picked. `?svc=christmas` and `?svc=both` work too (use them in ads). |
| Confirmation | Repeated "we look up your house" and always said "Your deal is locked in." | Shows the address and phone, says the deal line only when a deal applies, and lists the 3 next steps. |
| Lead rows | Leads tab showed where/colors only. Christmas vs. permanent, house height and the promised deal were missing. | Details now include Wants, House, Lights on, Colors. Notes include the promised deal and the form version. |
| Attribution | A visitor who landed on a guide or the permanent page from Google, then clicked to the form, was recorded as "Direct." | Every page saves the first source and landing page for the visit, so the form records the real source. |
| Tracking | None. | Funnel events go to the **Events** tab; the **Funnel** tab adds them up. |
| Test | None. | Form A (4 steps) vs. Form B (2 steps: service + house, then contact info), 50/50. |

## Events recorded (Events tab)

| Event | When |
| --- | --- |
| `view` | Homepage loads (one per visit counts in the Funnel) |
| `cta` | Any button that goes to the quote form. Label says which one (hero, sticky, header, service card, popup, deal card). |
| `text` | A "Text us" button is tapped |
| `start` | First pick or typing in the form |
| `step` | Reached a later step, or tried to send with a field missing (`missing name+phone`) |
| `submit` | Request sent: `saved` (in the sheet), `fallback to Messages`, or `Messages only` |

Bots and localhost visits are skipped. Each row has the visit ID, form version, source, landing page and phone vs. desktop.

## The five numbers (Funnel tab)

1. **Quote-button click rate** = visits that clicked a quote button ÷ visits
2. **Form start rate** = visits that started the form ÷ visits
3. **Form completion rate** = visits that sent ÷ visits that started
4. **Qualified lead rate** = leads you marked Quoted, Booked or Done ÷ leads
5. **Booked-job rate** = leads marked Booked or Done ÷ leads

Numbers 4 and 5 only work if the **Status** column in the Leads tab is kept current. Mark a lead **Lost** if it's outside the area or not a fit.

## How to read the form test

- Decide on **form completion rate** (sent ÷ started). It moves the most and needs the fewest visitors.
- Rough sample size: to reliably see a jump from about 40% to 55% completion, each version needs about **170 form starts**. To see a smaller change, it needs more.
- Call it only when **both** are true: the p-value cell is under 0.05 **and** each version has 30+ sent requests. Before that, a "winner" is usually noise.
- Also check that the winner doesn't lower the **qualified lead rate**. The 2-step form asks less, so leads may need more back-and-forth.
- If there's no clear winner by Dec 15, keep Form A and run the test again next season.
- To end the test: in `index.html`, set `TR_TEST_ON=false` (everyone gets Form A). To roll out B, change the fallback `'A'` to `'B'`.
- Force a version to check it: `?form=a` or `?form=b`.

## Ads and flyers

Add `?src=` so the Source column is right: `?src=fb&ad=3`, `?src=flyer`, `?src=doorhanger`, `?src=sign`, `?src=qr`. Add `&svc=permanent` for permanent-light ads.

## Not changed on purpose (needs Christian's call)

- **Deal deadlines.** `CHRISTMAS_DEALS` repeats $100 off with new end dates (Nov 15, Dec 1, Dec 15), so "Book by Nov 15" quietly extends. Either make Nov 15 the real end date, or show the actual last date.
- **"December fills up fast"** (FAQ). Keep it only while it's true. When the calendar is close to full, replace it with real availability ("3 install days left the week of Dec 8").
- **Click-to-call.** The site is text-first, which suits roof work. Add a call button only if calls get answered.
- **Reviews and testimonials.** None on the site yet. Add real ones with first name and town once collected.
