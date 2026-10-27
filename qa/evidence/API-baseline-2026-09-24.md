# API Baseline Evidence — 2026-09-24

Base URL: `http://localhost:8080`

| Request | Observed Status | Observation |
|---|---:|---|
| `GET /` | 200 | HTML home page returned |
| `GET /nearby.html` | 200 | HTML nearby page returned |
| `GET /api/university/items` | 500 | Datasource connection failed |
| `GET /api/places` | 500 | Datasource connection failed |
| `GET /api/nearby-places` | 500 | Datasource connection failed |
| `GET /api/nearby-categories` | 500 | Datasource connection failed |
| `GET /api/places/not-a-uuid` | 400 | Invalid UUID rejected |
| `GET /api/places/search` | 400 | Missing `name` rejected |
| `GET /api/nearby-places/search` | 400 | Missing `name` rejected |
| `POST /api/chat` with `{}` | 400 | `{"error":"message is required"}` |
| `POST /api/chat` with whitespace message | 400 | `{"error":"message is required"}` |
| `PATCH /api/chat` | 405 | Unsupported method rejected |
| `GET /api/util/resolve-maps-url` | 400 | Missing `url` rejected |
| `POST /api/upload/multiple` without multipart body | 500 | `MultipartException`; stack trace included |

## Maven Baseline

```text
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

ใน run เดียวกันมี PostgreSQL datasource error อยู่ใน log จึงสรุปไม่ได้ว่า database พร้อมใช้งาน และไม่ได้คัดลอก connection identifier หรือ secret มาใส่ไฟล์นี้

## Newman Confirmation

หลังเรียก baseline requests แล้วได้รัน Postman Collection ด้วย Newman ต่อ ผลอยู่ใน [Newman execution summary](./newman-summary-2026-09-24.md)
