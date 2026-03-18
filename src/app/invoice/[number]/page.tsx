import { createAdminClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

const HALFTONE_COMPANY = process.env.HALFTONE_COMPANY_NAME ?? "WEAR ADHD";
const HALFTONE_TRADING_AS = "Halftone Labs";
const HALFTONE_GST = process.env.HALFTONE_GST_NUMBER ?? "091DDPPS4109J1ZT";
const HALFTONE_ADDRESS = process.env.HALFTONE_ADDRESS ?? "NT-2/201, Eldeco Utopia, Sector 93A, Noida — 201304, Uttar Pradesh";
const HALFTONE_EMAIL = "hello@halftonelabs.in";
const HALFTONE_WEBSITE = "halftonelabs.in";

interface InvoiceItem {
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  cgst_rate?: number;
  sgst_rate?: number;
  cgst?: number;
  sgst?: number;
  amount: number;
  order_ref?: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  type: string;
  order_id: string | null;
  month: string | null;
  user_id: string | null;
  customer_email: string;
  customer_name: string | null;
  customer_address: string | null;
  company_name: string | null;
  gst_number: string | null;
  subtotal: number;
  gst_amount: number;
  total: number;
  status: string;
  items: InvoiceItem[] | null;
  issued_at: string;
}

interface Order {
  ref: string;
  product_name: string;
  color: string;
  size: string;
  print_tier: string | null;
  blank_price: number;
  print_price: number;
  shipping: number;
  total: number;
  created_at: string;
}

function fmt(n: number) {
  return `₹${Number(n).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const invoiceNumber = decodeURIComponent(number);

  const db = createAdminClient();

  const { data: invoice, error } = await db
    .from("invoices")
    .select("*")
    .eq("invoice_number", invoiceNumber)
    .maybeSingle();

  if (error || !invoice) notFound();

  const inv = invoice as Invoice;

  // Fetch related order if order_id exists
  let order: Order | null = null;
  if (inv.order_id) {
    const { data: orderData } = await db
      .from("orders")
      .select("ref, product_name, color, size, print_tier, blank_price, print_price, shipping, total, created_at")
      .eq("id", inv.order_id)
      .maybeSingle();
    order = orderData as Order | null;
  }

  // Build line items from stored items, or derive from order
  let lineItems: InvoiceItem[] = [];

  if (inv.items && Array.isArray(inv.items) && inv.items.length > 0) {
    lineItems = inv.items as InvoiceItem[];
  } else if (order) {
    const itemSubtotal = Number(order.blank_price ?? 0) + Number(order.print_price ?? 0);
    const cgst = Math.round(itemSubtotal * 0.025 * 100) / 100;
    const sgst = Math.round(itemSubtotal * 0.025 * 100) / 100;
    lineItems = [
      {
        description: `${order.product_name ?? "T-Shirt"} — ${order.color ?? ""} / ${order.size ?? ""}${order.print_tier ? ` with ${order.print_tier} print` : ""}`,
        hsn: "610910",
        qty: 1,
        rate: itemSubtotal,
        cgst_rate: 2.5,
        sgst_rate: 2.5,
        cgst,
        sgst,
        amount: itemSubtotal + cgst + sgst,
        order_ref: order.ref,
      },
    ];

    if (Number(order.shipping ?? 0) > 0) {
      const shippingAmt = Number(order.shipping);
      const sCgst = Math.round(shippingAmt * 0.025 * 100) / 100;
      const sSgst = Math.round(shippingAmt * 0.025 * 100) / 100;
      lineItems.push({
        description: "Shipping & Handling",
        hsn: "996812",
        qty: 1,
        rate: shippingAmt,
        cgst_rate: 2.5,
        sgst_rate: 2.5,
        cgst: sCgst,
        sgst: sSgst,
        amount: shippingAmt + sCgst + sSgst,
      });
    }
  }

  const subtotal = Number(inv.subtotal);
  const cgstTotal = Math.round(subtotal * 0.025 * 100) / 100;
  const sgstTotal = Math.round(subtotal * 0.025 * 100) / 100;
  const gstTotal = Number(inv.gst_amount);
  const grandTotal = Number(inv.total);

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .invoice-page { box-shadow: none !important; margin: 0 !important; }
        }
        @page { size: A4; margin: 15mm; }
        body { background: #f5f5f5; }
      `}</style>

      <div className="no-print" style={{ padding: "16px 24px", background: "#111", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>HALFTONE LABS</span>
          <span style={{ color: "#888", fontSize: 12 }}>GST Tax Invoice</span>
        </div>
        <PrintButton />
      </div>

      <div
        className="invoice-page"
        style={{
          maxWidth: 800,
          margin: "32px auto",
          background: "#fff",
          padding: "48px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 13,
          color: "#111",
          lineHeight: 1.5,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, borderBottom: "3px solid #111", paddingBottom: 24 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>
              {HALFTONE_COMPANY.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>
              {HALFTONE_WEBSITE}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111", letterSpacing: "0.5px" }}>TAX INVOICE</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>GST Compliant</div>
          </div>
        </div>

        {/* Seller & Buyer + Invoice Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          {/* Seller */}
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: 8 }}>
              Sold By
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{HALFTONE_COMPANY}</div>
            <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>Trading as {HALFTONE_TRADING_AS}</div>
            <div style={{ color: "#444", fontSize: 12 }}>{HALFTONE_ADDRESS}</div>
            <div style={{ color: "#444", fontSize: 12, marginTop: 6 }}>
              <span style={{ fontWeight: 600 }}>GSTIN:</span> {HALFTONE_GST}
            </div>
            <div style={{ color: "#444", fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>Email:</span> {HALFTONE_EMAIL}
            </div>
          </div>

          {/* Buyer */}
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: 8 }}>
              Bill To
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {inv.company_name && inv.company_name !== HALFTONE_COMPANY ? inv.company_name : (inv.customer_name ?? inv.customer_email)}
            </div>
            {inv.customer_name && inv.company_name && inv.company_name !== HALFTONE_COMPANY && (
              <div style={{ color: "#444", fontSize: 12 }}>{inv.customer_name}</div>
            )}
            {inv.customer_address && (
              <div style={{ color: "#444", fontSize: 12 }}>{inv.customer_address}</div>
            )}
            <div style={{ color: "#444", fontSize: 12 }}>{inv.customer_email}</div>
            {inv.gst_number && (
              <div style={{ color: "#444", fontSize: 12, marginTop: 6 }}>
                <span style={{ fontWeight: 600 }}>GSTIN:</span> {inv.gst_number}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Details Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28, background: "#f9f9f9", borderRadius: 6, padding: "14px 18px" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#888", marginBottom: 4 }}>Invoice No.</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{inv.invoice_number}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#888", marginBottom: 4 }}>Invoice Date</div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{formatDate(inv.issued_at)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#888", marginBottom: 4 }}>
              {inv.type === "monthly" ? "Period" : "Order Ref"}
            </div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>
              {inv.type === "monthly"
                ? (() => {
                    const [y, m] = (inv.month ?? "").split("-");
                    return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
                  })()
                : order?.ref
                ? `#${order.ref}`
                : "—"}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#111", color: "#fff" }}>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: 11 }}>Description</th>
              <th style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 11 }}>HSN</th>
              <th style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 11 }}>Qty</th>
              <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700, fontSize: 11 }}>Rate</th>
              <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700, fontSize: 11 }}>CGST 2.5%</th>
              <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700, fontSize: 11 }}>SGST 2.5%</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, fontSize: 11 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length > 0 ? (
              lineItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee", background: i % 2 === 1 ? "#fafafa" : "#fff" }}>
                  <td style={{ padding: "10px 12px", color: "#222" }}>
                    <div>{item.description}</div>
                    {item.order_ref && (
                      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Ref: #{item.order_ref}</div>
                    )}
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "center", color: "#555" }}>{item.hsn ?? "6109"}</td>
                  <td style={{ padding: "10px 8px", textAlign: "center", color: "#555" }}>{item.qty ?? 1}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right", color: "#333" }}>{fmt(item.rate ?? 0)}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right", color: "#333" }}>{fmt(item.cgst ?? Math.round(Number(item.rate ?? 0) * 0.025 * 100) / 100)}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right", color: "#333" }}>{fmt(item.sgst ?? Math.round(Number(item.rate ?? 0) * 0.025 * 100) / 100)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#111" }}>{fmt(item.amount ?? 0)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: "20px 12px", textAlign: "center", color: "#888" }}>
                  No line items available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
          <table style={{ width: 280, borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              <tr>
                <td style={{ padding: "7px 12px", color: "#666" }}>Subtotal (excl. GST)</td>
                <td style={{ padding: "7px 12px", textAlign: "right", fontWeight: 600 }}>{fmt(subtotal)}</td>
              </tr>
              <tr style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "7px 12px", color: "#666" }}>CGST @ 2.5%</td>
                <td style={{ padding: "7px 12px", textAlign: "right" }}>{fmt(cgstTotal)}</td>
              </tr>
              <tr>
                <td style={{ padding: "7px 12px", color: "#666" }}>SGST @ 2.5%</td>
                <td style={{ padding: "7px 12px", textAlign: "right" }}>{fmt(sgstTotal)}</td>
              </tr>
              <tr style={{ borderTop: "2px solid #111" }}>
                <td style={{ padding: "12px 12px", fontWeight: 800, fontSize: 15 }}>Grand Total</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 900, fontSize: 16, color: "#f97316" }}>{fmt(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* GST breakdown note */}
        <div style={{ background: "#f9f9f9", borderRadius: 6, padding: "12px 16px", marginBottom: 28, fontSize: 11, color: "#666" }}>
          <strong>Tax Breakdown:</strong> CGST ({fmt(cgstTotal)}) + SGST ({fmt(sgstTotal)}) = {fmt(gstTotal)} total GST on taxable value of {fmt(subtotal)}.
          {inv.gst_number && ` Customer GSTIN: ${inv.gst_number}.`}
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 20, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#aaa", letterSpacing: "0.3px" }}>
            This is a computer-generated invoice and does not require a physical signature.
          </div>
          <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>
            {HALFTONE_COMPANY} &bull; {HALFTONE_WEBSITE} &bull; {HALFTONE_EMAIL}
          </div>
        </div>
      </div>
    </>
  );
}
