import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { firstName, lastName, email, phone, propertyAddress, propertyPrice, appointmentDate } = await req.json();

    if (!firstName || !email || !phone || !propertyAddress || !propertyPrice || !appointmentDate) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const couponValue = propertyPrice * 0.01;
    const formatCurrency = (val) => Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

    // Save appointment to database
    const appointment = await base44.asServiceRole.entities.AppointmentRequest.create({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      property_address: propertyAddress,
      property_price: propertyPrice,
      coupon_value: couponValue,
      appointment_date: appointmentDate,
      status: "pending"
    });

    // Send email to customer with appointment confirmation
    const appointmentDateObj = new Date(appointmentDate);
    const formattedDate = appointmentDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    
    const customerEmailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f5f5f0;font-family:sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:32px 0;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #003366;"><tr><td style="background:#003366;padding:14px 24px;border-bottom:3px solid #c9a84c;"><p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.2em;font-weight:900;text-transform:uppercase;">California Homebuyers Rebate Coupon Program</p></td></tr><tr><td style="padding:32px 24px;"><p style="font-size:18px;font-weight:bold;color:#003366;font-family:Georgia,serif;margin-bottom:8px;">Congratulations!</p><p style="font-size:14px;color:#444;line-height:1.6;margin-bottom:24px;">Your official CA Homebuyers Rebate Coupon has been issued.</p><div style="background:#003366;border:2px solid #c9a84c;padding:24px;text-align:center;margin-bottom:24px;"><p style="margin:0 0 6px;color:#c9a84c;font-size:10px;letter-spacing:0.3em;font-weight:900;text-transform:uppercase;">Your Coupon Value</p><p style="margin:0;color:#ffffff;font-size:42px;font-weight:900;font-family:Georgia,serif;">${formatCurrency(couponValue)}</p><p style="margin:6px 0 0;color:#c9a84c;font-size:12px;">on ${propertyAddress}</p></div><p style="font-size:13px;font-weight:bold;color:#003366;margin-bottom:8px;">Scheduled Showing</p><p style="font-size:13px;color:#444;margin-bottom:24px;"><strong>${formattedDate}</strong></p><p style="font-size:12px;color:#777;line-height:1.6;">Bennett will contact you shortly to confirm this appointment and answer any questions about your rebate.</p></td></tr><tr><td style="background:#f5f5f0;padding:14px 24px;border-top:1px solid #e0d9c8;"><p style="margin:0;font-size:10px;color:#999;">BuyWiser Technology, Inc. NMLS 1887767. Not state-administered or state-funded.</p></td></tr></table></td></tr></table></body></html>`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BuyWiser Rebates <noreply@myrebate.house>",
        to: [email],
        subject: `Your CA Homebuyers Coupon — ${formatCurrency(couponValue)} | Showing Scheduled`,
        html: customerEmailHtml,
      }),
    });

    // Send SMS alert to Bennett with appointment details
    const bennettPhone = Deno.env.get("BENNETT_PHONE");
    const smsMessage = `🎉 NEW COUPON ISSUED\n\n${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\n\nProperty: ${propertyAddress}\nPrice: ${formatCurrency(propertyPrice)}\nCoupon: ${formatCurrency(couponValue)}\n\nShowing: ${formattedDate}\n\nReply to confirm appointment.`;

    await fetch("https://api.twilio.com/2010-04-01/Accounts/" + Deno.env.get("TWILIO_ACCOUNT_SID") + "/Messages.json", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(Deno.env.get("TWILIO_ACCOUNT_SID") + ":" + Deno.env.get("TWILIO_AUTH_TOKEN")),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: Deno.env.get("TWILIO_FROM_NUMBER"),
        To: bennettPhone,
        Body: smsMessage,
      }).toString(),
    });

    return Response.json({ 
      success: true, 
      couponValue,
      appointmentId: appointment.id,
      appointmentDate
    });
  } catch (error) {
    console.error("issueCouponWithAppointment error:", error);
    return Response.json({ error: error.message || "Failed to issue coupon" }, { status: 500 });
  }
});