# React Native Mobile App Conversion Prompt for Ukho Network

## Project Overview
Convert the existing Ukho Network web application (React + Vite) into a native mobile application using React Native and Expo (the expo application is already created and running, continue from where we are). The application is a social network platform focused on connecting South African tribal communities, clans, and lineages. Every visual element, component, interaction, and styling must be replicated identically to the web version.

## Application Purpose
Ukho Network is a cultural social platform that:
- Connects users based on their clan and tribal affiliations
- Displays ancestral wisdom using Google Gemini AI
- Features clan praises (Izithakazelo) with text-to-speech functionality
- Provides clan search and discovery features
- Shows verified elders and clan contacts
- Displays a feed of posts from the community
- Supports light/dark theme switching

## Current Tech Stack (Web)
- **Framework**: React 19.2.3
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React 0.462.0
- **AI Service**: @google/genai 1.35.0 (Google Gemini API)
- **TypeScript**: 5.8.2
- **Font**: Space Grotesk (Google Fonts)

## Target Tech Stack (Mobile)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack Navigator + Tab Navigator)
- **Styling**: React Native StyleSheet with identical design tokens
- **Icons**: react-native-vector-icons or @expo/vector-icons (matching Lucide icons)
- **AI Service**: @google/genai (ensure mobile compatibility)
- **TypeScript**: Latest stable version
- **State Management**: React hooks (useState, useEffect) - same as web
- **Audio**: expo-av for text-to-speech playback
- **Theme**: React Context API for light/dark mode (matching web implementation)

## Design System & Styling Requirements

### CSS Variables (Convert to React Native StyleSheet constants)
```javascript
// Light Theme
--bg-color: #fcfaf8
--panel-bg: rgba(255, 255, 255, 0.85)
--text-main: #1e1b1a
--text-dim: #64748b
--border-color: rgba(0, 0, 0, 0.08)
--card-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05)

// Dark Theme
--bg-color: #120b08
--panel-bg: rgba(35, 25, 20, 0.75)
--text-main: #f7f3f1
--text-dim: #94a3b8
--border-color: rgba(245, 158, 11, 0.15)
--card-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5)
```

### Key Design Elements to Replicate

1. **Ukho Gradient**: `linear-gradient(135deg, #f97316 0%, #a855f7 100%)` - Use `LinearGradient` from `expo-linear-gradient`
2. **Ukho Glow**: `box-shadow: 0 0 25px rgba(249, 115, 22, 0.2)` - Use shadowColor and shadowOpacity
3. **Glass Panel Effect**: 
   - Background: `rgba(255, 255, 255, 0.85)` (light) / `rgba(35, 25, 20, 0.75)` (dark)
   - Backdrop blur: Use `BlurView` from `expo-blur` for iOS, opacity for Android
   - Border: `1px solid var(--border-color)`
   - Shadow: Match web shadow values
4. **Border Radius**: Extensive use of rounded corners:
   - `rounded-3xl` = `borderRadius: 24`
   - `rounded-[2.5rem]` = `borderRadius: 40`
   - `rounded-[3rem]` = `borderRadius: 48`
   - `rounded-full` = `borderRadius: 9999`
5. **Typography**:
   - Font Family: Space Grotesk (load via `expo-font` or use system font that closely matches)
   - Font weights: 300, 400, 500, 600, 700, 900 (black)
   - Extensive use of `uppercase`, `tracking-widest`, `tracking-tighter`
   - Italic text for brand name "Ukho"
6. **Colors**:
   - Primary Orange: `#f97316` (orange-500)
   - Purple: `#a855f7` (purple-500)
   - Emerald: `#10b981` (emerald-500)
   - Red: `#ef4444` (red-500)
7. **Spacing**: Match Tailwind spacing scale (4px increments)

## Component Structure & Requirements

### 1. App.tsx (Main Application Component)
**Current Structure:**
- Authentication state management (user login/logout)
- Tab navigation between 'plaza' and 'contacts'
- Light/dark theme toggle
- Mobile menu overlay (for small screens)
- Sidebar navigation (for larger screens)
- Main content area with conditional rendering

**Mobile Adaptations:**
- Use React Navigation for tab navigation
- Implement bottom tab bar matching the web sidebar design
- Mobile menu should be a modal/drawer navigation
- Theme context provider wrapping entire app
- Safe area handling for iOS/Android

**Key Features:**
- User authentication flow (AuthPage component)
- State: `user`, `wisdom`, `activeTab`, `selectedClanPraise`, `isLightMode`, `isMobileMenuOpen`
- Mock data: `MOCK_USER_INITIAL`, `IZITHAKAZELO`, `MOCK_POSTS`
- Functions: `handleLogin`, `handleLogout`, `handleRecite`, `navigateTo`

### 2. Layout.tsx
**Current Implementation:**
- Wrapper component with background color
- Flex layout with max-width container
- Responsive gap spacing

**Mobile Adaptations:**
- Use `SafeAreaView` from React Native
- Full-width container (no max-width)
- Maintain flex layout structure
- Handle keyboard avoiding view for forms

### 3. AuthPage.tsx
**Current Features:**
- Login/Register toggle
- Form fields: cellNumber, password, fullName (register), clanName (register)
- Tribal background decorative elements
- Ukho logo with gradient
- Glass panel styling
- Form validation

**Mobile Adaptations:**
- Use `TextInput` from React Native
- Implement `KeyboardAvoidingView`
- Replicate decorative background elements using `View` with absolute positioning
- Maintain exact styling: rounded corners, padding, colors, fonts
- Use `TouchableOpacity` or `Pressable` for buttons
- Form submission handling identical to web

**Visual Elements:**
- Large Ukho logo (28x28 → 112x112 on mobile, scale appropriately)
- Background blur circles (orange and purple)
- SVG decorative lines
- Glass panel with border-bottom accent (orange-500, 8px)
- Input icons (User, MapPin, Phone, Lock from Lucide)
- Submit button with gradient and uppercase text

### 4. PostCard.tsx
**Current Features:**
- User avatar with verification badge
- User name, handle, timestamp
- Clan and tribe badges
- Post content text
- Optional post image
- Interaction buttons (Heart, MessageCircle, UserPlus)
- Like and comment counts

**Mobile Adaptations:**
- Use `Image` component for avatars and post images
- Implement `ScrollView` for long content
- Touchable buttons with haptic feedback
- Maintain exact spacing and typography
- Glass panel effect with hover states (use `activeOpacity`)

**Styling Details:**
- Avatar: 56x56 (w-14 h-14), rounded-2xl (16px)
- Verification badge: absolute positioned, orange-500 background
- Badges: small uppercase text with tracking-widest
- Border-top separator on interaction row
- Hover effects: border color changes, icon fill changes

### 5. ClanFinder.tsx
**Current Features:**
- Search input for name/clan
- Expandable location filter
- List of nearby kin with distance
- Connect button for each kin
- Empty state when no results

**Mobile Adaptations:**
- Use `FlatList` for kin list (better performance)
- Search input with clear button
- Filter toggle button
- Maintain exact card styling
- Distance and location display

**Key Styling:**
- Glass panel container
- Search input with icon
- Expandable filter section (animated)
- Kin cards with hover effects
- Orange-500 accent colors

### 6. ClanSearchCard.tsx
**Current Features:**
- Large search input for clan/surname
- Region selector dropdown
- Search button with icon
- Background glow effect

**Mobile Adaptations:**
- Use `Picker` or custom dropdown for region selector
- Large touch target for search input
- Maintain background glow (use View with blur)
- Gradient button styling

### 7. KinRecommendations.tsx
**Current Features:**
- Grid of recommended kin (3 columns on desktop, responsive)
- Avatar, name, clan, match reason
- Connect button for each

**Mobile Adaptations:**
- Use `FlatList` with `numColumns={2}` for mobile grid
- Maintain card styling exactly
- Avatar sizing: 64x64 (w-16 h-16)
- Rounded corners: rounded-3xl (24px)

### 8. ClanRelations.tsx
**Current Features:**
- List of verified clan contacts
- Avatar, name, role, clan
- Verification badge
- Message button

**Mobile Adaptations:**
- FlatList for contact list
- Maintain exact card styling
- Verification badge positioning
- Button interactions

### 9. ContactsPage.tsx
**Current Features:**
- Header with title and search
- Verified Elders section (grid layout)
- Potential Kin section (grid layout)
- Full Directory table view
- Search functionality

**Mobile Adaptations:**
- Use `SectionList` for organized sections
- Convert table to card-based layout for mobile (or use `DataTable` if available)
- Maintain search functionality
- Grid layouts: 1 column on mobile, 2 on tablet
- Filter button functionality

**Key Sections:**
1. Header: Large title "YOUR CLAN NETWORK", search input
2. Verified Elders: Grid of elder cards with avatar, name, role, clan
3. Potential Kin: Grid of kin recommendation cards
4. Full Directory: Table/card list of all contacts

### 10. VibraniumNews.tsx (if used)
**Current Features:**
- News feed from Gemini AI
- Category icons (Zap, Crown, Shield, Map)
- Loading state with skeleton
- Category badges

**Mobile Adaptations:**
- FlatList for news items
- Loading skeleton using `ActivityIndicator` or custom components
- Category icon mapping
- Maintain purple accent theme

## Services & API Integration

### geminiService.ts
**Current Implementation:**
- `getAncestralWisdom()`: Fetches wisdom quote from Gemini
- `recitePraises()`: Text-to-speech using Gemini TTS API
- `fetchVibraniumNews()`: Fetches structured news items

**Mobile Adaptations:**
- Ensure `@google/genai` works in React Native (may need polyfills)
- For TTS: Use `expo-av` Audio API to play base64 audio
- Audio decoding: Implement or use library for base64 → audio buffer conversion
- Error handling: Maintain same error messages and fallbacks
- API key: Use `expo-constants` or environment variables

**Key Functions:**
```typescript
// Must work identically on mobile
getAncestralWisdom(): Promise<string>
recitePraises(clan: string, praises: string): Promise<void>
fetchVibraniumNews(): Promise<NewsItem[]>
```

## Navigation Structure

### Web Navigation (Convert to Mobile)
1. **Plaza Tab** (Home):
   - Ancestral Wisdom card
   - Clan Search Card
   - Izithakazelo (Praises) card
   - Kin Recommendations
   - Post feed

2. **Contacts Tab**:
   - ContactsPage component

3. **Discover Clans** (Future):
   - Placeholder button

4. **Isibongo** (Future):
   - Placeholder button

### Mobile Navigation Implementation
- **Bottom Tab Navigator**: Plaza, Contacts, Discover, Isibongo
- **Stack Navigator**: For detail screens (if needed)
- **Modal/Drawer**: For mobile menu (settings, theme toggle, logout)
- Tab bar styling: Match web sidebar design (glass panel, orange accents)

## State Management

### Global State (Use Context API)
- `user`: Current logged-in user (null if not authenticated)
- `isLightMode`: Theme preference (default: true)
- `wisdom`: Ancestral wisdom text
- `selectedClanPraise`: Currently selected clan praise

### Component State
- `activeTab`: Current tab (managed by React Navigation)
- `isMobileMenuOpen`: Mobile menu visibility
- `searchQuery`: Various search inputs across components
- Form states in AuthPage

## Type Definitions

### types.ts (Use Identically)
```typescript
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  clan: string;
  tribe: string;
  bio: string;
}

export enum Tribe {
  ZULU = 'Zulu',
  XHOSA = 'Xhosa',
  SOTHO = 'Sotho',
  TSWANA = 'Tswana',
  VENDA = 'Venda',
  NDEBELE = 'Ndebele'
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tribe: Tribe;
  clan: string;
  image?: string;
}

export interface ClanPraise {
  clanName: string;
  praises: string;
}

export interface ClanContact {
  id: string;
  name: string;
  role: string;
  clan: string;
  verified: boolean;
  avatar: string;
}

export interface KinRecommendation {
  id: string;
  name: string;
  clan: string;
  matchReason: string;
  avatar: string;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
}
```

## Mock Data

### Preserve All Mock Data
- `MOCK_USER_INITIAL`: Default user object
- `IZITHAKAZELO`: Array of clan praises
- `MOCK_POSTS`: Array of sample posts
- `VERIFIED_ELDERS`: Array in ContactsPage
- `POTENTIAL_KIN`: Array in ContactsPage and KinRecommendations
- `CLAN_CONTACTS`: Array in ClanRelations
- `NEARBY_KIN`: Array in ClanFinder

## Specific Mobile Considerations

### 1. Images
- Use `Image` component from React Native
- Handle image loading states
- Maintain aspect ratios
- Use `resizeMode: 'cover'` for avatars
- All images are from Unsplash URLs - ensure network access

### 2. Text Input
- Use `TextInput` with exact styling
- Maintain placeholder text
- Icon positioning (absolute positioned View with icon)
- Focus states (border color changes)
- Keyboard types: `phone-pad` for cell number, `default` for others

### 3. Buttons
- Use `TouchableOpacity` or `Pressable`
- Maintain exact styling (gradients, borders, shadows)
- Active/pressed states (scale transform)
- Haptic feedback on press (optional but recommended)

### 4. Scrollable Content
- Use `ScrollView` for main content areas
- Use `FlatList` for long lists (posts, contacts, kin)
- Maintain scroll indicators styling
- Handle pull-to-refresh if needed

### 5. Modals & Overlays
- Mobile menu: Use `Modal` component
- Backdrop blur: Use `BlurView` from `expo-blur`
- Animation: Use `react-native-reanimated` for smooth transitions
- Match web animations (fade-in, zoom-in, slide-in)

### 6. Theme Switching
- Use Context API for theme state
- Store preference in `AsyncStorage` (persist across app restarts)
- Apply theme to all components identically
- Smooth transitions between themes

### 7. Audio Playback
- Use `expo-av` for TTS audio
- Handle audio permissions
- Show loading state during audio generation
- Error handling for audio playback

### 8. Safe Areas
- Use `SafeAreaView` or `useSafeAreaInsets` for iOS notches
- Handle Android status bar
- Maintain padding and spacing

### 9. Performance
- Optimize images (use appropriate sizes)
- Memoize expensive components
- Use `FlatList` for long lists
- Lazy load components if needed

## Animation Requirements

### Match Web Animations
1. **Fade In**: Components appearing (use `Animated` or `react-native-reanimated`)
2. **Zoom In**: Modal appearances (scale from 0.95 to 1.0)
3. **Slide In**: Menu overlays (from top/bottom)
4. **Hover Effects**: Use `activeOpacity` and state changes
5. **Pulse**: Animated pulse on location pin icon
6. **Bounce**: Empty state ghost icon animation

## Testing Requirements

### Functionality Tests
- Authentication flow (login/register)
- Tab navigation
- Search functionality (all search inputs)
- Theme switching
- Audio playback (TTS)
- Image loading
- Form submissions

### Visual Tests
- Compare side-by-side with web version
- Verify all colors match exactly
- Check spacing and padding
- Verify font sizes and weights
- Check border radius values
- Verify gradient colors
- Check shadow effects
- Verify glass panel blur effects

### Device Tests
- iOS (iPhone, various sizes)
- Android (various screen sizes)
- Tablet layouts (if applicable)
- Dark mode on both platforms
- Light mode on both platforms

## File Structure (Recommended)

```
ukho-mobile/
├── App.tsx (Root component with Navigation)
├── app.json (Expo config)
├── package.json
├── tsconfig.json
├── types.ts (Same as web)
├── constants/
│   ├── Colors.ts (Theme colors)
│   ├── Theme.ts (Theme context)
│   └── Styles.ts (Common styles)
├── components/
│   ├── AuthPage.tsx
│   ├── Layout.tsx
│   ├── PostCard.tsx
│   ├── ClanFinder.tsx
│   ├── ClanSearchCard.tsx
│   ├── KinRecommendations.tsx
│   ├── ClanRelations.tsx
│   ├── ContactsPage.tsx
│   └── VibraniumNews.tsx
├── screens/
│   ├── PlazaScreen.tsx (Main feed)
│   ├── ContactsScreen.tsx
│   └── AuthScreen.tsx
├── services/
│   └── geminiService.ts (Same as web, with mobile adaptations)
├── navigation/
│   └── AppNavigator.tsx
└── assets/
    └── fonts/ (Space Grotesk if loading custom font)
```

## Critical Success Criteria

1. **Visual Fidelity**: Every pixel, color, spacing, and font must match the web version exactly
2. **Functional Parity**: All features must work identically (auth, search, TTS, theme switching)
3. **Performance**: Smooth 60fps animations, fast load times, responsive interactions
4. **Platform Adaptation**: Native feel on both iOS and Android while maintaining web design
5. **Accessibility**: Proper touch targets (minimum 44x44), readable text, screen reader support
6. **Error Handling**: Graceful error states matching web behavior
7. **Loading States**: Skeleton loaders and spinners matching web experience

## Additional Notes

- The web app uses Tailwind CSS classes extensively - convert each class to React Native StyleSheet properties
- Pay special attention to the glass morphism effect - this is a key visual element
- The orange/purple gradient is the brand identity - must be perfect
- All text uses specific tracking (letter-spacing) values - maintain these
- The app has a very specific aesthetic: modern, cultural, premium - maintain this feel
- Icons from Lucide must be matched exactly (or use the same icon set if available for React Native)
- All hover states on web should become press/active states on mobile
- Maintain the exact same information architecture and user flow

## Environment Setup

### Required Expo Packages
```json
{
  "expo": "~51.0.0",
  "expo-blur": "~13.0.0",
  "expo-linear-gradient": "~13.0.0",
  "expo-av": "~14.0.0",
  "expo-font": "~12.0.0",
  "expo-status-bar": "~1.12.0",
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/bottom-tabs": "^6.0.0",
  "@react-navigation/stack": "^6.0.0",
  "react-native-safe-area-context": "^4.0.0",
  "react-native-screens": "^3.0.0",
  "@react-native-async-storage/async-storage": "^1.0.0",
  "@google/genai": "^1.35.0"
}
```

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (same as web)

## Final Checklist

Before considering the conversion complete, verify:

- [ ] All components render identically to web
- [ ] All colors match exactly (use color picker to verify)
- [ ] All spacing matches (measure with design tools)
- [ ] All fonts match (size, weight, tracking)
- [ ] All animations work smoothly
- [ ] All interactions work (buttons, inputs, navigation)
- [ ] Theme switching works and persists
- [ ] Audio playback works (TTS)
- [ ] Images load correctly
- [ ] Search functionality works
- [ ] Forms submit correctly
- [ ] Navigation flows correctly
- [ ] Mobile menu/drawer works
- [ ] Safe areas handled correctly
- [ ] Performance is optimal
- [ ] No console errors or warnings
- [ ] Works on both iOS and Android
- [ ] Dark mode works on both platforms
- [ ] Light mode works on both platforms

---

**This prompt should be used in Cursor AI to generate the complete React Native Expo application. The AI should reference the existing web codebase files to ensure pixel-perfect replication of all components, styles, and functionality.**

