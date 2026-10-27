# Newman Execution Summary — 2026-09-24

ส่วนที่เลือกรัน:

- Page Availability
- Read APIs
- Negative API Tests
- ไม่ได้รัน CRUD Lifecycle เพราะ datasource ยังใช้ไม่ได้

## Run Statistics

| Metric | Result |
|---|---:|
| Iterations | 1 |
| Requests | 14 |
| Failed requests | 0 |
| Test scripts | 14 |
| Assertions | 30 |
| Failed assertions | 10 |
| Total duration | 13 seconds |
| Average response time | 854 ms |
| Minimum response time | 2 ms |
| Maximum response time | 3.6 seconds |
| Data received | approximately 149.39 kB |

## Assertion ที่ไม่ผ่าน

| Area | Failures | Reason |
|---|---:|---|
| `GET /api/university/items` | 2 | Expected 200 JSON array, received 500 error object |
| `GET /api/places` | 2 | Expected 200 JSON array, received 500 error object |
| `GET /api/nearby-places` | 2 | Expected 200 JSON array, received 500 error object |
| `GET /api/nearby-categories` | 2 | Expected 200 JSON array, received 500 error object |
| `POST /api/upload/multiple` without multipart files | 2 | Expected 4xx without stack trace, received 500 with Java stack trace |

## ส่วนที่ผ่าน

- Home and Nearby pages returned 200 HTML
- Invalid UUID returned 400
- Missing search parameters returned 400
- Missing and whitespace-only chat messages returned 400 with the expected error
- Unsupported PATCH method returned 405
- Missing maps URL returned 400

ไม่ได้ commit raw response body เพราะ error response มี stack trace และข้อมูลของ environment ปนอยู่
