# Infinity Comlog - Product Guidelines

## Content & Voice
- **Minimalist & Functional:** Prioritize efficiency and speed. Use clear, concise language and focus on actionable data.
- **Action-Oriented:** Use imperative verbs for checklist items (e.g., "Deploy Units," "Calculate Orders").

## Visual Identity (Tech-Noir Minimalism)
- **Modern Aesthetic:** Leverage shadcn/ui components for a clean, professional look.
- **Setting-Appropriate:** Use a "tech-noir" color palette (darks, neons, and high-tech grays) that complements the Infinity setting without becoming cluttered.
- **High Readability:** Ensure high contrast between text and background, especially for critical game state information.

## User Experience & Interaction
- **Multi-Modal Feedback:** Use consistent color coding (e.g., green for completed, amber for active, gray for pending) and clear icons to communicate status instantly without requiring the user to read.
- **Mobile-First Targets:** Ensure all buttons and interactive elements are large enough for reliable tapping during active play.
- **Contextual Depth:** Provide high-level rule summaries via tooltips or expandable sections for quick reference, always accompanied by a direct link to the official wiki for the full text.

## Data & Reliability
- **Robust Local Persistence:** Automatically save game state to local storage. Users must never lose their progress due to a page refresh or accidental browser closure.
- **Offline Resiliency:** Once loaded, the core game sequence and list viewing functionality should remain usable even with intermittent connectivity (though wiki links may require internet).
