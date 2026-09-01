# Visual thesis — the recovery console

## Direction and rationale

Review Backlog Forecast is a **mid-century instrument panel**, not a dashboard template. A returning learner is already anxious about an opaque number; the interface should feel like a calm, legible planning instrument whose knobs have visible consequences. Warm enamel, inked labels, ruled paper, brass indicators, and a single vermilion signal borrow the confidence of a 1950s laboratory console without imitating a brand or turning the task into nostalgia theatre.

The product uses one deliberately light treatment. The warm paper field and dark panel are semantic parts of the instrument metaphor, and painting them explicitly gives stronger hierarchy than an unrelated dark theme. Browser color-scheme remains `light`; contrast is verified against the fixed palette.

## Palette

| Token | Hex | Role |
| --- | --- | --- |
| Paper | `#F3EBD8` | Page background; quiet planning surface |
| Paper deep | `#E3D6B9` | Rules, inactive tracks, secondary surfaces |
| Enamel | `#173F3A` | Primary instrument panel and headings |
| Ink | `#172522` | Body copy |
| Muted ink | `#53625D` | Supporting copy; 5.4:1 on paper |
| Dial cream | `#FFF8E8` | Inputs and high-emphasis readouts |
| Vermilion | `#C9462E` | Primary action and warning needle |
| Vermilion dark | `#8E2D1D` | Hover and focus contrast on warm paper |
| Brass | `#B8892D` | Selection and forecast markers |
| Focus gold | `#F4CC75` | Keyboard focus on enamel; 7.60:1 on enamel and 3.12:1 on the vermilion action |
| Aged brass focus | `#A88230` | Import focus between cream and enamel; 3.36:1 on cream and 3.26:1 on enamel |
| Success | `#286348` | Feasible/complete status |
| Danger | `#A52E25` | Invalid or over-cap state |

No gradient is used. Fine rules and radial tick marks create depth through construction, not gloss.

## Typography

- Display/labels: `Arial Narrow`, `Roboto Condensed`, `Franklin Gothic Medium`, system sans-serif. Uppercase is reserved for tiny panel legends; headings stay sentence case.
- Reading/numbers: `Georgia`, `Times New Roman`, serif for human warmth; numeric readouts switch to `ui-monospace`, `SFMono-Regular`, `Consolas` with tabular figures.
- No font is fetched. System stacks keep first load tiny and fully offline.
- Scale: 0.75rem instrument label, 0.875rem annotation, 1rem body, 1.25rem lead, clamp(2rem–4.75rem) title. Body line height is 1.55 and text measure tops out near 68 characters.

## Spacing and layout

An 8px base rhythm with 4px for optical corrections. Primary steps are 16, 24, 32, 48, 64, and 96px. Desktop uses an asymmetric 12-column bench: copy and controls occupy five columns, the forecast plot seven. At 840px the instrument stacks. At 390px, decorative hero detail recedes, the policy cards become a horizontal snap rail, and table detail becomes compact daily strips; no essential assumption is dropped.

Cards are used only for three independently selectable policies. Form fields live together on one continuous console. 44px minimum controls and 12px gaps keep touch and keyboard paths generous.

## Interaction grammar

- **Set the dials:** labelled number inputs and file import change the queue model.
- **Run forecast:** the singular vermilion action recalculates all policies.
- **Tune a channel:** selecting Steady, Deadline, or Gentle moves one brass indicator and changes the detailed schedule below.
- **Read the tape:** daily rows show `regular + overdue = total`, minutes, and remaining queue; a textual summary mirrors every chart.
- **Commit deliberately:** “Use this plan” stores only the chosen plan on this device. Import never modifies an Anki collection.

All actions return immediate text feedback in a polite live region. File errors identify the accepted columns and next action. Saved-plan replacement is reversible for five seconds through Undo.

## Motion policy

Forecast marks rise from their baseline and the selector slides from its originating policy over 220ms with an ease-out curve. Update and offline notices fade over 180ms. Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes are immediate; hierarchy remains through color, weight, and position.

## Original asset plan and provenance

The hero uses one generated editorial still: a small tabletop forecasting console whose three physical tracks suggest the three policies. It clarifies “preview before acting” and stays secondary to the form. Interface dials, tick marks, logo, and status symbols are hand-authored CSS/SVG so they remain sharp and accessible.

**Prompt sheet**

- Subject: compact 1950s tabletop planning instrument with three adjacent forecast tracks, paper queue slips, brass knobs, no person.
- World/materials: practical laboratory bench; sea-green painted metal, warm cream paper, dark rubber, brushed brass, one vermilion needle.
- Light/lens: soft overcast window light, crisp editorial product photograph, slightly elevated 35mm view, shallow but readable depth.
- Palette words: warm parchment, deep bottle green, oxidized brass, restrained vermilion, charcoal ink.
- Negative list: text, letters, numbers, logos, watermark, people, hands, brand marks, glowing screens, cyberpunk, gradients, clutter, warped geometry.
- Production prompt: “Editorial product still of a compact mid-century 1950s tabletop planning instrument, three adjacent physical forecast tracks with blank paper queue slips and precise tick marks, sea-green enamel casing, brushed brass knobs, a single restrained vermilion needle, dark rubber feet, on a warm parchment workbench, soft overcast window light, slightly elevated 35mm view, crisp practical industrial design, calm and trustworthy, no people, no hands, no readable text, no letters, no numbers, no logos, no watermark, no brands, no glowing screen, no cyberpunk, no gradient, no clutter.”

Generation: Azure AI Foundry factory image deployment via `/opt/fleet/lib/gen-image.sh`, 2026-08-27. Generated imagery is original for this product. Source PNG and exact prompt sidecar live in `assets/src/`; shipped WebP renditions are optimized derivatives.

The 1200 × 630 social preview is a center-cropped, compressed derivative of the same reviewed source image. No new subject matter was generated. Shipped asset names include their content hashes so the static host can cache them immutably.

Demo mode applies its banner state from a 204-byte same-origin bootstrap before first paint. This keeps the persistent sandbox notice in the initial layout and prevents a delayed module from shifting the mobile page. It introduces no additional motion.
