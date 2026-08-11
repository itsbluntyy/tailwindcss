/* ==========================================================================
   photos.js — the single data file for your portfolio.

   To add your own photo:

   1. Drop the file (and optionally resized versions) into /images.
   2. Add an entry to the PHOTOS array below, e.g.:

      {
        id: 'my-photo-01',              // unique id (used internally)
        category: 'landscape',          // any category — filter buttons are
                                        // generated automatically from these
        alt: 'Sunrise over the ridge',  // REQUIRED — describe the photo
        caption: 'Dolomites, 2025',     // optional, shown in the lightbox
        width: 1600,                    // pixel size of the original file —
        height: 1067,                   // used to prevent layout shift
        src: 'images/my-photo-01.jpg',  // the image itself
        srcset: [                       // optional but recommended: smaller
          ['images/my-photo-01-400.jpg', 400],   // versions for small screens
          ['images/my-photo-01-800.jpg', 800],
          ['images/my-photo-01-1600.jpg', 1600],
        ],
      },

   3. That's it — the gallery, filters, and lightbox pick it up on reload.

   Entries with a `picsum` id are placeholders served from picsum.photos.
   Delete them as you replace them with your own work.
   ========================================================================== */

const PHOTOS = [
  // --- Landscape ---------------------------------------------------------
  { id: 'ls-01', category: 'landscape', alt: 'Mist rolling over a forested mountain ridge', caption: 'Morning mist', picsum: 1018, width: 1200, height: 800 },
  { id: 'ls-02', category: 'landscape', alt: 'Alpine lake reflecting snow-capped peaks', caption: 'Still water', picsum: 1015, width: 900, height: 1200 },
  { id: 'ls-03', category: 'landscape', alt: 'Waves breaking on a rocky shoreline at dusk', caption: 'Last light', picsum: 1036, width: 1200, height: 800 },
  { id: 'ls-04', category: 'landscape', alt: 'Rolling hills under a dramatic cloudy sky', caption: 'Open country', picsum: 1043, width: 1200, height: 900 },
  { id: 'ls-05', category: 'landscape', alt: 'Sunlight breaking through a dense pine forest', caption: 'Into the woods', picsum: 1019, width: 900, height: 1200 },
  { id: 'ls-06', category: 'landscape', alt: 'Lone tree silhouetted against an evening sky', caption: 'Solitude', picsum: 110, width: 1200, height: 800 },

  // --- Portrait ----------------------------------------------------------
  { id: 'pt-01', category: 'portrait', alt: 'Portrait of a person gazing off camera in soft light', caption: 'Quiet moment', picsum: 1005, width: 900, height: 1200 },
  { id: 'pt-02', category: 'portrait', alt: 'Close-up portrait with shallow depth of field', caption: 'Study in focus', picsum: 338, width: 1200, height: 800 },
  { id: 'pt-03', category: 'portrait', alt: 'Person standing by a window in natural light', caption: 'Window light', picsum: 1011, width: 900, height: 1200 },
  { id: 'pt-04', category: 'portrait', alt: 'Candid portrait taken outdoors at golden hour', caption: 'Golden hour', picsum: 1012, width: 1200, height: 800 },
  { id: 'pt-05', category: 'portrait', alt: 'Portrait framed by shadow and light', caption: 'Half light', picsum: 823, width: 900, height: 1200 },

  // --- Street ------------------------------------------------------------
  { id: 'st-01', category: 'street', alt: 'Pedestrians crossing a rain-soaked city street', caption: 'Crossing', picsum: 1029, width: 1200, height: 800 },
  { id: 'st-02', category: 'street', alt: 'Narrow alley with laundry strung between buildings', caption: 'Back streets', picsum: 430, width: 900, height: 1200 },
  { id: 'st-03', category: 'street', alt: 'Cyclist passing a mural on a brick wall', caption: 'Passing through', picsum: 1071, width: 1200, height: 800 },
  { id: 'st-04', category: 'street', alt: 'Neon signs reflected in a shop window at night', caption: 'Night colors', picsum: 452, width: 1200, height: 900 },
  { id: 'st-05', category: 'street', alt: 'Commuters on a subway platform in motion blur', caption: 'Rush hour', picsum: 1067, width: 900, height: 1200 },
  { id: 'st-06', category: 'street', alt: 'Street vendor under a striped awning', caption: 'The vendor', picsum: 122, width: 1200, height: 800 },
]
