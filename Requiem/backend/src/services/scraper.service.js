import axios from "axios";
import * as cheerio from "cheerio";

// Detect content type from URL patterns
const detectType = (url, contentType = "") => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.includes("twitter.com") || url.includes("x.com")) return "tweet";
  if (url.includes("github.com")) return "link";

  if (contentType.includes("image/")) return "image";
  if (contentType.includes("pdf")) return "pdf";

  // fallback — check URL extension
  const cleanUrl = url.split("?")[0];
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(cleanUrl)) return "image";
  if (cleanUrl.endsWith(".pdf") || url.includes("/pdf")) return "pdf";

  return "article";
};

const CONTENT_SELECTORS = [
  "article",
  "[role='main']",
  "main",
  ".post-content",
  ".article-body",
  ".entry-content",
  ".post-body",
  ".article-content",
  "#content",
  ".content",
  "body",
];

const extractContent = ($) => {
  // Remove noise elements first
  $(
    "nav, header, footer, script, style, iframe, " +
    ".ad, .ads, .advertisement, .sidebar, .comments, " +
    ".related, .social-share, .newsletter, .popup, " +
    "[aria-hidden='true']"
  ).remove();
 
  // Try selectors in priority order
  for (const selector of CONTENT_SELECTORS) {
    const el = $(selector).first();
    if (el.length) {
      const text = el.text().replace(/\s+/g, " ").trim();
      if (text.length > 200) return text; // minimum viable content
    }
  }
  return "";
};

// Main scraper function
const scrapeUrl = async (url) => {
  try {
    const { data: html, headers } = await axios.get(url, {
      timeout: 10000, // 10 seconds max
      headers: {
        // Pretend to be a browser so sites don't block us
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const contentType = headers["content-type"] || "";
    console.log("content-type:", contentType);
    const type = detectType(url, contentType);
    
     // if the URL itself is an image, skip scraping entirely
    if (type === "image" || contentType.includes("image/")) {
      return {
        title: url.split("/").pop().split("?")[0] || "Image", // filename as title
        description: "",
        thumbnail: url,  // ← the URL itself is the thumbnail
        siteName: new URL(url).hostname.replace("www.", ""),
        favicon: "",
        type: "image",
        content: "",
      };
    }

    const $ = cheerio.load(html);

    // Helper to get meta tag content
    // Sites use different meta tag formats, so we check all of them
    const getMeta = (property) =>
      $(`meta[property="${property}"]`).attr("content") ||
      $(`meta[name="${property}"]`).attr("content") ||
      "";

    // Open Graph tags (og:title etc) are the most reliable
    // Fallback chain: og → twitter → plain html tag
    const title =
      getMeta("og:title") ||
      getMeta("twitter:title") ||
      $("title").text().trim() ||
      "";

    const description =
      getMeta("og:description") ||
      getMeta("twitter:description") ||
      getMeta("description") ||
      "";

    const thumbPath =
      getMeta("og:image") ||
      getMeta("twitter:image") ||
      "";

    let thumbnail = "";
    if (thumbPath) {
      if (thumbPath.startsWith("http")) {
        thumbnail = thumbPath;
      } else if (thumbPath.startsWith("//")) {
        thumbnail = `https:${thumbPath}`;
      } else {
        // Handle relative paths
        try {
          thumbnail = new URL(thumbPath, url).href;
        } catch (e) {
          thumbnail = "";
        }
      }
    }

    const siteName =
      getMeta("og:site_name") ||
      new URL(url).hostname.replace("www.", "");

    // Favicon
    const faviconPath =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    // Handle relative favicon paths
    const favicon = faviconPath.startsWith("http")
      ? faviconPath
      : `${new URL(url).origin}${faviconPath}`;

    let content = "";
    const isHtmlPage = contentType.startsWith("text/html");
    const isReasonableSize = html.length < 5_000_000; // skip pages > 5MB
 
    if (isHtmlPage && isReasonableSize) {
      const extracted = extractContent($);
      // Only store if meaningful content was extracted
      if (extracted.length >= 100) {
        content = extracted.slice(0, 50000); // cap at 50K chars
      }
    }

    return {
      title: title.slice(0, 500),           // cap length
      description: description.slice(0, 1000),
      thumbnail,
      siteName,
      favicon,
      type,
      content,
    };
  } catch (error) {
    // If scraping fails, return empty metadata — don't crash the save
    console.error(`Scraper failed for ${url}:`, error.message);

    const fallbackType = detectType(url);

    return {
      title: "",
      description: "",
      thumbnail: "",
      siteName: new URL(url).hostname.replace("www.", ""),
      favicon: "",
      type: fallbackType,
      content: "",
    };
  }
};

export { scrapeUrl };