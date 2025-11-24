# BelowMSRP Dealer Panel - Complete API Documentation for Mobile Team

## Table of Contents
1. [Authentication](#authentication)
2. [All Offers Page API](#all-offers-page-api)
3. [Offers Page (Tabbed View) API](#offers-page-tabbed-view-api)
4. [Countered Page API](#countered-page-api)
5. [Accepted Page API](#accepted-page-api)
6. [Rejected Page API](#rejected-page-api)
7. [Action APIs](#action-apis)
8. [Button Display Logic](#button-display-logic)
9. [Status Tags Logic](#status-tags-logic)
10. [Complete Scenarios](#complete-scenarios)

---

## Authentication

All API requests require authentication headers:

```javascript
Headers: {
  "authtoken": "<JWT_TOKEN_FROM_LOGIN>",
  "Content-Type": "application/json"
}
```

Get dealer ID from localStorage after login:
```javascript
const dealerId = JSON.parse(localStorage.getItem("auth")).user._id;
```

---

## All Offers Page API

### Endpoint
```
GET /bid/all-bid
```

### Request
No parameters required. Returns all bids submitted by users.

### Response Structure
```json
{
  "success": true,
  "data": [
    {
      "_id": "bid123456",
      "carImage": "https://example.com/car.jpg",
      "carName": "BMW 3 Series",
      "carMaker": "BMW",
      "carMsrp": 45000,
      "carBid": 42000,
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "userComments": "Looking for a good deal",
      "userId": {
        "_id": "user123",
        "softPullReport": {
          "reportData": {
            "intelligence": {
              "name": "Good"
            }
          }
        },
        "kbbValue": {
          "decodedVehicle": {
            "make": "Honda",
            "model": "Civic",
            "year": "2018"
          },
          "request": {
            "vin": "1HGBH41JXMN109186",
            "mileage": "45000"
          },
          "kbbValues": {
            "goodCondition": {
              "tradeIn": {
                "lowRange": 15000,
                "highRange": 17000
              }
            }
          }
        }
      },
      "carId": "car789",
      "variants": [
        {
          "typeSubCategory": "Premium Package",
          "price": "2500"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Keys Used in UI

**Vehicle Information:**
- `_id` → `bidId` (Unique bid identifier)
- `carImage` → Vehicle image
- `carName` → Vehicle model name
- `carMaker` → Vehicle brand
- `carMsrp` → MSRP price (formatted as `$45,000.00`)

**Customer Information:**
- `userName` → Customer name (formatted as "John D.")
- `userEmail` → Customer email
- `userId._id` → User identifier
- `userId.softPullReport.reportData.intelligence.name` → Credit score tier

**Offer Information:**
- `carBid` → User's offer amount
- `userComments` → Customer comments
- `variants` → Selected car options

**Trade-in Information (from userId.kbbValue):**
- `decodedVehicle.make` → Trade-in vehicle make
- `decodedVehicle.model` → Trade-in vehicle model
- `decodedVehicle.year` → Trade-in vehicle year
- `request.vin` → Trade-in VIN
- `request.mileage` → Trade-in mileage
- `kbbValues.goodCondition.tradeIn.lowRange` → Trade-in value low
- `kbbValues.goodCondition.tradeIn.highRange` → Trade-in value high

**Keys NOT Used:**
- `userId.softPullReport` (except for credit score)
- Internal timestamps
- Dealer-specific fields

### Data Transformation
```javascript
// Format customer name
const formatName = (fullName) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }
  return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
};

// Format price
const formatPrice = (amount) => `$${Number(amount || 0).toLocaleString()}.00`;

// Format credit score
const creditScore = userId?.softPullReport?.reportData?.intelligence?.name || 'Not Available';
```

### Buttons Shown on All Offers Page
- ✅ **Accept** (Green check icon) - Always enabled
- 🔄 **Counter** (Equal sign icon) - Always enabled
- ❌ **Reject** (Red cross icon) - Always enabled
- 📄 **PDF Preview** (Download icon) - Always enabled

**Button States:**
- All buttons disabled when Accept or Reject is in progress
- Loading spinner shown on button being clicked
- Counter button opens modal

---

## Offers Page (Tabbed View) API

This page has 4 tabs: All Offers, Accepted, Rejected, Countered

### Tab 1: All Offers
**Same as All Offers Page above**

### Tab 2: Accepted Offers

#### Endpoint
```
GET /bid/get-dealer-bid/accept/{dealerId}
```

#### Response Structure
```json
{
  "success": true,
  "data": [
    {
      "id": "car789",
      "image": "https://example.com/car.jpg",
      "carname": "BMW 3 Series",
      "msrp": 45000,
      "latestUserOffer": 42000,
      "latestUserComments": "Looking for a good deal",
      "status": "Accepted by dealer",
      "customerDetails": {
        "userId": "user123",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890"
      },
      "negotiationHistory": [
        {
          "type": "user_offer",
          "bidId": "bid123456",
          "amount": 42000,
          "timestamp": "2024-01-15T10:30:00Z"
        },
        {
          "type": "dealer_action",
          "action": "accept",
          "timestamp": "2024-01-15T11:00:00Z"
        }
      ],
      "userVariants": []
    }
  ]
}
```

#### Keys Used in UI
- `id` → `carId`
- `image` → Vehicle image
- `carname` → Vehicle model
- `msrp` → MSRP price
- `latestUserOffer` → User's offer
- `latestUserComments` → Comments
- `status` → Offer status
- `customerDetails.userId` → User ID
- `customerDetails.fullName` → Customer name
- `customerDetails.email` → Customer email
- `customerDetails.phoneNumber` → Customer phone
- `negotiationHistory[].bidId` → Bid ID (from first user_offer)

#### Buttons Shown
- 📄 **PDF Preview only** - No action buttons

### Tab 3: Rejected Offers

#### Endpoint
```
GET /bid/get-dealer-bid/reject/{dealerId}
```

#### Response Structure
Same as Accepted, but `status` contains "Rejected"

#### Keys Used
Same as Accepted tab

#### Buttons Shown
- **No action buttons** - Read-only view

### Tab 4: Countered Offers

#### Endpoint
```
GET /bid/get-dealer-bid/counter/{dealerId}
```

#### Response Structure
```json
{
  "success": true,
  "data": [
    {
      "id": "car789",
      "image": "https://example.com/car.jpg",
      "carname": "BMW 3 Series",
      "msrp": 45000,
      "latestUserOffer": 42000,
      "latestDealerOffer": 43500,
      "latestUserComments": "Looking for a good deal",
      "latestDealerComments": "Best we can do",
      "status": "Countered by user",
      "customerDetails": {
        "userId": "user123",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890"
      },
      "negotiationHistory": [
        {
          "type": "user_offer",
          "bidId": "bid123456",
          "amount": 42000,
          "timestamp": "2024-01-15T10:30:00Z"
        },
        {
          "type": "dealer_action",
          "action": "counter",
          "amount": 43500,
          "timestamp": "2024-01-15T11:00:00Z"
        },
        {
          "type": "user_action",
          "action": "counter",
          "amount": 43000,
          "timestamp": "2024-01-15T12:00:00Z"
        }
      ]
    }
  ]
}
```

#### Additional Keys for Countered
- `latestDealerOffer` → Dealer's counter offer
- `latestDealerComments` → Dealer's comments
- `negotiationHistory` → Full negotiation timeline

---

## Countered Page API

### Endpoint
```
GET /bid/get-dealer-bid/counter/{dealerId}
```

### Response
Same as Countered tab above

### Keys Used in UI

**All keys from response PLUS:**
- `dealerAction` → Derived from `negotiationHistory` (last dealer action)
- `userAction` → Derived from `negotiationHistory` (last user action)

### Deriving dealerAction
```javascript
function deriveDealerActionFromHistory(history = []) {
  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const lastDealer = [...sorted].reverse().find((e) => e.type === "dealer_action");
  return lastDealer?.action || ""; // Returns: "counter", "accept", "reject"
}
```

### Status Tags on Countered Page

**Tag 1: "Deal Accepted" (Green)**
```javascript
Condition: status.includes("accept") OR userAction.includes("accept")
Display: Green background (#10B981), green text
```

**Tag 2: "Deal Rejected" (Red)**
```javascript
Condition: status.includes("reject") OR userAction.includes("reject")
Display: Red background (#EF4444), red text
```

**Tag 3: "User Countered - Action Required" (Blue)**
```javascript
Condition: dealerAction === "user-counter"
Display: Blue background (#3B82F6), blue text
```

**Tag 4: "Waiting for User Response" (Yellow)**
```javascript
Condition: dealerAction === "counter"
Display: Yellow background (#F59E0B), yellow text
```

### Buttons on Countered Page

**Scenario 1: User Countered - Action Required**
```javascript
Condition: dealerAction === "user-counter" && !isAccepted && !isRejected
Buttons Shown:
- ✅ Accept (Green) - acceptUserCounter()
- ❌ Reject (Red) - rejectUserCounter()
- 🔄 Counter (Blue) - openCounterModal()
- 📄 PDF Preview (Blue) - previewPdf()
```

**Scenario 2: Deal Accepted**
```javascript
Condition: isOfferAccepted(offer) === true
Display: "Deal Closed" text (green)
Buttons: None (except PDF preview)
```

**Scenario 3: Deal Rejected**
```javascript
Condition: isOfferRejected(offer) === true
Display: "Deal Closed" text (red)
Buttons: None (except PDF preview)
```

**Scenario 4: Waiting for User**
```javascript
Condition: dealerAction === "counter"
Display: "Waiting for user response" text (gray)
Buttons: PDF Preview only
```

---

## Action APIs

### 1. Accept Offer

#### Endpoint
```
POST /bid/dealer-bid-action
```

#### Request Payload
```json
{
  "userId": "user123",
  "dealerId": "dealer456",
  "carId": "car789",
  "bidId": "bid123456",
  "dealerAction": "accept"
}
```

#### Response
```json
{
  "success": true,
  "message": "Bid accepted successfully"
}
```

#### When to Call
- User clicks Accept button on any offer
- All required IDs must be present

#### Validation
```javascript
if (!offer?.userId || !offer?.carId || !offer?.bidId) {
  // Show error: "Cannot accept: required identifiers are missing."
  return;
}
```

### 2. Reject Offer

#### Endpoint
```
POST /bid/dealer-bid-action
```

#### Request Payload
```json
{
  "userId": "user123",
  "dealerId": "dealer456",
  "carId": "car789",
  "bidId": "bid123456",
  "dealerAction": "reject"
}
```

#### Response
```json
{
  "success": true,
  "message": "Bid rejected successfully"
}
```

### 3. Counter Offer

#### Endpoint
```
POST /bid/dealer-bid-counter
```

#### Request Format
**Content-Type:** `multipart/form-data`

#### Request Payload (FormData)
```javascript
const formData = new FormData();
formData.append("userId", "user123");
formData.append("userEmail", "john@example.com");
formData.append("dealerId", "dealer456");
formData.append("dealerName", "ABC Motors");
formData.append("dealerEmail", "dealer@example.com");
formData.append("carId", "car789");
formData.append("bidId", "bid123456");
formData.append("dealerAction", "counter");
formData.append("counterBid", "43500");
formData.append("dealerMsrp", "45000");
formData.append("tradeInOffer", "16000"); // Optional
formData.append("dealerComments", "Best we can do");
formData.append("userDetails", JSON.stringify(dealerUserObject));
formData.append("options", "[]");
// Optional files
formData.append("file0", fileObject1);
formData.append("file1", fileObject2);
```

#### Response
```json
{
  "success": true,
  "message": "Counter offer sent successfully"
}
```

#### Required Fields
- `userId` ✅
- `dealerId` ✅
- `carId` ✅
- `bidId` ✅
- `counterBid` ✅
- `dealerMsrp` ✅

#### Optional Fields
- `tradeInOffer`
- `dealerComments`
- `file0`, `file1`, etc. (PDF or images)

### 4. Credit Score Lookup

#### Why We Call This API
Credit scores are NOT included in the main offers API responses. They are stored separately and must be fetched independently. We call this API to:
1. Display credit score information for each customer
2. Help dealers assess customer creditworthiness
3. Make informed decisions about accepting/rejecting offers

#### Where Credit Scores Are Displayed
Credit scores appear in the **Customer Information** section on:
- ✅ All Offers Page
- ✅ Offers Page (all tabs)
- ✅ Countered Page
- ✅ Accepted Page
- ✅ Rejected Page

**Display Format:**
```
Customer Info:
Name: John D.
Credit Score: Good  ← This value comes from credit score API
Email: john@example.com
```

#### Endpoint
```
POST /credit-score/multiple-credit-scores
```

#### When to Call
**IMPORTANT:** Call this API AFTER fetching the offers list, not before.

**Timing:**
1. First: Fetch offers from main API
2. Second: Extract all userIds from offers
3. Third: Call credit score API with all userIds
4. Fourth: Map credit scores to offers

#### How to Get UserIds

**Different APIs Return UserIds Differently:**

**For `/bid/all-bid` (All Offers):**
```javascript
// userId is directly in the response
const userIds = apiResponse
  .map((item) => {
    // Handle both string and object formats
    if (typeof item.userId === 'string') {
      return item.userId;
    }
    if (typeof item.userId === 'object' && item.userId?._id) {
      return String(item.userId._id);
    }
    return null;
  })
  .filter((id) => id !== null)  // Remove nulls
  .map((id) => String(id));      // Ensure all are strings
```

**For `/bid/get-dealer-bid/*` (Accepted/Rejected/Countered):**
```javascript
// userId is nested in customerDetails
const userIds = apiResponse
  .map((item) => {
    const userId = item.customerDetails?.userId;
    if (!userId) return null;
    
    // Handle both string and object formats
    if (typeof userId === 'string') {
      return userId;
    }
    if (typeof userId === 'object' && userId._id) {
      return String(userId._id);
    }
    return null;
  })
  .filter((id) => id !== null)  // Remove nulls
  .map((id) => String(id));      // Ensure all are strings
```

**Remove Duplicates:**
```javascript
// If same user has multiple offers, only include userId once
const uniqueUserIds = [...new Set(userIds)];
```

#### Complete Implementation Example

```javascript
// Step 1: Fetch offers
const offersResponse = await fetch('/bid/all-bid');
const offers = offersResponse.data;

// Step 2: Extract userIds
const userIds = offers
  .map((item) => {
    // For /bid/all-bid
    if (item.userId) {
      return typeof item.userId === 'string' 
        ? item.userId 
        : item.userId._id;
    }
    // For /bid/get-dealer-bid/*
    if (item.customerDetails?.userId) {
      const userId = item.customerDetails.userId;
      return typeof userId === 'string' 
        ? userId 
        : userId._id;
    }
    return null;
  })
  .filter(id => id !== null)
  .map(id => String(id));

// Step 3: Remove duplicates
const uniqueUserIds = [...new Set(userIds)];

// Step 4: Fetch credit scores (only if we have userIds)
let creditScores = {};
if (uniqueUserIds.length > 0) {
  try {
    const creditResponse = await fetch('/credit-score/multiple-credit-scores', {
      method: 'POST',
      body: JSON.stringify({ userIds: uniqueUserIds })
    });
    creditScores = creditResponse.data;
  } catch (error) {
    console.error('Error fetching credit scores:', error);
    // Continue without credit scores
  }
}

// Step 5: Map credit scores to offers
const offersWithCreditScores = offers.map((offer) => {
  const userId = normalizeUserId(offer);
  const creditScore = creditScores[userId] || {
    hasCreditScore: false,
    creditScoreTier: null
  };
  
  return {
    ...offer,
    customer: {
      ...offer.customer,
      creditScore: creditScore.hasCreditScore 
        ? creditScore.creditScoreTier 
        : "Not Available"
    }
  };
});
```

#### Request Payload
```json
{
  "userIds": ["user123", "user456", "user789"]
}
```

**Payload Requirements:**
- Must be an array of strings
- Each string must be a valid user ID
- Duplicates are handled by the API (but better to remove them client-side)
- Empty array returns empty object

#### Response
```json
{
  "success": true,
  "data": {
    "user123": {
      "hasCreditScore": true,
      "creditScoreTier": "Good"
    },
    "user456": {
      "hasCreditScore": false,
      "creditScoreTier": null
    },
    "user789": {
      "hasCreditScore": true,
      "creditScoreTier": "Excellent"
    }
  }
}
```

#### Response Keys Explained

**`hasCreditScore` (boolean):**
- `true` = User has completed credit check
- `false` = User has NOT completed credit check

**`creditScoreTier` (string | null):**
Possible values when `hasCreditScore` is `true`:
- `"Excellent"` - 750+
- `"Good"` - 700-749
- `"Fair"` - 650-699
- `"Poor"` - Below 650

Value when `hasCreditScore` is `false`:
- `null`

#### Displaying Credit Scores

```javascript
function displayCreditScore(creditScore) {
  if (!creditScore || !creditScore.hasCreditScore) {
    return "Not Available";
  }
  return creditScore.creditScoreTier; // "Excellent", "Good", "Fair", or "Poor"
}
```

#### Error Handling

**If Credit Score API Fails:**
```javascript
// Don't block the UI - continue without credit scores
let creditScores = {};
try {
  creditScores = await fetchCreditScores(userIds);
} catch (error) {
  console.error('Credit score fetch failed:', error);
  // creditScores remains empty object
}

// All offers will show "Not Available" for credit score
```

**If User Not Found in Response:**
```javascript
const userCreditScore = creditScores[userId] || {
  hasCreditScore: false,
  creditScoreTier: null
};
// Display: "Not Available"
```

#### Performance Optimization

**✅ DO:**
- Batch all userIds in one API call
- Call once per page load
- Cache results if navigating between tabs
- Remove duplicate userIds before calling

**❌ DON'T:**
- Call for each offer individually (N+1 problem)
- Call multiple times for same page
- Block UI if credit score API fails
- Call if userIds array is empty

#### Example: All Offers Page Flow

```javascript
async function loadAllOffers() {
  // 1. Fetch offers
  const response = await apiGet('/bid/all-bid');
  const rawOffers = response.data;
  
  // 2. Extract userIds
  const userIds = rawOffers
    .map(item => normalizeId(item.userId))
    .filter(id => id)
    .map(id => String(id));
  
  // 3. Remove duplicates
  const uniqueUserIds = [...new Set(userIds)];
  
  // 4. Fetch credit scores (batch)
  let creditScores = {};
  if (uniqueUserIds.length > 0) {
    creditScores = await getMultipleUserCreditScores(uniqueUserIds);
  }
  
  // 5. Map offers with credit scores
  const offers = rawOffers.map(item => {
    const userId = normalizeId(item.userId);
    const creditScore = creditScores[userId] || {
      hasCreditScore: false,
      creditScoreTier: null
    };
    
    return {
      bidId: item._id,
      model: item.carName,
      customer: {
        name: formatName(item.userName),
        email: item.userEmail,
        creditScore: creditScore.hasCreditScore 
          ? creditScore.creditScoreTier 
          : "Not Available"
      },
      // ... other fields
    };
  });
  
  return offers;
}
```

#### Alternative: Single User Credit Score

**Endpoint:**
```
GET /credit-score/user-credit-score
```

**When to Use:**
- Getting credit score for logged-in user (not for offers)
- Single user lookup (not recommended for offers list)

**For offers, ALWAYS use the batch endpoint** (`/credit-score/multiple-credit-scores`)

### 5. PDF Preview

#### Endpoint
```
GET /bid/user-bid/{bidId}/pdf
```

#### Response
Binary PDF blob

#### Usage
```javascript
const blob = await fetch(`/bid/user-bid/${bidId}/pdf`, {
  headers: { authtoken: token }
}).then(r => r.blob());

const url = URL.createObjectURL(blob);
// Display in iframe or new tab
```

---

## Button Display Logic

### All Offers Page & Offers Tab (All Offers)

```javascript
// All buttons always visible
<button @click="acceptBid(offer)" :disabled="isAccepting || isRejecting">
  Accept
</button>
<button @click="openCounterModal(offer)">
  Counter
</button>
<button @click="rejectBid(offer)" :disabled="isAccepting || isRejecting">
  Reject
</button>
<button @click="previewPdf(offer)">
  PDF
</button>
```

**Disabled Conditions:**
- Accept button: `isAccepting(offer) || isRejecting(offer)`
- Reject button: `isAccepting(offer) || isRejecting(offer)`
- Counter button: Never disabled
- PDF button: Never disabled

### Countered Page

```javascript
// Scenario 1: User countered - show all action buttons
if (offer.dealerAction === 'user-counter' && !isAccepted && !isRejected) {
  // Show: Accept, Reject, Counter, PDF buttons
}

// Scenario 2: Deal accepted
else if (isOfferAccepted(offer)) {
  // Show: "Deal Closed" text only (+ PDF)
}

// Scenario 3: Deal rejected
else if (isOfferRejected(offer)) {
  // Show: "Deal Closed" text only (+ PDF)
}

// Scenario 4: Waiting for user
else if (offer.dealerAction === 'counter') {
  // Show: "Waiting for user response" text (+ PDF)
}
```

### Accepted Page
```javascript
// Only PDF preview button
<button @click="previewPdf(offer)">
  PDF
</button>
```

### Rejected Page
```javascript
// No action buttons at all
```

---

## Status Tags Logic

### Helper Functions

```javascript
function isOfferAccepted(offer) {
  const status = (offer?.status || "").toLowerCase();
  const userAction = (offer?.userAction || "").toLowerCase();
  return status.includes("accept") || userAction.includes("accept");
}

function isOfferRejected(offer) {
  const status = (offer?.status || "").toLowerCase();
  const userAction = (offer?.userAction || "").toLowerCase();
  return status.includes("reject") || userAction.includes("reject");
}
```

### Tag Display Priority (Countered Page)

**Priority 1: Accepted** (Highest)
```javascript
if (isOfferAccepted(offer)) {
  return "Deal Accepted"; // Green badge
}
```

**Priority 2: Rejected**
```javascript
else if (isOfferRejected(offer)) {
  return "Deal Rejected"; // Red badge
}
```

**Priority 3: User Countered**
```javascript
else if (offer.dealerAction === 'user-counter') {
  return "User Countered - Action Required"; // Blue badge
}
```

**Priority 4: Dealer Countered**
```javascript
else if (offer.dealerAction === 'counter') {
  return "Waiting for User Response"; // Yellow badge
}
```

---

## Complete Scenarios

### Scenario 1: Fresh Offer (All Offers Page)

**API Response:**
```json
{
  "_id": "bid123",
  "carName": "BMW 3 Series",
  "carMsrp": 45000,
  "carBid": 42000,
  "userName": "John Doe",
  "userComments": "Need this car ASAP"
}
```

**UI Display:**
- Vehicle: BMW 3 Series
- MSRP: $45,000.00
- User Offer: $42,000
- Customer: John D.
- Comments: "Need this car ASAP"

**Buttons:**
- ✅ Accept (enabled)
- 🔄 Counter (enabled)
- ❌ Reject (enabled)
- 📄 PDF (enabled)

**Status Tags:** None

---

### Scenario 2: Dealer Accepts Offer

**User Action:** Clicks Accept button

**API Call:**
```javascript
POST /bid/dealer-bid-action
{
  "userId": "user123",
  "dealerId": "dealer456",
  "carId": "car789",
  "bidId": "bid123",
  "dealerAction": "accept"
}
```

**Result:**
- Offer moves to "Accepted" tab
- No longer appears in "All Offers"
- Only PDF button visible
- Status: "Accepted"

---

### Scenario 3: Dealer Counters Offer

**User Action:** Clicks Counter button, fills modal

**Modal Fields:**
- Counter Bid: 43500 (required)
- Dealer's Car MSRP: 45000 (required)
- Trade-in Offer: 16000 (optional)
- Comments: "Best we can do" (optional)
- Attachments: file.pdf (optional)

**API Call:**
```javascript
POST /bid/dealer-bid-counter
FormData {
  userId: "user123",
  dealerId: "dealer456",
  carId: "car789",
  bidId: "bid123",
  dealerAction: "counter",
  counterBid: "43500",
  dealerMsrp: "45000",
  tradeInOffer: "16000",
  dealerComments: "Best we can do",
  file0: <File>
}
```

**Result:**
- Offer moves to "Countered" tab
- Status Tag: "Waiting for User Response" (yellow)
- Buttons: PDF only
- Dealer cannot take action until user responds

---

### Scenario 4: User Counters Back

**Backend Update:** User submits new counter

**API Response (Countered endpoint):**
```json
{
  "id": "car789",
  "latestUserOffer": 43000,
  "latestDealerOffer": 43500,
  "status": "Countered by user",
  "negotiationHistory": [
    { "type": "user_offer", "amount": 42000 },
    { "type": "dealer_action", "action": "counter", "amount": 43500 },
    { "type": "user_action", "action": "counter", "amount": 43000 }
  ]
}
```

**UI Display:**
- User Offer: $43,000
- Counter Offer: $43,500
- Status Tag: "User Countered - Action Required" (blue)

**Buttons:**
- ✅ Accept (enabled) - Accept user's $43,000
- ❌ Reject (enabled) - Reject negotiation
- 🔄 Counter (enabled) - Counter again
- 📄 PDF (enabled)

---

### Scenario 5: Dealer Accepts User Counter

**User Action:** Clicks Accept on countered offer

**API Call:**
```javascript
POST /bid/dealer-bid-action
{
  "dealerId": "dealer456",
  "carId": "car789",
  "bidId": "bid123",
  "userId": "user123",
  "dealerAction": "accept"
}
```

**Result:**
- Status Tag: "Deal Accepted" (green)
- Display: "Deal Closed"
- Buttons: None (except PDF)
- Final price: $43,000 (user's counter)

---

### Scenario 6: Dealer Rejects Offer

**User Action:** Clicks Reject button

**API Call:**
```javascript
POST /bid/dealer-bid-action
{
  "userId": "user123",
  "dealerId": "dealer456",
  "carId": "car789",
  "bidId": "bid123",
  "dealerAction": "reject"
}
```

**Result:**
- Offer moves to "Rejected" tab
- Status: "Rejected"
- No action buttons
- Read-only view

---

### Scenario 7: Multiple Counter Rounds

**Round 1:**
- User offers: $42,000
- Dealer counters: $43,500
- Status: "Waiting for User Response"

**Round 2:**
- User counters: $43,000
- Status: "User Countered - Action Required"
- Dealer counters: $43,250
- Status: "Waiting for User Response"

**Round 3:**
- User accepts: $43,250
- Status: "Deal Accepted"
- Final: Deal closed at $43,250

**negotiationHistory:**
```json
[
  { "type": "user_offer", "amount": 42000, "timestamp": "2024-01-15T10:00:00Z" },
  { "type": "dealer_action", "action": "counter", "amount": 43500, "timestamp": "2024-01-15T11:00:00Z" },
  { "type": "user_action", "action": "counter", "amount": 43000, "timestamp": "2024-01-15T12:00:00Z" },
  { "type": "dealer_action", "action": "counter", "amount": 43250, "timestamp": "2024-01-15T13:00:00Z" },
  { "type": "user_action", "action": "accept", "timestamp": "2024-01-15T14:00:00Z" }
]
```

---

## Error Handling

### Missing Required Fields
```javascript
if (!offer?.userId || !offer?.carId || !offer?.bidId) {
  // Show alert: "Cannot proceed: required identifiers are missing."
  return;
}
```

### API Error Response
```json
{
  "success": false,
  "data": {
    "message": "Invalid bid ID"
  }
}
```

### Credit Score Unavailable
```javascript
{
  "hasCreditScore": false,
  "creditScoreTier": null
}
// Display: "Not Available"
```

### Trade-in Data Missing
```javascript
// If kpiData is null or missing
Vehicle: "N/A"
VIN: "N/A"
Mileage: "N/A"
Price Range: "N/A"
```

---

## Key Takeaways for Mobile Team

1. **Two Different API Structures:**
   - `/bid/all-bid` returns flat structure with `_id`, `carName`, `userName`
   - `/bid/get-dealer-bid/*` returns nested structure with `id`, `carname`, `customerDetails`

2. **ID Normalization Required:**
   - Always normalize IDs before API calls
   - Handle both string and object formats
   - Extract `_id` from objects when needed

3. **Credit Scores:**
   - Fetch separately using `/credit-score/multiple-credit-scores`
   - Batch request for all users at once
   - Handle missing scores gracefully

4. **Button States:**
   - Disable Accept/Reject during processing
   - Show loading spinners
   - Never disable Counter or PDF buttons

5. **Status Tags:**
   - Check in priority order: Accepted > Rejected > User Counter > Dealer Counter
   - Use both `status` and `userAction` fields
   - Derive `dealerAction` from `negotiationHistory`

6. **Counter Offers:**
   - Use FormData for file uploads
   - Multiple files supported (`file0`, `file1`, etc.)
   - Required: counterBid, dealerMsrp
   - Optional: tradeInOffer, comments, files

7. **Refresh After Actions:**
   - Always refresh offers list after Accept/Reject/Counter
   - Update UI immediately
   - Remove from current view if moved to different tab

---

## Testing Checklist

- [ ] Fresh offer displays correctly
- [ ] Accept button works and moves offer to Accepted tab
- [ ] Reject button works and moves offer to Rejected tab
- [ ] Counter modal opens and submits correctly
- [ ] User counter shows "Action Required" tag
- [ ] Dealer counter shows "Waiting for User" tag
- [ ] Accepted offers show "Deal Closed"
- [ ] Rejected offers show "Deal Closed"
- [ ] PDF preview works
- [ ] Credit scores display correctly
- [ ] Trade-in data displays or shows "N/A"
- [ ] Loading states show during actions
- [ ] Buttons disable during processing
- [ ] Error messages display for missing data
- [ ] Multiple counter rounds work correctly

---

This documentation provides complete API details, all scenarios, and exact implementation logic for the mobile team to replicate the dealer panel functionality.
