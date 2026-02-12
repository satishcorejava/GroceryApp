# API Integration Guide - Cornucopia Grocery App

## Overview

The app now has a complete API service layer that can be connected to a backend server. The API service supports all major operations including authentication, products, cart, orders, addresses, and more.

## Setup

### 1. Configure API Base URL

Edit `src/app/services/api.ts` and set your backend URL:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
```

Then create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### 2. Authentication Token Storage

The app automatically stores the JWT token in `localStorage` under the key `auth-token` after login. Update the `useAuth` hook to pass passwords properly.

## API Endpoints Overview

The app supports the following endpoint categories:

### Authentication (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/signup` - User signup
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update user profile

### Products (`/products`)
- `GET /products` - List all products (with pagination and filtering)
- `GET /products/:id` - Get product details
- `GET /products/categories` - List categories
- `GET /products/subcategories` - List subcategories

### Cart (`/cart`)
- `GET /cart` - Get current cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:productId` - Update item quantity
- `DELETE /cart/items/:productId` - Remove item from cart
- `DELETE /cart` - Clear entire cart

### Orders (`/orders`)
- `POST /orders` - Create new order
- `GET /orders` - List user orders
- `GET /orders/:id` - Get order details
- `POST /orders/:id/cancel` - Cancel order
- `GET /orders/:id/track` - Track order status

### Addresses (`/addresses`)
- `GET /addresses` - Get all addresses
- `POST /addresses` - Create new address
- `PUT /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address
- `POST /addresses/:id/default` - Set as default

### Payment Methods (`/payment-methods`)
- `GET /payment-methods` - List payment methods
- `POST /payment-methods` - Add payment method
- `PUT /payment-methods/:id` - Update payment method
- `DELETE /payment-methods/:id` - Delete payment method
- `POST /payment-methods/:id/default` - Set as default

### Wallet (`/wallet`)
- `GET /wallet` - Get wallet info
- `POST /wallet/add-money` - Add funds to wallet
- `GET /wallet/transactions` - Get transaction history

### Locations (`/locations`)
- `GET /locations/search?q=query` - Search locations
- `GET /locations/validate?lat=X&lng=Y` - Validate delivery location
- `GET /locations/zones` - Get delivery zones

### Support (`/support`)
- `GET /support/faq` - Get FAQs
- `POST /support/issues` - Submit support ticket
- `GET /support/issues` - Get user's issues
- `GET /support/issues/:id` - Get issue details

### Search (`/search`)
- `GET /search?q=query` - Search products
- `GET /search/trending` - Get trending products

## Using the Hooks

### useAuth Hook

```typescript
import { useAuth } from "@/app/hooks/useAuth";

function MyComponent() {
  const { user, isLoading, error, login, signup, logout, updateProfile } = useAuth();

  // Login with email
  const handleLogin = async () => {
    try {
      await login("user@example.com", "", "John Doe", "password123");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Signup
  const handleSignup = async () => {
    try {
      await signup("user@example.com", "", "John Doe", "password123", "password123");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name: "Jane Doe" });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user.isLoggedIn && <p>Welcome, {user.name}!</p>}
    </div>
  );
}
```

### useCart Hook

```typescript
import { useCart } from "@/app/hooks/useCart";

function CartComponent() {
  const { cartItems, isLoading, error, addToCart, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();

  const handleAddToCart = async () => {
    await addToCart(product, 1);
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    await updateQuantity(productId, newQuantity);
  };

  const handleCheckout = async () => {
    await clearCart(); // Clears after order is placed
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div>Total: ${getTotal().toFixed(2)}</div>
    </div>
  );
}
```

### useOrders Hook

```typescript
import { useOrders, useCreateOrder } from "@/app/hooks/useOrders";

function OrdersComponent() {
  const { orders, isLoading, fetchOrders } = useOrders();
  const { createOrder, isLoading: creatingOrder } = useCreateOrder();

  const handleCreateOrder = async () => {
    const order = await createOrder({
      items: [{ productId: "1", quantity: 2 }],
      addressId: "address-1",
      paymentMethodId: "payment-1",
    });
    
    if (order) {
      console.log("Order created:", order);
    }
  };

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>{order.orderNumber}</div>
      ))}
    </div>
  );
}
```

### useAddresses Hook

```typescript
import { useAddresses } from "@/app/hooks/useAddresses";

function AddressesComponent() {
  const { addresses, isLoading, error, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();

  const handleAddAddress = async () => {
    await addAddress({
      label: "Home",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      isDefault: false,
    });
  };

  return (
    <div>
      {addresses.map(addr => (
        <div key={addr.id}>
          {addr.label}: {addr.street}
          <button onClick={() => setDefaultAddress(addr.id)}>Set Default</button>
          <button onClick={() => deleteAddress(addr.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### useProducts Hooks

```typescript
import { useProducts, useProductDetail } from "@/app/hooks/useProducts";

function ProductsComponent() {
  const { products, isLoading, error, total } = useProducts({
    category: "vegetables",
    search: "tomato",
    page: 1,
    limit: 20,
  });

  const { product, isLoading: detailLoading } = useProductDetail("product-1");

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
      {product && <h2>{product.name}</h2>}
    </div>
  );
}
```

## Error Handling

All hooks return an `error` state that contains error messages:

```typescript
const { error } = useAuth();

if (error) {
  toast.error(error); // Show user-friendly error
}
```

## Offline Support

The app has offline fallback support:
1. All hooks check for valid authentication token first
2. If API calls fail, data from `localStorage` is used
3. Operations are queued locally and synced when connection is restored

## Backend Implementation Checklist

When implementing the backend, ensure:

- [ ] All endpoints return proper error messages
- [ ] JWT tokens are returned on successful login/signup
- [ ] Proper CORS headers are set for the frontend domain
- [ ] Authentication middleware validates Bearer tokens
- [ ] Rate limiting is implemented
- [ ] Input validation is strict
- [ ] Sensitive data (passwords, tokens) are never logged
- [ ] All endpoints require authentication except `/auth/login` and `/auth/signup`
- [ ] File uploads for avatars/photos are supported
- [ ] Database relationships are properly set up (users -> carts -> orders, etc.)

## Common Issues

### 1. CORS Errors
Make sure your backend sets proper CORS headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 2. 401 Unauthorized
Ensure the token is being sent correctly:
- Check that token is stored in `localStorage` under `auth-token` key
- Verify the Authorization header format: `Bearer <token>`

### 3. Lost Cart/Addresses After Logout
This is expected behavior. Implement a cart persistence API endpoint that stores carts per user.

## Testing with Postman

You can test the endpoints using Postman:

1. Set base URL to your backend
2. For authenticated endpoints, add header: `Authorization: Bearer {your-token}`
3. For POST/PUT requests, set Content-Type to `application/json`

## Next Steps

1. Implement your Node.js/Express backend with these endpoints
2. Connect a database (MongoDB, PostgreSQL, etc.)
3. Add email verification for signup
4. Implement payment gateway integration
5. Add real-time order notifications
6. Set up push notifications for delivery updates
