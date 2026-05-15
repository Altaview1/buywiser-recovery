# VTON Letter Template Formatting Guide

## Lob HTML Template Requirements

### Dimensions & Format
- **Size:** 6x11 inches (standard letter)
- **Format:** HTML with inline CSS
- **Color:** Black & white (set `color: 'false'` in API call)
- **File size:** Under 5MB

### Required Variables

Your template MUST include these placeholders (they get replaced with lead data):

| Variable | Description | Example |
|----------|-------------|---------|
| `${first_name}` | Veteran's first name | "John" |
| `${last_name}` | Veteran's last name | "Smith" |
| `${property_address}` | Home address | "123 Main St" |
| `${city}` | City | "Los Angeles" |
| `${state}` | State | "CA" |
| `${zip_code}` | Zip code | "90210" |
| `${estimated_benefit}` | Benefit amount | "$50,000" |
| `${qrUrl}` | QR code image URL | Auto-generated |

### Template Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    /* Use inline CSS or internal styles */
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .content {
      padding: 20px;
    }
    .signature {
      margin-top: 40px;
    }
    .qr-code {
      text-align: center;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Veterans GAP NextMove™ Program</h1>
  </div>
  
  <div class="content">
    <p>Dear ${first_name} ${last_name},</p>
    
    <p>Congratulations! You qualify for the Veterans GAP NextMove™ Program.</p>
    
    <p>Your estimated benefit for the property at:<br>
    <strong>${property_address}</strong><br>
    ${city}, ${state} ${zip_code}</p>
    
    <p>Estimated Benefit: <strong>${estimated_benefit}</strong></p>
    
    <div class="qr-code">
      <img src="${qrUrl}" alt="Scan for Benefit Details" width="200" height="200" />
    </div>
    
    <p>Scan the QR code above or visit:<br>
    <strong>buywiser.com/vton-benefit</strong></p>
    
    <div class="signature">
      <p>Sincerely,<br>
      Buywiser Home Loans<br>
      (818) 300-2642</p>
    </div>
  </div>
</body>
</html>
```

---

## Design Best Practices

### ✅ DO:
- Use high contrast (black text on white background)
- Keep fonts readable (12pt minimum)
- Include clear call-to-action
- Test QR code scanning before approving
- Use simple, clean layouts
- Leave margins (0.5" minimum)

### ❌ DON'T:
- Use background images (may not print well)
- Use fancy fonts (stick to Arial, Helvetica, Times New Roman)
- Rely on color (printing is black & white)
- overcrowd the page
- Use external CSS files (must be inline or internal)

---

## Testing Your Template

### 1. Preview in Browser
Before approving, paste your HTML into a browser to check:
- Layout looks correct
- All variables are properly formatted
- QR code displays

### 2. Send Test Email
Use the **VTON Letter Template Review** page:
1. Enter a test lead ID
2. Click "Send Test Email"
3. Check how personalization looks in actual email

### 3. Send Test Mail
Before full rollout:
1. Create a test lead with your own address
2. Trigger the mailing function
3. Wait 2-5 business days for delivery
4. Verify print quality and formatting

---

## Common Issues & Fixes

### Issue: Variables not replacing
**Fix:** Ensure exact syntax: `${variable_name}` with curly braces and dollar sign

### Issue: QR code not showing
**Fix:** Use `${qrUrl}` variable - it's auto-generated with the lead ID

### Issue: Text cut off
**Fix:** Reduce font size or content - stay within 6x11 inch area

### Issue: Template not approved
**Fix:** Go to `/vton-letter-review` and click "Approve Template" button

---

## Template Examples

### Example 1: Simple Letter
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial; font-size: 12pt; padding: 40px;">
  <h2 style="text-align: center;">Veterans GAP NextMove™</h2>
  <hr>
  <p>Dear ${first_name} ${last_name},</p>
  
  <p>You qualify for up to <strong>${estimated_benefit}</strong> in benefits!</p>
  
  <p>Property: ${property_address}, ${city}, ${state} ${zip_code}</p>
  
  <p style="text-align: center; margin: 30px;">
    <img src="${qrUrl}" width="200" height="200" />
  </p>
  
  <p>Scan to view your benefits</p>
  
  <p>Sincerely,<br>Buywiser Home Loans</p>
</body>
</html>
```

### Example 2: Formal Letter
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .letterhead { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; }
    .content { margin-top: 30px; }
    .highlight { font-weight: bold; font-size: 14pt; }
  </style>
</head>
<body style="font-family: 'Times New Roman', serif; font-size: 12pt;">
  <div class="letterhead">
    <h1>Buywiser Home Loans</h1>
    <p>Veterans GAP NextMove™ Program</p>
  </div>
  
  <div class="content">
    <p>${first_name} ${last_name}<br>
    ${property_address}<br>
    ${city}, ${state} ${zip_code}</p>
    
    <p>Dear ${first_name},</p>
    
    <p>Congratulations! Based on our analysis, you qualify for an estimated benefit of:</p>
    
    <p class="highlight">${estimated_benefit}</p>
    
    <p>To learn more, please scan the QR code below or visit our website.</p>
    
    <div style="text-align: center; margin: 40px;">
      <img src="${qrUrl}" width="200" height="200" />
    </div>
    
    <p>We look forward to helping you with your next home.</p>
    
    <p>Sincerely,<br>
    The Buywiser Team<br>
    (818) 300-2642</p>
  </div>
</body>
</html>
```

---

## Updating Your Template

To change your template:

1. Go to **VTON Letter Template Review** (`/vton-letter-review`)
2. Edit the HTML in the text area
3. Click "Preview with Lead Data" to test
4. Send test email if needed
5. Click "Approve Template" to make it active

**Note:** Only ONE template can be active at a time (the approved one).

---

## Lob Template Alternatives

Instead of sending HTML directly, you can also:

1. **Create templates in Lob dashboard** (recommended for complex designs)
2. Use template ID instead of HTML in API call
3. Manage versions and updates in Lob UI

For more info: [Lob Template Guide](https://help.lob.com/print-and-mail/designing-mail-creatives)