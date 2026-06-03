Figma AI Design Prompt: Skillz Campus Marketplace System (Vibrant 3D Edition)
1. System-Wide Design Style & Aesthetic Tokens
Design Aesthetic: Vibrant, modern, playful yet professional web/mobile interface. Uses large container border-radiuses (24px to 32px), high-contrast color blocking, and extremely soft, deeply diffused drop shadows (drop-shadow(0px 10px 30px rgba(0,0,0,0.05))) to make elements appear layered and tactile.

Color Palette:

Primary Sky Blue: High-saturation, bright sky blue (#38B6FF or similar) used for major header blocks, container sections, and primary branding.

Accent Golden Yellow: Bright canary yellow (#FFC107 or #FFD000) used exclusively for high-priority call-to-actions (CTAs), search icons, and active states.

Backgrounds: Crisp white (#FFFFFF) interior cards layered over ultra-light cool gray or soft blue-tinted gradient canvases.

Typography Dark: Deep charcoal/navy (#1A1D20) for maximum legibility on headers.

Iconography Style: Emulate premium Flaticon styles—highly colorful, distinct multi-tone flat vector icons or glossy 3D-effect icons with realistic depth. Avoid minimalist wireframe icons.

Global Access Banner (Top of Screen): A persistent, clean notification banner stating: "Visitor Mode: You are viewing the campus marketplace. Log In or Sign Up to edit, list gigs, or customize your profile."

2. Page-by-Page Layout & Interface Blueprint
Page 1: Landing Page (Desktop Web View)
Navbar: Clean white background with the Skillz logo on the left. Central navigation links (Offer Skills, Find Gigs, How It Works). On the right, a "Log In" secondary text link and a punchy, rounded "Sign Up" button in Accent Golden Yellow.

Hero Section: * Left Side: High-impact typography utilizing the highlight technique. Main Header: UNLEASH YOUR POTENTIAL, FIND YOUR SKILL & GIG (with "SKILL & GIG" highlighted or underlined in yellow). Sub-text below describing the marketplace. A large, circular, bright Sky Blue button with the text "FIND GIGS" and a thick white arrow icon.

Right Side: A high-quality cutout graphic of energetic, collaborative university students.

Floating Stats Cards: Three white rounded-rectangle cards hovering dynamically over the hero image with clean, colorful Flaticon badges. Data points: 'ACTIVE STUDENT PORTFOLIOS', 'GIGS COMPLETED', and 'ACADEMIC DEPARTMENTS'.

"About Skillz" Section: A two-column grid layout. Left side features a bold, highlighted headline: 'WE CONNECT CAMPUS TALENT WITH LOCAL OPPORTUNITIES. EARN. LEARN. GROW.' Right side contains descriptive paragraphs and a clean vector graphic.

"SPOTLIGHT: STUDENT OF THE WEEK" Section: A large feature card. Includes a high-res professional student headshot, name, major, a horizontal row of colorful tag pills for "Key Skills," and a prominent italicized blockquote review. Feature buttons: Sky Blue "VIEW PROFILE" and Golden Yellow "BOOK STUDENT".

Page 2: Student Profile Page (With Creation & Customization UI)
State A: Visitor View (Read-Only)

Standard professional resume layout showing student details, skills, and experience.

Combined Feature 1 (WhatsApp Direct Connect): A prominent, floating circular WhatsApp green/cyan button with a white arrow and text label: "Contact via WhatsApp".

Combined Feature 4 (Specialized Visual Gallery): A dedicated section for creative roles (Designers, Photographers). Implements a striking Dark-Mode Container Overlay (#121214) that makes high-resolution portfolio images pop inside a sleek, modern visual masonry grid.

State B: Logged-In Student View (Customization Mode)

When the owner logs in, a prominent "Edit & Customize Profile" floating action button appears at the top.

Clicking edit transforms profile fields into active input fields, showing a drag-and-drop zone to re-order the Visual Gallery grid, a toggle switch to turn the WhatsApp contact button on/off, and theme color picker presets.

Page 3: Job Board Page
Header Actions: Two primary buttons side-by-side using the system style: A Golden Yellow "Post a Gig" button and a Sky Blue "Search Gigs" bar.

Gig Listings: A clean, vertical paginated list of white cards. Each card displays the Gig Title, an excerpt description, a Flaticon budget tag (e.g., Budget: $500), a student applicant counter, and a crisp Sky Blue "Apply for Gig" CTA button.

Page 4: Admin Panel Dashboard
Admin User List: A clean, spacious, paginated table containing data columns for: ID, Name, Role, Email, Verification Status (represented by bold color pills: Green for Verified, Yellow for Pending, Red for Rejected), and Actions (clickable text links for Verify, Reject, Ban).

Feature 5 (Verified Registration Workflow - Pending ID Viewer): A dedicated side-by-side verification widget. Shows the student’s profile details alongside a high-resolution view of their uploaded university ID card image. Underneath are two explicit action buttons: Green "Approve Status" and Red "Reject Status".

Control Panel Widgets: * Student of the Week Selector: A simple dropdown interface allowing admins to quickly search, select, and assign the next featured student profile to the landing page and session popup.

Content Moderation Tools: A flagged-posts queue with simple quick-delete and warning buttons for managing inappropriate gig listings.

Page 5: Interaction States & Component Popups
Session-Based Popup Modal: A perfectly centered, high-fidelity modal component replicating the "Student of the Week" card layout. It features a dark backdrop overlay (rgba(0,0,0,0.4)) with a clean X close button in the top right corner. Ensure UX documentation specifies this modal loads only once per session upon initial user login.