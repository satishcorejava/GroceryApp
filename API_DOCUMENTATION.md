# Cornucopia Grocery App - API Documentation

## Base URL
```
https://api.zakya.com/v1
```

---

## 1. Authentication APIs

### 1.1 User Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "role": "customer"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "role": "customer",
      "profileImage": "https://example.com/image.jpg",
      "createdAt": "2026-02-10T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "message": "Login successful"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 1.2 User Signup
**Endpoint:** `POST /auth/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "customer"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "role": "customer",
      "profileImage": null,
      "createdAt": "2026-02-10T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "message": "Account created successfully"
}
```

---

### 1.3 Get Current User
**Endpoint:** `GET /auth/current`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "customer",
    "profileImage": "https://example.com/image.jpg",
    "createdAt": "2026-02-10T10:00:00Z"
  }
}
```

---

### 1.4 Update User Profile
**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "profileImage": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "profileImage": "https://example.com/new-image.jpg"
  },
  "message": "Profile updated successfully"
}
```

---

## 2. Products APIs

### 2.1 Get All Products
**Endpoint:** `GET /products?page=1&limit=20&search=tomato&category=vegetables`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search keyword
- `category` (optional): Filter by category
- `subcategory` (optional): Filter by subcategory

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "1",
        "name": "Fresh Tomatoes",
        "price": 3.99,
        "mrp": 4.99,
        "unit": "kg",
        "image": "https://example.com/tomato.jpg",
        "category": "vegetables",
        "subcategory": "other-vegetables",
        "description": "Organic, locally grown tomatoes",
        "inStock": true,
        "discount": 20,
        "rating": 4.5,
        "reviews": 128
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

---

### 2.2 Get Product by ID
**Endpoint:** `GET /products/{productId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Fresh Tomatoes",
    "price": 3.99,
    "mrp": 4.99,
    "unit": "kg",
    "image": "https://example.com/tomato.jpg",
    "category": "vegetables",
    "subcategory": "other-vegetables",
    "description": "Organic, locally grown tomatoes",
    "inStock": true,
    "discount": 20,
    "rating": 4.5,
    "reviews": 128,
    "nutritionFacts": {
      "servingSize": "100g",
      "calories": 18,
      "protein": 0.9,
      "carbs": 3.9,
      "fat": 0.2
    }
  }
}
```

---

## 3. Cart APIs

### 3.1 Get Cart
**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cartId": "cart-123",
    "items": [
      {
        "id": "item-1",
        "productId": "1",
        "name": "Fresh Tomatoes",
        "price": 3.99,
        "quantity": 2,
        "subtotal": 7.98,
        "image": "https://example.com/tomato.jpg"
      }
    ],
    "subtotal": 7.98,
    "tax": 0.79,
    "deliveryFee": 2.00,
    "total": 10.77
  }
}
```

---

### 3.2 Add to Cart
**Endpoint:** `POST /cart/add`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "productId": "1",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cartId": "cart-123",
    "items": [
      {
        "id": "item-1",
        "productId": "1",
        "name": "Fresh Tomatoes",
        "price": 3.99,
        "quantity": 2,
        "subtotal": 7.98
      }
    ],
    "total": 10.77
  },
  "message": "Item added to cart"
}
```

---

### 3.3 Update Cart Item
**Endpoint:** `PUT /cart/update`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "productId": "1",
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cartId": "cart-123",
    "total": 12.76
  },
  "message": "Cart updated"
}
```

---

### 3.4 Remove from Cart
**Endpoint:** `DELETE /cart/remove/{productId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cartId": "cart-123",
    "total": 7.77
  },
  "message": "Item removed from cart"
}
```

---

### 3.5 Clear Cart
**Endpoint:** `POST /cart/clear`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## 4. Order APIs

### 4.1 Create Order
**Endpoint:** `POST /orders/create`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    }
  ],
  "addressId": "addr-123",
  "paymentMethodId": "pm-123",
  "paymentMethod": "card",
  "notes": "Please ring the doorbell"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order-456",
    "orderNumber": "ORD-20260210-001",
    "items": [
      {
        "productId": "1",
        "name": "Fresh Tomatoes",
        "quantity": 2,
        "price": 3.99,
        "subtotal": 7.98
      }
    ],
    "subtotal": 7.98,
    "tax": 0.79,
    "deliveryFee": 2.00,
    "total": 10.77,
    "status": "confirmed",
    "estimatedDelivery": "2026-02-12T18:00:00Z",
    "createdAt": "2026-02-10T10:00:00Z"
  },
  "message": "Order created successfully"
}
```

---

### 4.2 Get All Orders
**Endpoint:** `GET /orders?page=1&limit=10&status=confirmed`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (pending, confirmed, preparing, out_for_delivery, delivered, cancelled)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "order-456",
        "orderNumber": "ORD-20260210-001",
        "total": 10.77,
        "status": "confirmed",
        "createdAt": "2026-02-10T10:00:00Z",
        "estimatedDelivery": "2026-02-12T18:00:00Z",
        "items": [
          {
            "name": "Fresh Tomatoes",
            "quantity": 2
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
}
```

---

### 4.3 Get Order by ID
**Endpoint:** `GET /orders/{orderId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order-456",
    "orderNumber": "ORD-20260210-001",
    "items": [
      {
        "id": "item-1",
        "productId": "1",
        "name": "Fresh Tomatoes",
        "quantity": 2,
        "price": 3.99,
        "subtotal": 7.98
      }
    ],
    "subtotal": 7.98,
    "tax": 0.79,
    "deliveryFee": 2.00,
    "total": 10.77,
    "status": "confirmed",
    "deliveryAddress": {
      "id": "addr-123",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    },
    "estimatedDelivery": "2026-02-12T18:00:00Z",
    "trackingInfo": {
      "currentStatus": "preparing",
      "deliveryAgent": {
        "id": "agent-123",
        "name": "Ahmed Khan",
        "phone": "8765432109",
        "location": {
          "lat": 40.7200,
          "lng": -74.0100
        }
      }
    },
    "createdAt": "2026-02-10T10:00:00Z"
  }
}
```

---

### 4.4 Cancel Order
**Endpoint:** `POST /orders/{orderId}/cancel`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order-456",
    "status": "cancelled",
    "refundAmount": 10.77,
    "refundStatus": "processed"
  },
  "message": "Order cancelled successfully"
}
```

---

## 5. Address APIs

### 5.1 Get All Addresses
**Endpoint:** `GET /addresses`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "addr-123",
        "label": "Home",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        },
        "isDefault": true,
        "createdAt": "2026-02-10T10:00:00Z"
      }
    ]
  }
}
```

---

### 5.2 Create Address
**Endpoint:** `POST /addresses/create`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "label": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "addr-123",
    "label": "Home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "isDefault": true,
    "createdAt": "2026-02-10T10:00:00Z"
  },
  "message": "Address added successfully"
}
```

---

### 5.3 Update Address
**Endpoint:** `PUT /addresses/{addressId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "label": "Home",
  "street": "456 Oak Ave",
  "city": "Brooklyn",
  "state": "NY",
  "zipCode": "11201"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "addr-123",
    "label": "Home",
    "street": "456 Oak Ave",
    "city": "Brooklyn",
    "state": "NY",
    "zipCode": "11201"
  },
  "message": "Address updated successfully"
}
```

---

### 5.4 Delete Address
**Endpoint:** `DELETE /addresses/{addressId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### 5.5 Set Default Address
**Endpoint:** `POST /addresses/{addressId}/set-default`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Default address updated"
}
```

---

## 6. Payment APIs

### 6.1 Get Payment Methods
**Endpoint:** `GET /payments/methods`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "id": "pm-123",
        "type": "card",
        "name": "Visa Card",
        "lastFour": "4242",
        "expiryDate": "12/26",
        "isDefault": true
      },
      {
        "id": "pm-124",
        "type": "upi",
        "upiId": "john@okhdfcbank"
      }
    ]
  }
}
```

---

### 6.2 Process Payment
**Endpoint:** `POST /payments/process`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "orderId": "order-456",
  "amount": 10.77,
  "paymentMethod": "card",
  "paymentMethodId": "pm-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn-789",
    "orderId": "order-456",
    "amount": 10.77,
    "status": "success",
    "timestamp": "2026-02-10T10:05:00Z"
  },
  "message": "Payment processed successfully"
}
```

---

## 7. Delivery Agent APIs

### 7.1 Get Assigned Orders (Agent)
**Endpoint:** `GET /delivery/orders?status=assigned`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (assigned, in-transit, arrived, delivered)
- `date` (optional): Filter by delivery date

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order-456",
        "orderNumber": "ORD-20260210-001",
        "customerName": "John Doe",
        "customerPhone": "9876543210",
        "deliveryAddress": "123 Main St, New York, NY 10001",
        "items": [
          {
            "name": "Fresh Tomatoes",
            "quantity": 2,
            "price": 3.99
          }
        ],
        "total": 10.77,
        "paymentMethod": "card",
        "paymentStatus": "pending",
        "status": "assigned",
        "scheduledTime": "2026-02-12T18:00:00Z",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      }
    ],
    "totalOrders": 5
  }
}
```

---

### 7.2 Update Order Status (Agent)
**Endpoint:** `PUT /delivery/orders/{orderId}/status`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "status": "in-transit",
  "location": {
    "lat": 40.7150,
    "lng": -74.0070
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order-456",
    "status": "in-transit",
    "updatedAt": "2026-02-12T17:30:00Z"
  },
  "message": "Order status updated"
}
```

---

### 7.3 Record Payment (Agent)
**Endpoint:** `POST /delivery/orders/{orderId}/payment`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "paymentMethod": "cash",
  "amount": 10.77,
  "transactionId": "txn-789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order-456",
    "paymentStatus": "completed",
    "amount": 10.77,
    "paymentMethod": "cash",
    "timestamp": "2026-02-12T18:00:00Z"
  },
  "message": "Payment recorded successfully"
}
```

---

### 7.4 Get Earnings
**Endpoint:** `GET /delivery/earnings?period=week`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `period` (optional): today, week, month, all (default: all)
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEarning": 350.50,
      "todayEarning": 45.00,
      "totalBonuses": 50.00,
      "pendingAmount": 15.00
    },
    "earnings": [
      {
        "id": "earning-1",
        "orderId": "order-456",
        "orderNumber": "ORD-20260210-001",
        "customerName": "John Doe",
        "deliveryAmount": 35.00,
        "bonus": 5.00,
        "deduction": 0,
        "total": 40.00,
        "status": "completed",
        "date": "2026-02-10T18:00:00Z"
      }
    ]
  }
}
```

---

## 8. Favorites APIs

### 8.1 Get Favorites
**Endpoint:** `GET /favorites`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "fav-1",
        "productId": "1",
        "name": "Fresh Tomatoes",
        "price": 3.99,
        "mrp": 4.99,
        "image": "https://example.com/tomato.jpg",
        "addedAt": "2026-02-10T10:00:00Z"
      }
    ]
  }
}
```

---

### 8.2 Add to Favorites
**Endpoint:** `POST /favorites/add`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "productId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

---

### 8.3 Remove from Favorites
**Endpoint:** `DELETE /favorites/{productId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

---

## 9. Wallet APIs

### 9.1 Get Wallet Balance
**Endpoint:** `GET /wallet`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 500.00,
    "currency": "USD",
    "transactions": [
      {
        "id": "txn-1",
        "type": "credit",
        "amount": 50.00,
        "description": "Refund for order ORD-20260209-001",
        "date": "2026-02-10T10:00:00Z"
      }
    ]
  }
}
```

---

### 9.2 Add to Wallet
**Endpoint:** `POST /wallet/add`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "amount": 100.00,
  "paymentMethod": "card",
  "paymentMethodId": "pm-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 600.00,
    "transactionId": "txn-2"
  },
  "message": "Amount added to wallet"
}
```

---

## 10. Support APIs

### 10.1 Create Support Ticket
**Endpoint:** `POST /support/tickets`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "orderId": "order-456",
  "category": "delivery",
  "subject": "Order not delivered",
  "description": "Order was supposed to arrive by 6 PM but hasn't arrived yet",
  "attachments": ["https://example.com/screenshot.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "support-123",
    "ticketNumber": "TKT-20260210-001",
    "status": "open",
    "createdAt": "2026-02-10T10:00:00Z"
  },
  "message": "Support ticket created"
}
```

---

### 10.2 Get Support Tickets
**Endpoint:** `GET /support/tickets`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "support-123",
        "ticketNumber": "TKT-20260210-001",
        "orderId": "order-456",
        "category": "delivery",
        "subject": "Order not delivered",
        "status": "open",
        "priority": "high",
        "createdAt": "2026-02-10T10:00:00Z",
        "updatedAt": "2026-02-10T10:30:00Z"
      }
    ]
  }
}
```

---

## 11. Settings APIs

### 11.1 Get Settings
**Endpoint:** `GET /settings`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": {
      "orderUpdates": true,
      "promotions": true,
      "newProducts": false
    },
    "privacy": {
      "shareLocation": true,
      "shareActivity": false
    },
    "preferences": {
      "language": "en",
      "currency": "USD",
      "theme": "light"
    }
  }
}
```

---

### 11.2 Update Settings
**Endpoint:** `PUT /settings`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "notifications": {
    "orderUpdates": true,
    "promotions": false,
    "newProducts": true
  },
  "preferences": {
    "language": "es",
    "theme": "dark"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": {
      "orderUpdates": true,
      "promotions": false,
      "newProducts": true
    },
    "preferences": {
      "language": "es",
      "theme": "dark"
    }
  },
  "message": "Settings updated successfully"
}
```

---

## 12. Subscription APIs

Manage product subscriptions for recurring deliveries with automatic discounts.

### 12.1 Get All Subscriptions
**Endpoint:** `GET /subscriptions`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub-001",
      "userId": "user-123",
      "productId": "prod-001",
      "productName": "Fresh Milk (1L)",
      "productImage": "https://example.com/milk.jpg",
      "productUnit": "liter",
      "frequency": "daily",
      "quantity": 2,
      "unitPrice": 65.00,
      "subscriptionDiscount": 5.00,
      "startDate": "2026-02-01",
      "nextDeliveryDate": "2026-02-12",
      "lastDeliveryDate": "2026-02-11",
      "preferredTimeSlot": "morning",
      "status": "active",
      "totalDeliveries": 10,
      "totalAmountSaved": 65.00,
      "createdAt": "2026-02-01T08:00:00Z"
    }
  ]
}
```

---

### 12.2 Get Subscription by ID
**Endpoint:** `GET /subscriptions/{subscriptionId}`

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "sub-001",
    "userId": "user-123",
    "productId": "prod-001",
    "productName": "Fresh Milk (1L)",
    "productImage": "https://example.com/milk.jpg",
    "productUnit": "liter",
    "frequency": "daily",
    "quantity": 2,
    "unitPrice": 65.00,
    "subscriptionDiscount": 5.00,
    "startDate": "2026-02-01",
    "nextDeliveryDate": "2026-02-12",
    "lastDeliveryDate": "2026-02-11",
    "preferredTimeSlot": "morning",
    "status": "active",
    "totalDeliveries": 10,
    "totalAmountSaved": 65.00,
    "createdAt": "2026-02-01T08:00:00Z"
  }
}
```

---

### 12.3 Create Subscription
**Endpoint:** `POST /subscriptions`

**Request:**
```json
{
  "productId": "prod-001",
  "frequency": "daily",
  "quantity": 2,
  "startDate": "2026-02-15",
  "addressId": "addr-001",
  "preferredTimeSlot": "morning"
}
```

**Frequency Options:**
- `daily` - Delivered every day
- `alternate_days` - Every 2nd day
- `weekly` - Once a week
- `bi_weekly` - Every 2 weeks
- `monthly` - Once a month

**Time Slot Options:**
- `morning` - 6:00 AM - 10:00 AM
- `afternoon` - 12:00 PM - 4:00 PM
- `evening` - 5:00 PM - 9:00 PM

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "sub-004",
    "userId": "user-123",
    "productId": "prod-001",
    "productName": "Fresh Milk (1L)",
    "productImage": "https://example.com/milk.jpg",
    "productUnit": "liter",
    "frequency": "daily",
    "quantity": 2,
    "unitPrice": 65.00,
    "subscriptionDiscount": 5.00,
    "startDate": "2026-02-15",
    "nextDeliveryDate": "2026-02-16",
    "preferredTimeSlot": "morning",
    "status": "active",
    "totalDeliveries": 0,
    "totalAmountSaved": 0,
    "createdAt": "2026-02-11T10:30:00Z"
  },
  "message": "Subscription created successfully"
}
```

---

### 12.4 Update Subscription
**Endpoint:** `PUT /subscriptions/{subscriptionId}`

**Request:**
```json
{
  "frequency": "weekly",
  "quantity": 3,
  "preferredTimeSlot": "evening"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "sub-001",
    "frequency": "weekly",
    "quantity": 3,
    "preferredTimeSlot": "evening",
    "nextDeliveryDate": "2026-02-18"
  },
  "message": "Subscription updated successfully"
}
```

---

### 12.5 Pause Subscription
**Endpoint:** `POST /subscriptions/{subscriptionId}/pause`

**Request:**
```json
{
  "pauseUntil": "2026-03-01"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "sub-001",
    "status": "paused",
    "pausedAt": "2026-02-11T14:00:00Z",
    "pausedUntil": "2026-03-01"
  },
  "message": "Subscription paused successfully"
}
```

---

### 12.6 Resume Subscription
**Endpoint:** `POST /subscriptions/{subscriptionId}/resume`

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "sub-001",
    "status": "active",
    "nextDeliveryDate": "2026-02-12"
  },
  "message": "Subscription resumed successfully"
}
```

---

### 12.7 Cancel Subscription
**Endpoint:** `DELETE /subscriptions/{subscriptionId}`

**Request:**
```json
{
  "reason": "Moving to a different location"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully"
}
```

---

### 12.8 Skip Delivery
**Endpoint:** `POST /subscriptions/{subscriptionId}/skip`

**Request:**
```json
{
  "deliveryDate": "2026-02-15",
  "reason": "Out of town"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Delivery on 2026-02-15 has been skipped"
}
```

---

### 12.9 Get Upcoming Deliveries
**Endpoint:** `GET /subscriptions/deliveries/upcoming`

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": "del-001",
      "subscriptionId": "sub-001",
      "productName": "Fresh Milk (1L)",
      "scheduledDate": "2026-02-12",
      "quantity": 2,
      "totalAmount": 123.50,
      "status": "scheduled"
    },
    {
      "id": "del-003",
      "subscriptionId": "sub-002",
      "productName": "Organic Eggs (12 pack)",
      "scheduledDate": "2026-02-15",
      "quantity": 1,
      "totalAmount": 114.00,
      "status": "scheduled"
    }
  ]
}
```

---

### 12.10 Get Delivery History
**Endpoint:** `GET /subscriptions/deliveries/history`

**Query Parameters:**
- `subscriptionId` (optional) - Filter by subscription

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": "del-002",
      "subscriptionId": "sub-001",
      "orderId": "ord-100",
      "scheduledDate": "2026-02-11",
      "actualDeliveryDate": "2026-02-11T09:30:00Z",
      "quantity": 2,
      "unitPrice": 65.00,
      "discountApplied": 6.50,
      "totalAmount": 123.50,
      "status": "delivered"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

---

### 12.11 Get Subscription Summary
**Endpoint:** `GET /subscriptions/summary`

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "activeSubscriptions": 2,
    "pausedSubscriptions": 1,
    "totalSavings": 95.75,
    "totalDeliveries": 17,
    "nextDeliveryDate": "2026-02-12",
    "estimatedMonthlySavings": 285.00
  }
}
```

---

### 12.12 Get Frequency Options
**Endpoint:** `GET /subscriptions/options/frequency`

**Response (Success):**
```json
{
  "success": true,
  "data": [
    { "value": "daily", "label": "Daily", "description": "Delivered every day" },
    { "value": "alternate_days", "label": "Alternate Days", "description": "Every 2nd day" },
    { "value": "weekly", "label": "Weekly", "description": "Once a week" },
    { "value": "bi_weekly", "label": "Bi-Weekly", "description": "Every 2 weeks" },
    { "value": "monthly", "label": "Monthly", "description": "Once a month" }
  ]
}
```

---

### 12.13 Get Time Slot Options
**Endpoint:** `GET /subscriptions/options/timeslots`

**Response (Success):**
```json
{
  "success": true,
  "data": [
    { "value": "morning", "label": "Morning", "time": "6:00 AM - 10:00 AM" },
    { "value": "afternoon", "label": "Afternoon", "time": "12:00 PM - 4:00 PM" },
    { "value": "evening", "label": "Evening", "time": "5:00 PM - 9:00 PM" }
  ]
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "error details"
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Authentication

All protected endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer {jwt_token}
```

---

## Rate Limiting

- Rate limit: 100 requests per minute per user
- Response headers include:
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1676000000`

---

## Pagination

Paginated responses follow this format:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Filtering & Sorting

Use query parameters for filtering:
- `?page=1&limit=20` - Pagination
- `?sort=name&order=asc` - Sorting
- `?search=tomato` - Search
- `?category=vegetables` - Filter by category

---

## Webhook Events

Supported webhook events:
- `order.created`
- `order.updated`
- `order.delivered`
- `payment.completed`
- `delivery.assigned`
- `subscription.created`
- `subscription.paused`
- `subscription.resumed`
- `subscription.cancelled`
- `subscription.delivery.scheduled`
- `subscription.delivery.completed`

---

**Last Updated:** February 11, 2026
