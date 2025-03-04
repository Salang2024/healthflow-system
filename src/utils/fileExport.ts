import jsPDF from "jspdf";
import { jsPDF as jsPDFType } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Need to augment the jsPDF type to include autoTable method
interface jsPDFWithAutoTable extends jsPDFType {
  autoTable: (options: any) => any;
}

// Define types (matching the ones in Pharmacy.tsx)
interface Medication {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
}

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  status: string;
  medications: Medication[];
  dispensedBy?: string;
  dispensedDate?: string;
}

export const generatePDF = (prescription: Prescription) => {
  // Create a new jsPDF instance with proper typing
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Add title
  doc.setFontSize(20);
  doc.text("PRESCRIPTION RECEIPT", 105, 15, { align: "center" });
  
  // Add hospital info
  doc.setFontSize(12);
  doc.text("Medical Clinic Hospital", 105, 25, { align: "center" });
  doc.setFontSize(10);
  doc.text("123 Healthcare Ave, Medicity, MC 12345", 105, 30, { align: "center" });
  doc.text("Phone: (555) 123-4567", 105, 35, { align: "center" });
  
  // Add line
  doc.line(20, 40, 190, 40);
  
  // Add prescription details
  doc.setFontSize(11);
  doc.text(`Prescription ID: ${prescription.id}`, 20, 50);
  doc.text(`Date: ${prescription.date}`, 150, 50);
  doc.text(`Patient: ${prescription.patientName}`, 20, 57);
  doc.text(`Patient ID: ${prescription.patientId}`, 150, 57);
  doc.text(`Prescribed by: ${prescription.doctorName}`, 20, 64);
  
  if (prescription.dispensedBy && prescription.dispensedDate) {
    doc.text(`Dispensed by: ${prescription.dispensedBy}`, 20, 71);
    doc.text(`Dispensed Date: ${prescription.dispensedDate}`, 150, 71);
  }
  
  // Add line
  doc.line(20, 78, 190, 78);
  
  // Add medications table
  const tableColumn = ["No", "Medication", "Dosage", "Quantity", "Unit Price", "Total"];
  const tableRows: Array<(string | number)[]> = [];
  
  prescription.medications.forEach((medication, index) => {
    const total = medication.price * medication.quantity;
    const medicationData = [
      index + 1,
      medication.name,
      medication.dosage,
      medication.quantity,
      `$${medication.price.toFixed(2)}`,
      `$${total.toFixed(2)}`
    ];
    tableRows.push(medicationData);
  });
  
  // Use jspdf-autotable with proper typing
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 82,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 135, 245] }
  });
  
  // Get the final Y position after the table
  const finalY = doc.previousAutoTable.finalY + 10;
  
  // Add total
  const total = prescription.medications.reduce((sum, med) => sum + (med.price * med.quantity), 0);
  doc.setFontSize(12);
  doc.text(`Total Amount: $${total.toFixed(2)}`, 150, finalY);
  
  // Add footer
  doc.setFontSize(10);
  doc.text("Thank you for choosing Medical Clinic Hospital", 105, finalY + 20, { align: "center" });
  doc.text("Get well soon!", 105, finalY + 27, { align: "center" });
  
  // Save PDF
  doc.save(`prescription_${prescription.id}.pdf`);
};

export const generateExcel = (prescription: Prescription) => {
  // Create worksheet for prescription details
  const detailsWS = XLSX.utils.aoa_to_sheet([
    ["Prescription Details"],
    ["ID", prescription.id],
    ["Date", prescription.date],
    ["Patient Name", prescription.patientName],
    ["Patient ID", prescription.patientId],
    ["Doctor", prescription.doctorName],
    ["Status", prescription.status]
  ]);
  
  if (prescription.dispensedBy && prescription.dispensedDate) {
    XLSX.utils.sheet_add_aoa(detailsWS, [
      ["Dispensed By", prescription.dispensedBy],
      ["Dispensed Date", prescription.dispensedDate]
    ], { origin: -1 });
  }
  
  // Create worksheet for medications
  const medsHeader = ["No.", "Medication", "Dosage", "Quantity", "Unit Price ($)", "Total ($)"];
  const medsData = prescription.medications.map((med, index) => [
    index + 1,
    med.name,
    med.dosage,
    med.quantity,
    med.price,
    med.price * med.quantity
  ]);
  
  // Add total row
  const total = prescription.medications.reduce((sum, med) => sum + (med.price * med.quantity), 0);
  medsData.push(["", "", "", "", "TOTAL", total]);
  
  const medsWS = XLSX.utils.aoa_to_sheet([medsHeader, ...medsData]);
  
  // Create workbook and add worksheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, detailsWS, "Prescription Details");
  XLSX.utils.book_append_sheet(wb, medsWS, "Medications");
  
  // Save Excel file
  XLSX.writeFile(wb, `prescription_${prescription.id}.xlsx`);
};
