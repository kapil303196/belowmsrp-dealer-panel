# BelowMSRP Dealer Panel Documentation

## Overview
This documentation provides complete API and implementation details for the BelowMSRP Dealer Panel offers system.

## Documentation Files

### MOBILE_TEAM_API_DOCUMENTATION.md
**Complete API reference for mobile team integration**

This comprehensive guide includes:

1. **All API Endpoints**
   - GET /bid/all-bid (All offers)
   - GET /bid/get-dealer-bid/accept/{dealerId} (Accepted offers)
   - GET /bid/get-dealer-bid/reject/{dealerId} (Rejected offers)
   - GET /bid/get-dealer-bid/counter/{dealerId} (Countered offers)
   - POST /bid/dealer-bid-action (Accept/Reject actions)
   - POST /bid/dealer-bid-counter (Counter offer)
   - POST /credit-score/multiple-credit-scores (Credit scores)
   - GET /bid/user-bid/{bidId}/pdf (PDF preview)

2. **Complete JSON Examples**
   - Request payloads
   - Response structures
   - All possible field values
   - Error responses

3. **Data Mapping Details**
   - Which keys are used from each API
   - Which keys are NOT used
   - How data is transformed for display
   - ID normalization logic

4. **Button Display Logic**
   - Exact conditions for showing/hiding buttons
   - When buttons are enabled/disabled
   - Loading states
   - All possible button combinations

5. **Status Tags Logic**
   - All possible status tags
   - Priority order for displaying tags
   - Exact conditions for each tag
   - Visual styling information

6. **Complete Scenarios**
   - Scenario 1: Fresh offer
   - Scenario 2: Dealer accepts
   - Scenario 3: Dealer counters
   - Scenario 4: User counters back
   - Scenario 5: Dealer accepts counter
   - Scenario 6: Dealer rejects
   - Scenario 7: Multiple counter rounds

7. **Page-Specific Details**
   - All Offers Page
   - Offers Page (with tabs)
   - Countered Page
   - Accepted Page
   - Rejected Page

## Key Features Documented

### Offers Listing
- How offers are fetched from different endpoints
- Data transformation and formatting
- Credit score integration
- Trade-in vehicle data handling

### Offer Actions
- Accept offer flow
- Reject offer flow
- Counter offer flow (with file uploads)
- PDF preview functionality

### Status Management
- How status is determined
- When tags are shown
- Button visibility based on status
- Deal closure states

### Countered Offers Logic
- Dealer counters user
- User counters dealer
- Multiple negotiation rounds
- Final acceptance/rejection

## Implementation Notes

### Authentication
All APIs require authentication token in headers:
```javascript
Headers: {
  "authtoken": "<JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

### ID Normalization
Always normalize IDs before API calls to handle both string and object formats.

### Credit Score Fetching
Fetch credit scores in batch after getting offers list for better performance.

### Error Handling
Always validate required fields (userId, dealerId, carId, bidId) before API calls.

### File Uploads
Counter offer API uses FormData for multipart/form-data uploads.

## Testing Checklist
The documentation includes a complete testing checklist covering:
- All offer states
- All button actions
- All status transitions
- Error scenarios
- Edge cases

## For Mobile Team
The MOBILE_TEAM_API_DOCUMENTATION.md file is specifically designed for mobile team integration and includes:
- Complete API contracts
- All possible scenarios
- Exact implementation logic
- JSON examples for every case
- Button and tag logic with code examples

## Questions?
For any clarifications or additional scenarios, please refer to the main documentation file or contact the development team.

