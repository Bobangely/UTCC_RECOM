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

    // ตำแหน่ง pin จริง
    private static final Pattern PLACE_PATTERN =
            Pattern.compile("!3d(-?\\d+\\.\\d+)!4d(-?\\d+\\.\\d+)");
    // ศูนย์กลางกล้อง viewport
    private static final Pattern VIEWPORT_PATTERN =
            Pattern.compile("/@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)");
    // พิกัดจาก query โดยตรง
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
                conn.setInstanceFollowRedirects(false); // จัดการ redirect เองเพื่อรองรับ cross-host
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
