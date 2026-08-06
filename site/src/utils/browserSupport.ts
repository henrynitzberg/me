// Safari's backdrop-filter has never supported referencing an SVG <filter>
// via url() - only the plain CSS filter functions (blur(), brightness(),
// etc). Per the CSS Filter Effects spec, a filter-value-list is one unit: if
// any function in it fails to parse, the *whole* property value is invalid
// and the browser drops all of it, not just the unsupported part. This is
// also, in practice, the dividing line between Chromium (where the site's
// liquid-glass effect works as intended) and everything else - checking for
// this one concrete capability is more reliable than trying to sniff "is
// this Chromium" from the user agent string, which is both spoofable and
// doesn't actually guarantee the feature either way.
export const SUPPORTS_SVG_BACKDROP_FILTER =
  typeof CSS !== "undefined" && CSS.supports("backdrop-filter", "url(#x)");
