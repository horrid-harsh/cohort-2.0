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
  let targetUrl = url;

  // 🔹 SPECIAL CASE: YouTube (Render.com IPs are often blocked by YouTube)
  // We use the oEmbed API which is much more reliable and bot-friendly
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const { data } = await axios.get(oEmbedUrl, {
        timeout: 5000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
      });
      
      return {
        title: data.title || "",
        description: "", 
        thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^&?/]+)/)?.[1]}/hqdefault.jpg`,
        siteName: "YouTube",
        favicon: "https://www.youtube.com/favicon.ico",
        type: "video",
        content: "",
      };
    } catch (error) {
       console.warn("YouTube oEmbed failed, falling back to standard scrape:", error.message);
       // Fall through to standard scrape
    }
  }

  // Use vxtwitter/fxtwitter for better meta tags on Twitter/X
  if (url.includes("twitter.com") || url.includes("x.com")) {
    targetUrl = url.replace("twitter.com", "vxtwitter.com").replace("x.com", "vxtwitter.com");
  }

  try {
    const { data: html, headers: axiosHeaders } = await axios.get(targetUrl, {
      timeout: 10000, // 10 seconds max
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const contentType = axiosHeaders["content-type"] || "";
    const type = detectType(url, contentType);
    
    if (type === "image" || contentType.includes("image/")) {
      return {
        title: url.split("/").pop().split("?")[0] || "Image",
        description: "",
        thumbnail: url,
        siteName: new URL(url).hostname.replace("www.", ""),
        favicon: "",
        type: "image",
        content: "",
      };
    }

    const $ = cheerio.load(html);

    const getMeta = (property) =>
      $(`meta[property="${property}"]`).attr("content") ||
      $(`meta[name="${property}"]`).attr("content") ||
      "";

    let title =
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
        try {
          thumbnail = new URL(thumbPath, url).href;
        } catch (e) {
          thumbnail = "";
        }
      }
    }

    // 🔹 HARD FALLBACK FOR YOUTUBE THUMBNAILS (If scraping is used)
    if (!thumbnail && (url.includes("youtube.com") || url.includes("youtu.be"))) {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^&?/]+)/)?.[1];
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        if(!title) title = "YouTube Video";
      }
    }

    const siteName =
      getMeta("og:site_name") ||
      new URL(url).hostname.replace("www.", "");

    const faviconPath =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    const favicon = faviconPath.startsWith("http")
      ? faviconPath
      : `${new URL(url).origin}${faviconPath}`;

    let content = "";
    const isHtmlPage = contentType.startsWith("text/html");
    const isReasonableSize = html.length < 5_000_000;
 
    if (isHtmlPage && isReasonableSize) {
      const extracted = extractContent($);
      if (extracted.length >= 100) {
        content = extracted.slice(0, 50000);
      }
    }

    return {
      title: title.slice(0, 500),
      description: description.slice(0, 1000),
      thumbnail,
      siteName,
      favicon,
      type,
      content,
    };
  } catch (error) {
    console.error(`Scraper failed for ${url}:`, error.message);

    const fallbackType = detectType(url);
    let fallbackThumbnail = "";
    let fallbackTitle = "";

    // 🔹 FINAL FALLBACK FOR YOUTUBE (If even standard scrape fails)
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^&?/]+)/)?.[1];
      if (videoId) {
        fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        fallbackTitle = "YouTube Video";
      }
    }

    return {
      title: fallbackTitle,
      description: "",
      thumbnail: fallbackThumbnail,
      siteName: new URL(url).hostname.replace("www.", ""),
      favicon: "",
      type: fallbackType,
      content: "",
    };
  }
};

export { scrapeUrl };