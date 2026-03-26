import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  brand: { fontSize: 24, fontWeight: "bold", color: "#2563eb" },
  invoiceTitle: { fontSize: 18, color: "#374151", textAlign: "right" },
  invoiceMeta: { fontSize: 9, color: "#6b7280", textAlign: "right", marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 8, color: "#6b7280", textTransform: "uppercase", marginBottom: 6, letterSpacing: 1 },
  partyName: { fontSize: 12, fontWeight: "bold", marginBottom: 2 },
  partyDetail: { fontSize: 9, color: "#4b5563", marginBottom: 1 },
  table: { marginTop: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f3f4f6", padding: 8, borderRadius: 4 },
  tableHeaderCell: { fontWeight: "bold", fontSize: 9, color: "#374151" },
  tableRow: { flexDirection: "row", padding: 8, borderBottom: "1 solid #e5e7eb" },
  tableCell: { fontSize: 9, color: "#4b5563" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colRate: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },
  totals: { marginTop: 16, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 },
  totalLabel: { width: 120, fontSize: 9, color: "#6b7280", textAlign: "right", paddingRight: 12 },
  totalValue: { width: 80, fontSize: 9, textAlign: "right" },
  grandTotal: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8, paddingTop: 8, borderTop: "2 solid #2563eb" },
  grandTotalLabel: { width: 120, fontSize: 12, fontWeight: "bold", textAlign: "right", paddingRight: 12 },
  grandTotalValue: { width: 80, fontSize: 12, fontWeight: "bold", color: "#2563eb", textAlign: "right" },
  paymentSection: { marginTop: 30, padding: 16, backgroundColor: "#eff6ff", borderRadius: 6 },
  paymentTitle: { fontSize: 10, fontWeight: "bold", color: "#1e40af", marginBottom: 8 },
  paymentDetail: { fontSize: 9, color: "#1e40af", marginBottom: 2 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#9ca3af" },
});

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  employer: { name: string; company?: string; email: string };
  freelancer: { name: string; email: string; upiId?: string; bankName?: string; bankAccount?: string; bankIfsc?: string };
  items: InvoiceItem[];
  subtotal: number;
  platformFee: number;
  gst: number;
  total: number;
  notes?: string;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>HireSense</Text>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>#{data.invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>Date: {data.date}</Text>
            <Text style={styles.invoiceMeta}>Due: {data.dueDate}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>FROM</Text>
            <Text style={styles.partyName}>{data.employer.name}</Text>
            {data.employer.company && <Text style={styles.partyDetail}>{data.employer.company}</Text>}
            <Text style={styles.partyDetail}>{data.employer.email}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>TO</Text>
            <Text style={styles.partyName}>{data.freelancer.name}</Text>
            <Text style={styles.partyDetail}>{data.freelancer.email}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
          </View>
          {data.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colRate]}>{formatINR(item.rate)}</Text>
              <Text style={[styles.tableCell, styles.colAmount]}>{formatINR(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatINR(data.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Platform Fee (10%)</Text>
            <Text style={styles.totalValue}>{formatINR(data.platformFee)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>GST (18% on fee)</Text>
            <Text style={styles.totalValue}>{formatINR(data.gst)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>{formatINR(data.total)}</Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Details</Text>
          {data.freelancer.upiId && <Text style={styles.paymentDetail}>UPI: {data.freelancer.upiId}</Text>}
          {data.freelancer.bankName && <Text style={styles.paymentDetail}>Bank: {data.freelancer.bankName}</Text>}
          {data.freelancer.bankAccount && <Text style={styles.paymentDetail}>A/C: {data.freelancer.bankAccount}</Text>}
          {data.freelancer.bankIfsc && <Text style={styles.paymentDetail}>IFSC: {data.freelancer.bankIfsc}</Text>}
        </View>

        {data.notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.partyDetail}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Generated by HireSense - India&apos;s AI-Powered Freelancing Platform</Text>
      </Page>
    </Document>
  );
}
