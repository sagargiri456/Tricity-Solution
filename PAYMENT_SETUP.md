# Payment Integration Setup

## Razorpay Configuration

To enable payment functionality, you need to set up Razorpay:

### 1. Get Razorpay Credentials
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from the dashboard
3. Add them to your environment variables

### 2. Environment Variables

Add these to your `.env` file in the root directory:

```env
# Frontend
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here

# Backend (if you want to verify payments)
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 3. Payment Flow

1. User fills booking form
2. Clicks "Pay and Book" button
3. Razorpay payment modal opens
4. User completes payment
5. Booking is created with payment confirmation
6. Confirmation emails are sent

### 4. Testing

For testing, use Razorpay's test mode:
- Use test API keys
- Use test card numbers: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

### 5. Production

For production:
1. Switch to live API keys
2. Complete Razorpay KYC
3. Update webhook URLs
4. Test with real payments

## Features Added

- ✅ Payment gateway integration
- ✅ "Pay and Book" button
- ✅ Payment amount display
- ✅ Payment status in emails
- ✅ Secure payment processing
- ✅ Payment confirmation
