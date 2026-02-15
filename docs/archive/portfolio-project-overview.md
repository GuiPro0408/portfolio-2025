# DEPRECATED (Archive)

This document describes an earlier Next.js/Prisma/Vercel direction and is not canonical for this repository.

Use these canonical docs instead:
- `docs/README.md`
- `docs/ARCHITECTURE.md`
- `docs/QUALITY.md`
- `docs/DEPLOY.md`

# Portfolio Project Overview (Archived)

## 1. Project Overview
**Name:** Guillaume Juste – Full-Stack Web Developer Portfolio  
**Goal:**  
- Build a professional, modern, and performant portfolio that highlights my technical expertise and projects.  
- Target recruiters and potential clients, with primary visibility in Mauritius and international reach.  
- Showcase both technical and creative skills through projects, blog posts, and an interactive, well-designed UI.  

**Audience:**  
- Tech recruiters (local and international)  
- Companies looking for full-stack developers  
- Potential clients for freelance projects  

**Positioning Statement:**  
> “Bridging creativity and technology, I build impactful full-stack web solutions that combine performance, user experience, and clean code.”

---

## 2. Personal Branding
**Name:** Guillaume Juste  
**Title:** Full-Stack Web Developer | Bridging Creativity and Technology  
**Bio (short version):**  
Mauritian Full-Stack Web Developer skilled in modern web technologies, crafting intuitive, high-performance applications that connect users with innovative digital solutions.

**Bio (long version):**  
From the vibrant shores of Mauritius, I’ve built a career turning complex challenges into intuitive, impactful web applications. My full-stack expertise spans from front-end frameworks like React and Tailwind CSS to back-end architectures in PHP, Python, and Ruby on Rails — always with a focus on clean, scalable code.  
Graduating from Le Wagon Bootcamp, I’ve contributed to diverse projects in companies like Dragon Electronics and Nullpod Ltd. My portfolio reflects a dedication to continuous growth, innovation, and delivering results that matter.

**Contact:**  
- **LinkedIn:** [linkedin.com/in/guillaume-juste-developer](https://www.linkedin.com/in/guillaume-juste-developer/)  
- **GitHub:** [github.com/GuiPro0408](https://github.com/GuiPro0408)  
- **Email:** guillaume.juste0408@gmail.com  
- **Phone:** +230 54869241  

---

## 3. Technical Stack
- **Frontend Framework:** Next.js (App Router)  
- **Styling:** Tailwind CSS + MUI  
- **Backend:** Next.js API routes with Prisma ORM  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Authentication:** Auth.js (NextAuth)  
- **Deployment:** Vercel  
- **Image Hosting:** Next.js Image Optimization + optional Cloudinary  
- **Content Management:** Custom admin dashboard  
- **SEO & Analytics:** Next.js Metadata API, sitemap, robots.txt, Google Analytics  

---

## 4. Architecture
```
app/
  (public)/
    page.tsx
    projects/
    blog/
    contact/
  (admin)/
    layout.tsx
    projects/
    blog/
components/
  ui/         // MUI-based components
  sections/   // Tailwind + layout components
lib/
  db.ts       // Prisma client
  auth.ts     // Auth.js config
styles/
  globals.css // Tailwind layers
prisma/
  schema.prisma
```
**Data Models (Prisma)**
```prisma
model Project {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  summary     String
  content     String
  techStack   String[]
  repoUrl     String?
  demoUrl     String?
  coverImage  String?
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BlogPost {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  excerpt     String
  content     String
  coverImage  String?
  publishedAt DateTime
}

model User {
  id        Int    @id @default(autoincrement())
  name      String
  email     String @unique
  password  String
  role      String @default("admin")
}
```

---

## 5. Content Structure
**Public Pages:**
1. Home
2. Projects
3. Blog
4. Contact

**Admin Pages:**
1. Dashboard
2. Manage Projects
3. Manage Blog Posts

---

## 6. Best Practices
- Server Components by default  
- SEO metadata per page  
- ISR + tag-based revalidation  
- Strict CSP & security headers  
- Tailwind for layout, MUI for component polish  
- Validate inputs with Zod  

---

## 7. Deployment & Hosting
- **Vercel** for Next.js  
- **Database** on Supabase / Vercel Postgres  
- Auto-deploy from GitHub main branch  

---

## 8. About Me
**Headline:**  
> **Guillaume Juste** – *Full‑Stack Web Developer from Mauritius, Bridging Creativity & Technology*

**About Me:**  
I’m a Mauritius-based Full‑Stack Web Developer who merges creativity and technical excellence to craft impactful digital experiences. With a passion for transforming complex challenges into intuitive, polished solutions, my expertise spans modern front‑end and robust back‑end technologies.

Graduating from the Le Wagon Bootcamp, I’ve developed solutions using React, Next.js, Tailwind CSS, and PostgreSQL. My skill set includes Ruby on Rails, Python/Django, PHP, and WordPress, alongside frontend tools like Figma for UX design. I bring experience from projects at Dragon Electronics and Nullpod Ltd and continue to grow through hands-on development and continuous learning.

**Why I Stand Out:**
- Holistic Development Skill Set  
- Clean & Viral-Friendly Code  
- End-to-End Project Flow  
- Focused & Responsive  
- Forward-Looking Builder  

---

## 9. Official Documentation References
| Technology     | Official Docs |
|----------------|----------------|
| **Next.js**    | [Next.js Documentation](https://nextjs.org/docs) |
| **Tailwind CSS** | [Tailwind CSS Official Site](https://tailwindcss.com/) |
| **PostgreSQL** | [PostgreSQL Documentation](https://www.postgresql.org/docs/) |
| **Prisma**     | [Prisma Documentation](https://www.prisma.io/docs) |
| **MUI (Material UI)** | [MUI Official Docs](https://mui.com/) |
| **NextAuth / Auth.js** | [NextAuth.js](https://next-auth.js.org/) & [Auth.js](https://authjs.dev/) |
