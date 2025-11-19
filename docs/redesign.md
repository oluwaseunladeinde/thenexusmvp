# Profile Components Prompt

## Overview/About Card

1. **Main Card Container:**
    - Standard card styling: bg-white rounded-xl shadow-md.
    - Set a reasonable max width for the container (e.g., max-w-4xl mx-auto).
2. **Header (Experience):**
    - Title: "Experience" (text-2xl font-bold).
    - Icons: Include three icons on the right side: a plus icon (Add), a pencil icon (Edit), and a kebab/three-dot icon (More). Use flex justify-between items-center for the header layout.
3. **Job Entry Item (.experience-item):**
    - Each entry must be rendered dynamically from the experienceList array.
    - Vertical Separator: Use a subtle border-b for separation between items (except the last one).
    - Image/Logo: Each entry starts with a company logo placeholder (w-12 h-12 rounded-full) on the left, using a clear margin/padding to separate it from the text content. Use an onerror handler to provide a gray fallback background
4. **Skills and Notes:**
    - **Skills Bar:** Displayed in small text, often preceded by an inverted triangle icon (or a chevron pointing down, lucide-chevron-down). This represents the expanded skills section.
    - **LinkedIn Note:** If note is present and type is "linkedin", display a small, blue, inline LinkedIn icon next to the text.
    - **Description (Co-Founder entry):** For the Co-Founder entry, include the multi-line description text. Use a soft break in the code to show the "more" ellipsis.
- **Responsive Design Requirements**
    - The layout must be fully responsive. On mobile devices, the logo and text content should stack vertically or maintain a clear, readable inline flow without breaking the text hierarchy.
    - Ensure all text wraps correctly without horizontal scrolling.
  
  - **Interaction Logic (JavaScript)**
    - **Data Rendering:** Use JavaScript (preferably a template loop) to iterate through the experienceList and create the corresponding HTML structure for each job, inserting the data fields appropriately.
    - **Conditional Rendering:** Ensure that elements like the description or note are only rendered if the data exists in the current array object (e.g., the Venture Garden Group entry skips many fields).