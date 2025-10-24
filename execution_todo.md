# Execution Plan

## Epic 1.3: Landing Page & Brand Assets
**Sprint Goal:** Create public-facing landing page
Landing page to be built in src/app/(marketing)/page.tsx

### Implementation Path
1. **Create Reusable Components**: Build header, footer, and section components in src/components/marketing/ for modularity and reusability.
2. **Build Landing Page Sections**: Implement hero, how it works, stats, benefits, testimonials, and CTA sections in src/app/(marketing)/page.tsx.
3. **Integrate with Layout**: Update src/app/layout.tsx for SEO metadata and ensure components integrate seamlessly.
4. **Add Animations and SEO**: Incorporate scroll reveals, counter animations, and create sitemap.xml/robots.txt in public/.
5. **Testing and Optimization**: Test responsiveness, run performance checks, and add unit tests.

### 1. Design Landing Page (Figma)
#### Description:
- [ ] Design hero section with headline and dual CTAs
- [ ] Design "How It Works" section for professionals and companies
- [ ] Design benefits grid and stats section
- [ ] Design testimonials carousel and final CTA
- [ ] Ensure mobile responsive designs
#### Acceptance Criteria:
- Figma file completed with desktop, tablet, mobile views
- Brand colors applied (#2E8B57, #3ABF7A, #1F5F3F, #0A2540, #CFAF50)
- Design approved by stakeholders
#### Files to Create/Update:
- Design assets (external Figma file)

### 2. Implement Landing Page Hero
#### Description:
- [ ] Create HeroSection component in src/components/marketing/HeroSection.tsx
- [ ] Build hero with headline, dual CTA buttons (Professional / Hiring linking to /sign-up)
- [ ] Implement gradient background using Tailwind
- [ ] Add floating profile cards animation (CSS/Framer Motion)
- [ ] Integrate HeroSection into src/app/(marketing)/page.tsx
#### Acceptance Criteria:
- Matches Figma design
- Responsive on mobile (Tailwind breakpoints)
- CTAs link to sign-up flow
#### Files to Create/Update:
- src/components/marketing/HeroSection.tsx (new)
- src/app/(marketing)/page.tsx (update)

### 3. Implement Landing Page Content Sections
#### Description:
- [ ] Create HowItWorksSection in src/components/marketing/HowItWorksSection.tsx
- [ ] Create StatsSection in src/components/marketing/StatsSection.tsx with counter animations
- [ ] Create BenefitsSection in src/components/marketing/BenefitsSection.tsx
- [ ] Create TestimonialsSection in src/components/marketing/TestimonialsSection.tsx (static carousel)
- [ ] Create CTASection in src/components/marketing/CTASection.tsx
- [ ] Integrate all sections into src/app/(marketing)/page.tsx
#### Acceptance Criteria:
- All sections responsive and match brand voice
- Animations smooth (60fps) using Intersection Observer
- Mobile responsive
#### Files to Create/Update:
- src/components/marketing/HowItWorksSection.tsx (new)
- src/components/marketing/StatsSection.tsx (new)
- src/components/marketing/BenefitsSection.tsx (new)
- src/components/marketing/TestimonialsSection.tsx (new)
- src/components/marketing/CTASection.tsx (new)
- src/app/(marketing)/page.tsx (update)

### 4. Create Header & Footer Components
#### Description:
- [ ] Create Header component in src/components/marketing/Header.tsx (sticky, logo, nav, mobile menu)
- [ ] Create Footer component in src/components/marketing/Footer.tsx (links, contact, social)
- [ ] Implement smooth scroll for anchor links
- [ ] Integrate Header and Footer into src/app/(marketing)/page.tsx
#### Acceptance Criteria:
- Header sticky on scroll, mobile menu functional
- Footer links accurate (to /about, /contact, etc.)
#### Files to Create/Update:
- src/components/marketing/Header.tsx (new)
- src/components/marketing/Footer.tsx (new)
- src/app/(marketing)/page.tsx (update)

### 5. Add Landing Page Animations
#### Description:
- [ ] Add scroll reveal animations to sections in src/app/(marketing)/page.tsx
- [ ] Implement counter animations for stats (using react-countup)
- [ ] Add hover effects on cards and buttons
- [ ] Optimize for performance (lazy load, 60fps)
#### Acceptance Criteria:
- Animations enhance UX without distraction
- Intersection Observer used for reveals
- 60fps maintained on mobile
#### Files to Create/Update:
- src/app/(marketing)/page.tsx (update)
- Install react-countup if needed (npm install react-countup)

### 6. Implement SEO & Metadata
#### Description:
- [ ] Update metadata in src/app/layout.tsx (title, description, OG tags)
- [ ] Create public/sitemap.xml
- [ ] Create public/robots.txt
- [ ] Add structured data (JSON-LD) in layout.tsx
#### Acceptance Criteria:
- Meta tags present, Google rich snippets show correctly
- Lighthouse SEO score >90
#### Files to Create/Update:
- src/app/layout.tsx (update)
- public/sitemap.xml (new)
- public/robots.txt (new)

### Additional Notes
- Use Tailwind CSS for styling, ShadcnUI for any UI components.
- Ensure all components are TypeScript (.tsx).
- Test locally with npm run dev, check responsiveness in browser dev tools.
- After implementation, run performance tests as per README.

