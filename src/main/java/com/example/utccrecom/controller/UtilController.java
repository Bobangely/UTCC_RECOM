package com.example.utccrecom.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.HttpURLConnection;
import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/util")
public class UtilController {

    // !3d<lat>!4d<lng> = actual pin location (most accurate)
    private static final Pattern PLACE_PATTERN =
            Pattern.compile("!3d(-?\\d+\\.\\d+)!4d(-?\\d+\\.\\d+)");
    // @<lat>,<lng> = viewport camera center (fallback, can be slightly off)
    private static final Pattern VIEWPORT_PATTERN =
            Pattern.compile("/@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)");
    // ?q=<lat>,<lng> = explicit query coordinates
    private static final Pattern QUERY_PATTERN =
            Pattern.compile("[?&]q=(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)");

    @GetMapping("/resolve-maps-url")
    public ResponseEntity<Map<String, Object>> resolveMapsUrl(@RequestParam String url) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("originalUrl", url);
        try {
            String currentUrl = url;
            boolean redirect = true;
            int redirectsCount = 0;
            HttpURLConnection conn = null;

            while (redirect && redirectsCount < 5) {
                conn = (HttpURLConnection) URI.create(currentUrl).toURL().openConnection();
                conn.setInstanceFollowRedirects(false); // We handle redirects manually for cross-host
                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                conn.setConnectTimeout(6000);
                conn.setReadTimeout(6000);
                conn.connect();

                int code = conn.getResponseCode();
                if (code == HttpURLConnection.HTTP_MOVED_PERM || code == HttpURLConnection.HTTP_MOVED_TEMP || code == HttpURLConnection.HTTP_SEE_OTHER) {
                    currentUrl = conn.getHeaderField("Location");
                    redirectsCount++;
                    conn.disconnect();
                } else {
                    redirect = false;
                }
            }

            String finalUrl = currentUrl;
            int code = conn != null ? conn.getResponseCode() : -1;
            if (conn != null) conn.disconnect();

            result.put("finalUrl", finalUrl);
            result.put("status", code);

            // Priority: query param > place coords (!3d!4d) > viewport (@)
            Matcher m = QUERY_PATTERN.matcher(finalUrl);
            String source = null;
            if (m.find()) {
                source = "query";
            } else {
                m = PLACE_PATTERN.matcher(finalUrl);
                if (m.find()) {
                    source = "place";
                } else {
                    m = VIEWPORT_PATTERN.matcher(finalUrl);
                    if (m.find()) source = "viewport";
                }
            }
            if (source != null) {
                result.put("lat", Double.parseDouble(m.group(1)));
                result.put("lng", Double.parseDouble(m.group(2)));
                result.put("source", source);
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
