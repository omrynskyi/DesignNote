# Changelog

All notable changes to DesignNote will be documented in this file.

## [1.0.1] - 2026-06-30

### Added
- **Session Persistence**: Pins and styles now persist across page refreshes using Chrome's session storage
- **Refresh Page Feature**: New "Refresh" button in toolbar to reload page while preserving all pins and modifications
- **lucide-react**: Added for improved icon library support
- **Improved Embed Layout**: Better handling of embed mode with proper body width adjustments and resize listeners
- **Responsive Layout Fixes**: Fixed container placement when both embed and responsive modes are active
- **Enhanced Inline Popover Hints**: Updated hint text for better UX

### Changed
- **Style Application**: Refactored style handling to support session restoration with `apply` and `reset` functions
- **Element Removal**: Only removes pinned elements without style modifications (elements with custom styles are preserved)
- **Pinned Element Visual**: Removed inset fill shadow, keeping only outer glow for cleaner appearance
- **Responsive Toggle**: Fixed container repositioning when toggling responsive mode

### Fixed
- Sidebar container now correctly positioned when embed mode is active alongside responsive simulator
- Resize handler properly registered/unregistered when toggling embed mode
- Window resize events properly handled in embed mode

## [1.0.0] - 2026-06-20

### Added
- **Chrome Extension**: Full-featured UI annotation extension for design collaboration
- **Element Selection**: Click to select and pin UI elements on any webpage
- **Style Editor**: Visual style editor for inline CSS modifications (color, spacing, typography)
- **Comments/Notes**: Add markdown-formatted notes to pinned elements
- **Prompt Generation**: Automatically generate Claude prompts from selected elements
- **Responsive Simulator**: Test designs at different viewport widths (mobile, tablet, desktop)
- **Sidebar Panel**: Organized sidebar for managing pinned elements and settings
- **Visual Redesign**: Modern UI with gradient accents and improved component styling
- **Pause/Resume Selection**: Toggle element selection mode while preserving session state

