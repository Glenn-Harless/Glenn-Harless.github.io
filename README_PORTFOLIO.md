# Glenn Harless Portfolio Website

A minimal, elegant portfolio website showcasing data science and engineering projects. Built with vanilla JavaScript and CSS for optimal performance and a unique aesthetic inspired by e-ink displays.

## Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS with e-ink aesthetic
├── script.js           # JavaScript for interactivity
├── data/
│   ├── projects/       # Individual project JSON files
│   └── build/          # Build artifacts
│       ├── full_inventory.json     # Complete project inventory
│       ├── featured_projects.json  # Featured projects for homepage
│       └── build_info.json         # Build metadata
├── build.py            # Build script to generate project data
└── README.md           # This file
```

## Features

- **Minimal Design**: Clean, typography-focused layout inspired by e-ink displays
- **Dynamic Project Loading**: Projects loaded from JSON data files
- **Categorized Projects**: 6 categories (ai-ml, analytics, engineering, web, tools, research)
- **Interactive Elements**: Mouse-based coordinate display, parallax effects, smooth scrolling
- **Responsive**: Fully responsive design that works on all devices

## Building the Site

1. Run the build script to generate project data:
```bash
python build.py
```

2. Serve the site locally:
```bash
python -m http.server 8000
```

3. Visit `http://localhost:8000` in your browser

## Project Data

The portfolio includes 37 repositories across 6 categories:

- **AI/ML** (8 projects): LLM applications, RAG systems, NLP
- **Analytics** (14 projects): Data analysis, business intelligence, healthcare analytics
- **Engineering** (3 projects): Data pipelines, infrastructure, optimization
- **Web** (4 projects): Websites and web applications
- **Tools** (6 projects): Developer tools and utilities
- **Research** (2 projects): Academic and experimental projects

## Featured Projects

The site highlights 6 featured projects based on:
- Substantial commit history (>20 commits)
- Recent activity (updated within last year)
- Comprehensive documentation
- Advanced/interesting technologies
- Special significance (e.g., Psych-Ward-Room-Optimization with APA presentation)

## Customization

### Adding New Projects
1. Update `data/build/full_inventory.json` with new project information
2. Run `build.py` to regenerate project files
3. Projects marked as `"featured": true` will appear on the homepage

### Styling
- Edit `styles.css` to modify the visual design
- The site uses JetBrains Mono font and a warm off-white (#fdf6e3) background
- E-ink texture effects are created with CSS gradients

### Content
- Update the about section in `index.html`
- Modify skill nodes in the skills section
- Edit contact information in the header

## Technologies Used

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Font**: JetBrains Mono (Google Fonts)
- **Build**: Python 3 for data generation
- **Design**: E-ink aesthetic with paper texture effects

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- Graceful degradation for older browsers

## License

© 2025 Glenn Harless. All rights reserved.