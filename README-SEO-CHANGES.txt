Greg's Brush Strokes — SEO pass (applied 2026-09-23)
Base: v4.5.5. Drop these files into the site root, preserving paths.

== v3 BOOST (applied later on 2026-09-23) ==

NEW FILES (12 dedicated area pages — genuinely unique copy per area)
  area-cheadle.html  area-stockport.html  area-hazel-grove.html
  area-bramhall.html area-wythenshawe.html area-timperley.html
  area-altrincham.html area-bowdon.html   area-handforth.html
  area-wilmslow.html area-alderley-edge.html area-knutsford.html

MODIFIED (v3)
  Every page        nav "Services" and "Areas" are now dropdowns built from
                    real <a href> links (button toggles, no hover dependency,
                    aria-expanded managed). LocalBusiness JSON-LD already
                    present site-wide from the first pass; area pages carry a
                    per-area LocalBusiness + BreadcrumbList @graph.
  assets/css/styles.css
                    Appended block: full-screen solid mobile menu (inset:0,
                    z-index below header, body scroll-lock), dropdown +
                    mobile submenu styling, hero Call/WhatsApp pair as an
                    equal-width two-column grid on mobile (single column
                    under 400px), .locations chip links, adaptive footer grid.
  assets/js/main.js Dropdown open/close + aria-expanded, Escape closes the
                    mobile menu, body scroll lock while the menu is open.
  index.html        Area chips now link to the 12 area pages; #areas anchor
                    added; footer gains an Areas column.
  sitemap.xml       +12 area URLs (20 total).

UNCHANGED (v3): all WhatsApp links, tel: links, images and the copy of the
4 existing service pages.

== FIRST PASS ==

NEW FILES
  interior-painting.html
  exterior-painting.html
  spray-finishing.html
  wallpapering-small-diy.html
  sitemap.xml
  robots.txt

MODIFIED
  index.html        unique meta, JSON-LD @graph, WhatsApp CTAs x2, 52 reviews,
                    service cards now link to the new pages, footer Services column
  services.html     now a hub: 4 rows link out to the dedicated pages (short summaries
                    only, so the long copy is not duplicated across URLs). The
                    "Full-house & pre-sale redecoration" row and the "How Greg works"
                    band are retained here unchanged.
  reviews.html      unique meta, JSON-LD, WhatsApp CTA, "52 five-star reviews" in copy
  contact.html      unique meta, JSON-LD, WhatsApp row in the contact list + CTA pair
  assets/css/styles.css
                    APPENDED ONLY (see the marked block at the end) — .btn--whatsapp,
                    .svc-cta, .crumbs, linked card headings. No existing rule changed.

UNCHANGED / NOT SHIPPED
  assets/img/*       — untouched (all passes)
  All tel: links and all image alt text left exactly as they were.

NOTE ON URLs
  Canonicals and sitemap use https://gregsbrushstrokes.co.uk/ , matching the
  canonical convention already in v4.5.5. If the site stays on the
  clariyo.github.io preview path, swap that base before submitting the sitemap.
