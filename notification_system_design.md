# Stage 1

## APIs

### GET /notifications
Fetch all notifications for a student.

### POST /notifications
Create a new notification.

### PATCH /notifications/:id/read
Mark a notification as read.

### DELETE /notifications/:id
Delete a notification.

---

## Headers

```json
{
  "Authorization": "Bearer token",
  "Content-Type": "application/json"
}
```

---

## Sample Response

```json
[
  {
    "id": "1",
    "type": "Placement",
    "message": "CSX Corporation hiring",
    "isRead": false,
    "createdAt": "2026-04-22T10:00:00Z"
  }
]
```

---

## Real-Time Notifications

WebSockets or Socket.IO can be used for instant notification delivery.

---

# Stage 2

## Database Choice

PostgreSQL is preferred because it provides good indexing support and handles relational data efficiently.

---

## Schema

id - UUID
studentId - INTEGER
notificationType - VARCHAR
message - TEXT
isRead - BOOLEAN
createdAt - TIMESTAMP

---

## Challenges

- Large notification volume
- Slow queries
- High database load

---

## Solutions

- Indexing
- Pagination
- Redis caching
- Partitioning old data

---

# Stage 3

## Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

The query is correct, but performance becomes slow when the table size increases.

---

## Better Index

```sql
CREATE INDEX idx_notifications
ON notifications(studentID, isRead, createdAt DESC);
```

Without indexing:
- O(n)

With indexing:
- O(log n)

---

## Why Not Index Every Column?

Too many indexes increase storage and slow down inserts and updates.

---

## Placement Query

```sql
SELECT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4

## Performance Improvements

- Redis caching
- Pagination
- Infinite scrolling
- Lazy loading
- WebSockets to reduce polling

---

## Tradeoff

Caching improves speed but may sometimes return slightly outdated data.

---

# Stage 5

## Problems

- Synchronous execution
- Slow processing
- Poor failure handling

---

## Better Design

Use:
- RabbitMQ or Kafka
- Queue-based processing
- Async workers
- Retry mechanism

---

## Pseudocode

```python
function notify_all(student_ids, message):

    for each student_id:
        publish_to_queue(student_id, message)

worker():

    task = consume_queue()

    save_to_db(task)

    send_email(task)

    push_notification(task)
```

Saving notifications and sending emails should be handled separately to improve reliability.

---

# Stage 6

## Priority Order

1. Placement
2. Result
3. Event

---

## Approach

Use a Priority Queue or Min Heap to maintain the top 10 notifications based on:
- notification weight
- recency

---

## Complexity

- O(n log k)

where:
- n = total notifications
- k = top notifications