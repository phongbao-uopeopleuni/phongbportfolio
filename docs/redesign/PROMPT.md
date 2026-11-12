# Redesign brief: portfolio home page + new /album page

Redesign the home page of this portfolio into a calm, card-based layout with almost no icons, and add an `/album` page. The approved design, with final Vietnamese copy, is in `docs/redesign/reference.html`. Open it in a browser before you start and match its layout, spacing and copy.

## Context

- Repo: `phongbportfolio`. React 19, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), react-router-dom 7, TypeScript.
- Live: https://phongbao-uopeopleuni.github.io/phongbportfolio/ (Vite `base` is `/phongbportfolio/` when `GITHUB_PAGES=true`; `vite.config.ts` copies `index.html` to `404.html` for SPA routing — keep that).
- All home sections live in `src/App.tsx`. All visible text lives in `src/i18n.tsx` (`vi` and `en`). The interactive labs live in `src/features/showcase/`.
- `docs/redesign/reference.html` is a static prototype. Its `#/album` hash stands in for the real `/album` route, and its section ids are Vietnamese; use the English ids listed below instead.
- New images are already in the repo: `public/images/projects/labs/assessment-data-integrity-lab.webp` and `public/images/projects/labs/cpu-scheduling-visualizer.webp` (lab card covers).

## Ground rules

1. Work on a new branch, `redesign/card-layout`. Commit in logical steps. Do not push, deploy or open a PR until I say so.
2. Do not change lab logic or data: `src/features/showcase/demos/**`, `src/features/showcase/data/registry.ts`, and the tests. Showcase pages only inherit the new colour tokens.
3. `App.tsx` must not import `registry.ts` (it would pull the showcase into the home chunk; see `enabled.ts`). Lab card copy for the home page goes in `i18n.tsx`.
4. Every visible string goes through `src/i18n.tsx` in both `vi` and `en`. The copy tables at the end of this brief are final.
5. Keep the self-hosted fonts in `src/fonts.css`. Never add Google Fonts.
6. Icon policy: the only icons allowed on the home page, header, footer and album page are the theme toggle (sun/moon) and the mobile menu button. Text glyphs are allowed: `↗` on links that leave the site, `→` on the primary button and on internal "go to" links. Remove every other `lucide-react` icon from those places. Showcase internals may keep theirs.
7. If this brief conflicts with the code, or a step is ambiguous, stop and ask instead of guessing.

## 1. Design tokens (`src/index.css`)

Keep the existing Tailwind token names so utilities such as `bg-panel` and `text-ink` keep working. Change their values, add `--color-raised`, and support light and dark themes.

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--color-surface` | Page background | `#F2F3F5` | `#0E1013` |
| `--color-panel` | Section cards | `#FAFAFB` | `#16191D` |
| `--color-raised` (new) | Inner cards, active nav pill | `#FFFFFF` | `#1E2227` |
| `--color-line` | Borders | `#E3E5E8` | `#2A2F36` |
| `--color-ink` | Primary text | `#111317` | `#F1F3F5` |
| `--color-muted` | Secondary text | `#5A6270` | `#A0A8B3` |
| `--color-accent` | Primary button, active state, focus ring | `#C2410C` | `#FB923C` |
| `--color-accent-ink` | Text on accent | `#FFFFFF` | `#111317` |

- Light values go in `@theme`. Dark values override the same variables under `[data-theme="dark"]` on `<html>`.
- Measured contrast: ink on panel 17.8:1 (light) and 15.9:1 (dark); muted on panel 5.9:1 and 7.3:1; accent-ink on accent 5.2:1 and 8.2:1. Re-check any value you change.
- Theme choice: add a tiny inline script in `index.html` that sets `data-theme` before first paint, from `localStorage` (wrapped in try/catch) or else `prefers-color-scheme`. The toggle saves the choice.
- Radii: section card 28px (20px below 768px), inner card 20px, images 14px, pills 999px.
- Card shadow, light only: `0 1px 2px rgb(0 0 0 / .04), 0 8px 24px rgb(0 0 0 / .04)`; none in dark.
- Set `html { font-size: 100%; }` (it is 112.5% today). All sizes below are px at a 16px root.
- Remove the blurred hero grid, the preloader and custom-cursor styles, and the marquee styles once nothing uses them.

Type scale:

| Role | Font | Size | Weight / spacing |
| --- | --- | --- | --- |
| H1 (hero) | Inter | `clamp(40px, 6vw, 64px)`, line-height 1.05 | 700, -0.02em |
| H2 (section title) | Inter | `clamp(28px, 3.5vw, 40px)` | 700, -0.015em |
| H3 (card title) | Inter | 20px | 600 |
| Lead | Inter | 20px (18px mobile), line-height 1.5, muted | 400 |
| Body | Inter | 16px, line-height 1.6 | 400 |
| Label / tag | JetBrains Mono | 12px (tags 11px), uppercase | 500, 0.12em |

## 2. Home page structure (`/`)

Order: Header (sticky) → Hero (`#home`) → 01 Projects (`#projects`) → 02 Websites & other work (`#works`) → 03 Experience (`#timeline`) → 04 Contact (`#contact`) → Footer.

- Container: max-width 1120px, centred, 16px side gutter.
- Spacing: 32px from the header to the hero, 32px between section cards (24px on mobile), 48px above the footer.
- Remove these components from the page: `Preloader`, `CustomCursor`, `About`, `Metrics` (its numbers move into the hero), `Strengths`, `Workflow`, `Achievements` (merged into 03), `Album` marquee (moves to `/album`), `CanvaAlbum` section (becomes one card in 02).

## 3. Header

- Sticky, 16px from the top, 64px tall, a pill-shaped bar aligned to the container: `--color-panel` at 80% opacity, `backdrop-filter: blur(12px)`, 1px `--color-line` border.
- Left: wordmark "Bảo Phong" (16px / 600) with a mono label "EDTECH & ASSESSMENT" under it; hide the label below 420px. The link is at least 44px tall.
- Centre: a nav pill with 4 text links: Projects, Websites, Experience, Contact. The active item has a `--color-raised` background and ink text, and follows the scroll position (IntersectionObserver). Remove the `/showcase` link; the labs are reached from section 01, and the `/showcase` route stays.
- Right: "VI / EN" as text buttons using the existing `setLocale`, then the theme toggle (44px round button with an `aria-label`).
- Below 768px: the nav becomes a menu button (`aria-expanded`, `aria-controls`) that opens a full-width sheet with the same links. VI / EN and the theme toggle stay visible. Esc and choosing a link close it.
- From `/album`, the nav links go to `/#projects` and so on. Make the home page scroll to `location.hash` after navigation.

## 4. Hero

One card, two columns at 7 : 5, padding 64px (40px tablet, 24px × 20px mobile).

- Left, top to bottom: eyebrow (mono label); H1; lead; two 48px pill buttons, primary "View projects →" to `#projects` and secondary "Download CV" (existing `cvUrl`); text links GitHub ↗ · Email · Facebook ↗; a stats row of 3 items above a 1px line.
- Stats: 300+ learners supported, 5.000+ (en: 5,000+) academic data points, 70% manual time reduced. Reuse `metrics.students`, `metrics.dataPoints`, `metrics.timeOpt`. Drop `metrics.automationTools`.
- Right: the existing portrait (`src/assets/hero/profile.jpg`), 4 : 5, `object-fit: cover`, radius 20px, at most 380px wide. Remove the fake terminal window and the "$ whoami" line.
- Mobile: one column; the portrait goes below the stats, at most 260px wide.

## 5. Section template

Build one reusable `Section` component used by 01–04:

- Card: `--color-panel`, 1px border, radius 28px, padding 48px (40px tablet, 20px mobile), `aria-labelledby` its H2.
- Header row (flex, space-between, aligned to the bottom; stacks on mobile). Left: index "01" (mono 14px, muted), label "// …" (mono 12px), H2, description (muted, max 60ch). Right, optional: a pill link (mono 12px uppercase, 1px border, at least 44px tall).
- 32px between the header row and the body; 16px between cards.

## 6. Section contents

Inner cards share one style: `--color-raised`, 1px border, radius 20px, card shadow. A card with a destination is a single `<a>` (or router `Link`); on hover it lifts 2px and its border darkens to muted. No hover lift under `prefers-reduced-motion`. Tags are mono 11px uppercase pills on `--color-surface`, label only.

**01 Projects.** Four wide cards, one per row: image 40% on the left (16 : 10, `object-fit: cover`, `object-position: top left`), text on the right. Each card has a category label, title, two lines of description, an optional one-line "Result", tags and at most one text link. Order:

1. CMS progress monitoring: existing image; no link, so a plain card. The impact changes from about 60% to about 70% in both languages.
2. Timetable tool: merge the old "Timetable builder tool" and "Timetable tool demo" into one card, using the demo's first image (`/images/projects/tkb/z7810881838440_….jpg`), linking to the existing YouTube video.
3. Assessment score operations lab: cover `labs/assessment-data-integrity-lab.webp`, internal link to `/showcase/assessment-data-integrity-lab`.
4. CPU scheduling visualizer lab: cover `labs/cpu-scheduling-visualizer.webp`, internal link to `/showcase/cpu-scheduling-visualizer`.

The header pill links to the existing GitHub profile ("GitHub repositories ↗").

**02 Websites & other work.** Grid of 3 columns (2 at 768–1023px, 1 below 768px), text cards with no screenshots: type label, name, the existing `role` text, `stack` tags, "Visit site ↗".

- Show the `works` entries in data order, skipping any with `wip: true` (the 2 sites on temporary domains come back when their real domains are live). The `highlight` entry (the genealogy app) spans 2 columns on desktop.
- Last card: the Canva publications, with 3 thumbnails (designs 1, 5 and 9, 4 : 3, radius 8px). Clicking it opens the existing Canva lightbox, restyled like the album lightbox in section 8.

**03 Experience & education.** Header pill: "Work album →" to `/album`.

- A timeline list: a 168px mono date column on the left, then role, organisation and bullets on the right; 1px lines between entries; one column on mobile. 4 entries, copy below.
- Below it, two columns: Education (2 entries, 120px date column) and Achievements & certificates (5 lines, 120px label column).

**04 Contact.** Two text cards side by side (one column on mobile), then a centred row: primary "Send an email" button (`mailto:`), the phone as a `tel:` link, and GitHub ↗.

**Footer.** One plain row inside the container with a 1px line above, 14px muted: "© 2026 Bảo Phong" on the left; Album · GitHub · Facebook · Email as text links on the right. No repeated navigation.

## 7. Clean-up

- Delete the removed components and their unused imports, including unused `lucide-react` icons.
- Delete unused i18n keys in both languages: `about`, `strengths`, `workflow`, `achievements`, `certs`, `metrics.automationTools`, the `hero.badge*` keys, and anything else no longer read. Keep `album` and `canvaAlbum`.
- If `motion` or `lucide-react` is no longer imported anywhere, remove it from `package.json`. Otherwise leave it.

## 8. New `/album` page

- Add a lazy-loaded route `/album` in `App.tsx`. Its document title is "Album — Bảo Phong".
- Same header and footer. No nav item is active. A small "Back to home" text link sits above the card.
- One section card without an index number: label "// Work album", H1 "Moments at work" (32–48px), the existing `album.note`, and "30 photos" on the right (mono label).
- Grid: 4 columns (3 at 768–1023px, 2 below 768px), 8px gap, 4 : 3 tiles with `object-fit: cover`, radius 14px. Each tile is a `<button>` with an `aria-label`. Images use `loading="lazy"` and `decoding="async"`.
- Lightbox: a native `<dialog>` opened with `showModal()`. It shows the whole photo (`object-fit: contain`, max height 100vh − 180px), a counter such as "4 / 30", the caption when there is one, and three text buttons: Previous photo · Next photo · Close. Arrow keys switch photos, Esc closes, a click on the backdrop closes, and focus returns to the tile that opened it.
- Captions: render `album.photos[].caption` when it is not empty. Leave the captions empty for now; I will supply all 30 later.
- If `scripts/optimize-album.mjs` makes it simple, generate 480px grid versions of the album photos and load the full file only in the lightbox. Skip this if it gets complicated.

## 9. Showcase pages

They use the same tokens. Check `/showcase` and both lab pages in light and dark. `src/features/showcase/styles/glass.css` was tuned for a dark background; if any text drops below 4.5:1 in the light theme, make the affected glass panels opaque (`--color-panel`) instead of changing their layout.

## 10. Acceptance checks

Run all of these before reporting back:

1. `npm run lint`, `npm run test:assessment`, `npm run build`, and a GitHub Pages build with `GITHUB_PAGES=true` all pass.
2. Start the dev server (the `portfolio-dev` preview in `.claude/launch.json`, port 3000). Check `/`, `/album`, `/showcase` and both lab pages at 360, 768 and 1280px wide, in both themes and both languages.
3. No horizontal scrolling at 360px. Every tap target is at least 44 × 44px.
4. Keyboard only: the skip link works, focus rings are visible (2px accent, 2px offset), the mobile sheet and the lightbox can be operated and closed, and focus returns correctly.
5. Body text meets 4.5:1 contrast in both themes.
6. A direct load of `/phongbportfolio/album` works on the Pages build (404 fallback).
7. Compare each section with `docs/redesign/reference.html` side by side.

Then report: what changed per file, the i18n keys you removed, anything you could not match, and screenshots of the home page at 1280px and 360px if you can take them.

## Copy (final)

The reference HTML holds the same Vietnamese copy in context. Existing keys not listed here stay as they are.

### Header and hero

| Key | vi | en |
| --- | --- | --- |
| Nav | Dự án · Website · Kinh nghiệm · Liên hệ | Projects · Websites · Experience · Contact |
| Brand label | EdTech & Assessment | EdTech & Assessment |
| Eyebrow | Educational Technology & Assessment · Huế | Educational Technology & Assessment · Huế, Vietnam |
| H1 | Xin chào, tôi là Bảo Phong | Hi, I'm Bảo Phong |
| Lead | Hơn 5 năm giảng dạy và vận hành đào tạo – khảo thí. Tôi kết nối nghiệp vụ giáo dục với hệ thống, dữ liệu và AI để chuẩn hóa quy trình và giữ dữ liệu đánh giá chính xác. | Five-plus years in teaching and in training and examination operations. I connect education practice with systems, data and AI to standardize workflows and keep assessment data accurate. |
| Primary button | Xem dự án → | View projects → |

### 01 Projects

| Key | vi | en |
| --- | --- | --- |
| Label | // Dự án | // Projects |
| Title | Giải pháp từ bài toán vận hành giáo dục | Practical solutions from real education operations |
| Description | Công cụ tôi xây cho công việc đào tạo – khảo thí thực tế, và hai lab tương tác mô phỏng lại quy trình đó. | Tools I built for real training and examination work, plus two interactive labs that recreate those workflows. |
| "Result" label | Kết quả | Result |
| CMS description | Kiểm tra tiến độ thủ công tốn thời gian và dễ bỏ sót sinh viên. Công cụ tự đồng bộ dữ liệu và dựng dashboard theo dõi hoàn thành, ngoại lệ, nhắc việc. | Manual progress checks took time and missed delayed learners. The tool syncs progress data and builds a dashboard for completion, exceptions and follow-ups. |
| CMS result | Giảm khoảng 70% thời gian báo cáo thủ công. | Cut manual reporting time by about 70%. |
| CMS tags | Python · API CMS · Dữ liệu học tập | Python · CMS API · Learning data |
| Timetable category | Lập kế hoạch học vụ | Academic planning |
| Timetable title | Công cụ làm thời khóa biểu | Timetable builder tool |
| Timetable description | Bộ quy tắc trên Excel phát hiện trùng ca, trùng tiết và trùng giảng viên trước khi ban hành, kèm video hướng dẫn để bàn giao cho đội đào tạo. | Excel validation rules catch clashing shifts, periods and instructors before a timetable is published, with a demo video for handing it over to training teams. |
| Timetable result | Bắt được trùng lịch trước khi ban hành, bớt vòng kiểm tra thủ công lặp lại. | Catches schedule clashes before release and removes repeated manual checks. |
| Timetable tags | Excel · Kiểm tra xung đột | Excel · Conflict checks |
| Timetable link | Xem video demo ↗ | Watch demo video ↗ |
| Assessment lab category | Lab tương tác · Khảo thí | Interactive lab · Assessment |
| Assessment lab title | Mô phỏng vận hành dữ liệu điểm | Assessment score operations |
| Assessment lab description | Xử lý lô điểm của 2.000 học sinh: tiếp nhận, chuẩn hóa, kiểm tra, xử lý ngoại lệ, đối soát, khóa và công bố có lưu vết. | Process a 2,000-learner score batch: receive, normalize, validate, resolve exceptions, reconcile, lock and issue with an audit trail. |
| Assessment lab tags | React · TypeScript · Rule engine | React · TypeScript · Rule engine |
| CPU lab category | Lab tương tác · Hệ điều hành | Interactive lab · Operating systems |
| CPU lab title | Trình mô phỏng lập lịch CPU | CPU scheduling visualizer |
| CPU lab description | Nhập bảng tiến trình, chọn FCFS, SJF, SRTF, Round Robin hoặc Priority, rồi xem CPU chia thời gian theo từng nhịp cùng các chỉ số hiệu năng. | Enter a process table, pick FCFS, SJF, SRTF, Round Robin or Priority, and watch the CPU divide time tick by tick alongside the performance metrics. |
| CPU lab tags | React · TypeScript · SVG | React · TypeScript · SVG |
| Lab link | Thử lab → | Try the lab → |

### 02 Websites & other work

Section label, title and description: the existing `worksKicker`, `worksTitle`, `worksNote`.

| Key | vi | en |
| --- | --- | --- |
| Canva category | Thiết kế · Canva | Design · Canva |
| Canva title | 13 ấn phẩm PC Express | 13 PC Express publications |
| Canva description | Ấn phẩm nội bộ cho truyền thông, sự kiện và hoạt động sinh viên, tự lên ý tưởng và thiết kế. | Internal publications for communications, events and student activities, which I planned and designed myself. |
| Canva link | Xem bộ sưu tập | View the collection |

### 03 Experience & education

| Key | vi | en |
| --- | --- | --- |
| Label | // Hành trình | // Journey |
| Title | Kinh nghiệm & học vấn | Experience & education |
| Description | Từ giảng dạy tiếng Anh đến vận hành đào tạo – khảo thí, song song với bằng Khoa học Máy tính. | From teaching English to running training and examination operations, alongside a degree in Computer Science. |
| Pill link | Album công tác → | Work album → |
| Education heading | Học vấn | Education |
| Awards heading | Thành tích & chứng chỉ | Achievements & certificates |

Work entries (period · title · organisation · bullets):

1. `04/2024 – 04/2026` / `Apr 2024 – Apr 2026` · Cán bộ Tổ chức & Quản lý Đào tạo, Khảo thí, kiêm IT / Training & Examination Officer, with IT support · FPT PolySchool Huế / FPT PolySchool Hue
    - vi: Lập lịch đánh giá, phân công giảng viên và điều phối hồ sơ nhiều khóa theo đúng quy chế. / en: Built assessment schedules, assigned instructors and coordinated multi-cohort records in line with regulations.
    - vi: Quản lý dữ liệu học tập, phổ điểm và báo cáo định kỳ; bảo đảm toàn vẹn hồ sơ sinh viên. / en: Managed learning data, grade distributions and periodic reports, safeguarding the integrity of student records.
    - vi: Vận hành IAPS9, LMS9, CMS, Udemy, EOS, FLM, Language Hub, Fuge; xây công cụ bằng Claude, ChatGPT, Codex, NotebookLM kết hợp Excel/Python. / en: Operated IAPS9, LMS9, CMS, Udemy, EOS, FLM, Language Hub and Fuge; built tools with Claude, ChatGPT, Codex and NotebookLM alongside Excel/Python.
2. `08/2022 – 03/2024` / `Aug 2022 – Mar 2024` · Cán bộ Chủ nhiệm & Giám thị / Class Advisor & Supervisor · FPT PolySchool Huế / FPT PolySchool Hue
    - vi: Theo dõi học tập, nề nếp, học phí; kết nối phụ huynh, sinh viên và các bộ phận. / en: Followed up on academics, conduct and tuition; connected parents, students and departments.
3. `09/2020 – 05/2022` / `Sep 2020 – May 2022` · Giảng viên tiếng Anh / English Language Instructor · Trung tâm Anh ngữ AMA – Huế / AMA English Center – Hue
    - vi: Giảng dạy, hỗ trợ ngoại khóa và phiên dịch. / en: Taught English and supported extracurricular activities and interpretation.
4. `2017 – 2019` · Thực tập sinh & tình nguyện viên y tế / Healthcare intern & volunteer · Granville Medical Center, Vidant Medical Center · North Carolina, Hoa Kỳ / North Carolina, USA · no bullets

Education:

1. `2025 – 2026` · Cử nhân Khoa học Máy tính (B.S.) / Bachelor of Science in Computer Science · University of the People, Hoa Kỳ / USA
2. `2015 – 2019` · Cao đẳng AAS Quản lý Chăm sóc Sức khỏe; AGE / AAS in Healthcare Management; Associate in General Education · Pitt Community College, Hoa Kỳ / USA

Achievements & certificates:

| Label | vi | en |
| --- | --- | --- |
| 2025 | Giải Bộ phận hoàn thành xuất sắc công tác vận hành | Department Award for Excellence in Operations |
| 2022, 2023 | Nhân viên xuất sắc, Ban Đảm bảo PTCĐ | Outstanding employee, PTCĐ Assurance Board |
| 2022 | Giảng viên xuất sắc, Trung tâm Anh ngữ AMA Huế | Outstanding instructor, AMA English Center Hue |
| 2014 – 2021 | Học bổng ECU Honor và Pitt CC Foundation; Dean's List nhiều học kỳ | ECU Honor and Pitt CC Foundation scholarships; Dean's List across multiple terms |
| Chứng chỉ / Certificates | TOEIC 700 · Nghiệp vụ sư phạm Trung cấp – Cao đẳng | TOEIC 700 · Pedagogical training (vocational–college) |

### 04 Contact

| Key | vi | en |
| --- | --- | --- |
| Label | // Liên hệ | // Contact |
| Title | Kết nối với tôi | Let's connect |
| Description | existing `contact.description` | existing `contact.description` |
| Card 1 label | Cơ hội công việc | Job opportunities |
| Card 1 title | Đơn vị cần chuẩn hóa dữ liệu đào tạo – khảo thí? | Need your training and assessment data in order? |
| Card 1 text | Tôi có kinh nghiệm vận hành lịch đánh giá, luồng điểm và các hệ thống LMS, cùng công cụ có AI hỗ trợ để giảm việc thủ công. | I run assessment schedules, grade pipelines and LMS platforms, and build AI-assisted tools that cut manual work. |
| Card 2 label | Hợp tác dự án | Project collaboration |
| Card 2 title | Cần một website hay công cụ nhỏ? | Need a website or a small tool? |
| Card 2 text | Tôi đã làm website song ngữ, tối ưu tìm kiếm địa phương cho nhà hàng, homestay và phòng khám tại Việt Nam và Hoa Kỳ. | I have built bilingual, locally searchable websites for restaurants, a homestay and a clinic in Vietnam and the United States. |
| Button | Gửi email | Send an email |

### Album page

| Key | vi | en |
| --- | --- | --- |
| Back link | Về trang chủ | Back to home |
| Label | // Album công tác | // Work album |
| H1 | Khoảnh khắc công tác | Moments at work |
| Count | 30 ảnh (use `photosLabel`) | 30 photos |
| Lightbox buttons | existing `prevLabel`, `nextLabel`, `closeLabel` | existing |

### Accessibility labels

| Key | vi | en |
| --- | --- | --- |
| Theme toggle (to dark / to light) | Chuyển sang giao diện tối / Chuyển sang giao diện sáng | Switch to dark theme / Switch to light theme |
| Menu button (open / close) | Mở menu / Đóng menu | Open menu / Close menu |
| Album tile | Xem ảnh {n} trên {total} | View photo {n} of {total} |
| Portrait alt | Chân dung Bảo Phong | Portrait of Bảo Phong |
