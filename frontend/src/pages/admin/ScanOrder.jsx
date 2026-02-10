import { QrReader } from "react-qr-reader";
import { api } from "../../api/api";

export default function ScanOrder() {
  const handleScan = async (result) => {
    if (!result) return;

    const orderId = result?.text;
    const res = await api.put(`/orders/${orderId}/collect`);
    alert("Order collected: " + res.data._id);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Scan Order QR</h1>
      <QrReader
        onResult={(res) => handleScan(res)}
        constraints={{ facingMode: "environment" }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
