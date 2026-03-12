import axios from "axios";
import * as cheerio from "cheerio";

// Detect content type from URL patterns
const detectType = (url, contentType = "") => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.includes("twitter.com") || url.includes("x.com")) return "tweet";
  if (contentType.includes("pdf") || url.endsWith(".pdf")) return "pdf";
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) return "image";
  return "article";
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

    const thumbnail =
      getMeta("og:image") ||
      getMeta("twitter:image") ||
      "";

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

    const type = detectType(url, headers["content-type"] || "");

    return {
      title: title.slice(0, 500),           // cap length
      description: description.slice(0, 1000),
      thumbnail,
      siteName,
      favicon,
      type,
    };
  } catch (error) {
    // If scraping fails, return empty metadata — don't crash the save
    console.error(`Scraper failed for ${url}:`, error.message);
    return {
      title: "",
      description: "",
      thumbnail: "",
      siteName: new URL(url).hostname.replace("www.", ""),
      favicon: "",
      type: "link",
    };
  }
};

export { scrapeUrl };