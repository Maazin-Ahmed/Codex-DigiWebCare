# DigiCare Web Website Audit

## Scope and route inventory

The app uses a small pathname switch in `src/App.jsx` and a shared, data-driven service detail page. The source contains eight fixed paths and 15 service paths. Unknown paths use the app's 404 view.

| Route | Page title | Main heading |
| --- | --- | --- |
| `/` | DigiCare Web — Digital transformation partner | Your digital transformation partner. |
| `/about-us` | About DigiCare Web — Digital transformation partner | Empowering your digital journey. |
| `/service` | Digital Services — DigiCare Web | Services with a clear scope. |
| `/faq` | Frequently Asked Questions — DigiCare Web | Start with the useful questions. |
| `/contact-us` | Contact DigiCare Web | Bring us the next opportunity. |
| `/privacy-policy` | Privacy Policy — DigiCare Web | Privacy Policy |
| `/terms-and-conditions` | Terms and Conditions — DigiCare Web | Terms and Conditions |
| `/payment` | Package Request — DigiCare Web | Start with a package conversation. |
| `/financial-services` | Financial Services — DigiCare Web | Financial Services |
| `/cloud-based-services` | Cloud-Based Services — DigiCare Web | Cloud-Based Services |
| `/lms-cms-development-services` | LMS/CMS Development Services — DigiCare Web | LMS/CMS Development Services |
| `/content-development-services` | Content Development Services — DigiCare Web | Content Development Services |
| `/amazon-store-management-services` | Amazon Store Management Services — DigiCare Web | Amazon Store Management Services |
| `/amazon-brand-registry-services` | Amazon Brand Registry Services — DigiCare Web | Amazon Brand Registry Services |
| `/amazon-publishing-services` | Amazon Publishing Services — DigiCare Web | Amazon Publishing Services |
| `/ecommerce-solutions` | Ecommerce Solutions — DigiCare Web | Ecommerce Solutions |
| `/digital-marketing-services` | Digital Marketing Services — DigiCare Web | Digital Marketing Services |
| `/software-development-solutions` | Software Development Solutions — DigiCare Web | Software Development Solutions |
| `/digital-transformation-services` | Digital Transformation Services — DigiCare Web | Digital Transformation Services |
| `/web-development-solutions` | Web Development Solutions — DigiCare Web | Web Development Solutions |
| `/google-advertising-services` | Google Advertising Services — DigiCare Web | Google Advertising Services |
| `/business-consulting-services` | Business Consulting Services — DigiCare Web | Business Consulting Services |
| `/animation-trademark-services` | Animation and Trademark Services — DigiCare Web | Animation and Trademark Services |
| Unknown paths | Page not found — DigiCare Web | This route is not on the map. |

Service detail pages share the same hero, benefits, packages/enquiry, contact, header, and footer components. The service subheadings are supplied by each service's `headline` in `src/content.js`. Financial Services uses “Strategic financial solutions for your future.” The catalogue has Amazon store management, brand registry, and publishing routes; there is no standalone Amazon Advertising route in the source.

## Audit findings and changes

- **Typography:** removed mid-word wrapping from headings and cards. Headings now use normal word boundaries, `hyphens: none`, balanced wrapping, and fluid sizes. The hero title width is capped at 800px; shared page and service titles at 700px. Section and card titles use shared scale tokens.
- **Homepage hero:** reduced the desktop title scale and accent indent, centered the hero grid, and tightened the text width to keep the copy clear of the geometric visual. The supporting copy remains capped at a readable measure. The entrance motion no longer fades all copy to transparent on first paint.
- **Service and pricing layouts:** service title and package headings use more moderate line heights and fluid sizes. Package cards have intrinsic-width-safe grids and natural title wrapping. The consultation enquiry layout reserves a column wide enough for “Consultation” and stacks at tablet/mobile widths.
- **Responsive UI:** mobile navigation's hidden contact link is removed from keyboard tab order. Shared service and page layouts stack at the existing tablet breakpoint; catalog and package grids reduce to one column on narrow screens. Button height and page gutters now use shared tokens.
- **Motion and scrolling:** homepage video and pointer parallax respect reduced-motion preferences. ScrollTrigger still pins and translates the desktop services rail; its pin anticipation is set to one, mobile keeps its native horizontal snap rail, and animation cleanup remains in place.
- **Brand and metadata:** normalized visible brand references to DigiCare Web, aligned the primary logo accents with the specified cyan/white, corrected the structured-data email, and moved canonical/OG/Twitter metadata to the `www` host.
- **SEO delivery:** `scripts/generate-route-pages.js` emits static route HTML with route-specific metadata during `npm run build`, using `src/seo.js` and `serviceCatalog`. It also generates the sitemap from the same routes. The payment page is noindex and omitted from the sitemap; unknown routes are noindex after app startup. No lastmod values are fabricated.

## Shared layout and responsive behavior

- Homepage hero heading: `clamp(2.15rem, 6.4vw, 6rem)` desktop scale, with smaller overrides below 560px and 360px; title container max-width 800px.
- Page hero heading: `clamp(2.5rem, 6vw, 5.9rem)`, max-width 700px; stacks with artwork below 900px.
- Service detail heading: `clamp(2.6rem, 5.3vw, 5.2rem)`, max-width 700px; service copy and illustration stack below 900px.
- Section headings use a shared `clamp(2.2rem, 4.4vw, 4.8rem)` scale with a smaller tablet override. Package cards use `minmax()` columns and natural height.
- Navigation changes to the hamburger menu below 900px. Mobile hero content stacks, the visual becomes subdued, and the service journey uses touch scrolling and snap points rather than desktop pinning.

## Verification

- `npm run build`: passed. The build also generated 22 indexable route pages plus the noindex payment page.
- Sitemap: parsed as valid XML; 22 unique URLs use `https://www.digicareweb.com/`, all 15 service slugs are present, and payment/query/anchor URLs are excluded.
- Generated route HTML: all 22 indexable pages exist with unique titles and descriptions; each canonical exactly matches its sitemap URL, and Open Graph/Twitter descriptions match the route description. The payment page is `noindex`.
- Local production preview: sitemap and robots returned HTTP 200 with `text/xml` and `text/plain`. All 22 canonical sitemap URLs returned HTTP 200. The Financial Services route returned its route-specific title, description, canonical, Open Graph, and Twitter tags in the HTML response.
- Visual browser review: homepage at 1440×900, 430×932, and 320×700; Financial Services at 1440×900 and 390×844. The hero words remained whole and the layouts showed no horizontal clipping in these captures.
- The Financial Services screenshots covered its hero; the lower pricing section was reviewed in source/CSS but was not captured in the browser.
- Source checks: no `overflow-wrap:anywhere`, `word-break:break-all`, old uppercase brand spelling, or bare non-www production canonical remains. `git diff --check` passed.

## Remaining checks and limitations

- The live domain could not be fetched by the available web inspection tool; checks were made against the local production build.
- Browser screenshots covered representative routes and sizes, not every route at all nine requested viewports. The hamburger interaction and the full horizontal-to-vertical scroll release were code-reviewed but not manually driven in a browser.
- Lighthouse was not available. The build reports a 400.72 kB main JS chunk (129.22 kB gzip) and a lazily loaded 915.02 kB Hero3D chunk (242.77 kB gzip), with the existing large-chunk warning. The homepage poster is 58 kB; the supplied WebM is 217 kB and MP4 fallback is 3.6 MB. No assets were removed.
- A standalone Amazon Advertising route was not present in the repository and was not added.
