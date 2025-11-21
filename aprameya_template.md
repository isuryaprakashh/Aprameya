# Aprameya Project Template

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── icons/          # Custom SVG icons
│   │   ├── ui/             # Reusable UI components (Button, Input, Card)
│   │   ├── BentoGrid.tsx
│   │   ├── EventCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   └── StatsCard.tsx
│   ├── lib/
│   │   ├── data.ts         # Mock data
│   │   ├── types.ts        # TypeScript interfaces
│   │   └── utils.ts
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Events.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Projects.tsx
│   │   ├── Research.tsx
│   │   └── Signup.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
```

## Page Content

### Home (`pages/Home.tsx`)
- **Hero Section:** Large heading "AUTONOMOUS INTELLIGENCE COLLECTIVE", Game of Life canvas background, CTA buttons
- **Featured Projects:** BentoGrid with 3-4 highlighted projects/modules
- **Stats Section:** Display key metrics (50+ Projects, 200+ Members, 15+ Papers)
- **CTA Section:** "Ready to Shape the Future?" with signup button

### Projects (`pages/Projects.tsx`)
- **Header:** "INNOVATION_SHOWCASE" title with stats
- **Filters:** Category buttons (All, AI/ML, Robotics, etc.)
- **Search Bar:** Filter projects by name
- **Project Grid:** Cards with image slider, title, description, tech tags
- **View Toggle:** Switch between grid and list view

### Events (`pages/Events.tsx`)
- **Header:** "COMMUNITY_EVENTS" title with upcoming event count
- **Filters:** Event type (Workshop, Hackathon, Seminar, etc.)
- **Event Cards:** Orbit animation, title, date, description, register button
- **Registration Form:** Modal/section to register interest

### Research (`pages/Research.tsx`)
- **Header:** "R&D_DIVISION" title
- **Research Areas:** List of focus areas (Computer Vision, SLAM, etc.)
- **Publications:** Academic papers with links
- **Ongoing Projects:** Current research initiatives

### About (`pages/About.tsx`)
- **Mission Statement:** Organization's purpose and vision
- **Team Grid:** Member cards with photos, names, roles
- **Values:** Core principles (Innovation, Collaboration, etc.)
- **Contact Information:** Email, social links, location

### Login (`pages/Login.tsx`)
- **Split Layout:** Left side with branding/visuals, right side with form
- **Form Fields:** Username, Password, Remember Me checkbox
- **Actions:** Login button, "Forgot Password?" link, "Sign up" link

### Signup (`pages/Signup.tsx`)
- **Split Layout:** Similar to Login
- **Form Fields:** Username, Email, Password, Confirm Password, Terms checkbox
- **Actions:** Sign up button, "Already have account?" link

## Key Components

### Navbar
- Branding: "/// AUTONOMOUS SYSTEMS | APRAMEYA"
- Navigation links: Projects, Events, Research, About
- Status indicator: "THEME: APRM_DARK | STATUS: ONLINE"
- User menu (if logged in) or Login button

### Footer
- Logo and tagline
- Quick links (Sitemap, Legal)
- Social media icons
- System status: "SYSTEM NOMINAL" with pulsing indicator

### ProjectCard
- Image slider (3 images)
- Project title and category
- Description (3 lines max)
- Technology tags
- "VIEW DETAILS" button

### EventCard
- Orbit animation with central icon and satellites
- Event type badge
- Title and description
- Date display
- "REGISTER INTEREST" button (changes to "REGISTERED" on click)
