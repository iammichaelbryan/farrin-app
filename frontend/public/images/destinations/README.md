# Destination Images

This directory contains image assets for the 24 travel destinations in our recommendation system.

## Current Status

**1 out of 24 destinations** currently has an image file:

### ✅ **With Images:**
- `amsterdam/` - Amsterdam, Netherlands (`58b6b0f863b55 (1).avif`)

### ❌ **Missing Images (Empty Folders):**
- `athens/` - Athens, Greece
- `auckland/` - Auckland, New Zealand  
- `bali/` - Bali, Indonesia
- `bangkok/` - Bangkok, Thailand
- `barcelona/` - Barcelona, Spain
- `berlin/` - Berlin, Germany
- `cancun/` - Cancun, Mexico
- `cape-town/` - Cape Town, South Africa
- `dubai/` - Dubai, United Arab Emirates
- `edinburgh/` - Edinburgh, Scotland
- `honolulu/` - Honolulu, Hawaii
- `london/` - London, United Kingdom
- `los-angeles/` - Los Angeles, USA
- `marrakech/` - Marrakech, Morocco
- `new-york/` - New York, USA
- `paris/` - Paris, France
- `phuket/` - Phuket, Thailand
- `rio-de-janeiro/` - Rio de Janeiro, Brazil
- `rome/` - Rome, Italy
- `seoul/` - Seoul, South Korea
- `sydney/` - Sydney, Australia
- `tokyo/` - Tokyo, Japan
- `vancouver/` - Vancouver, Canada

## Current Usage

**Amsterdam:** `/images/destinations/amsterdam/58b6b0f863b55 (1).avif`

**All others:** The database is configured with `NULL` image URLs, which triggers the FeedView component to display elegant MapPin fallback icons instead of broken image links.

## Fallback Behavior

When `destination.imageUrl` is null/empty, the FeedView component automatically shows:
- Beautiful gradient background (primary-400 to primary-600)
- White MapPin icon overlay
- Clean, professional appearance

## Adding New Images

To add images for destinations:

1. **Add image file** to the destination's folder (create folder if needed)
2. **Update database** in `/src/main/resources/travel-destinations-seed.sql`
3. **Use consistent naming** like `main.jpg` for easier management
4. **Update this README** to reflect the new status

## Image Requirements

- Format: JPG, PNG, or AVIF
- Recommended size: 1200x800px (3:2 aspect ratio)  
- Maximum file size: 2MB
- High quality images showcasing the destination's highlights