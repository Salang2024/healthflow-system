
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Medication } from '@/types/pharmacy';

// Helper to format currency
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Export prescription to Excel
export const exportToExcel = (
  prescriptionId: string,
  patientName: string,
  patientId: string,
  doctorName: string,
  date: string,
  medications: Medication[]
) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Create medication data rows
  const medicationRows = medications.map(med => [
    med.name,
    med.dosage,
    med.quantity,
    formatCurrency(med.price),
    formatCurrency(med.price * med.quantity)
  ]);
  
  // Calculate total
  const total = medications.reduce((sum, med) => sum + (med.price * med.quantity), 0);
  
  // Create data with headers and content
  const wsData = [
    ['Prescription Details'],
    ['ID', prescriptionId],
    ['Patient Name', patientName],
    ['Patient ID', patientId],
    ['Doctor', doctorName],
    ['Date', date],
    [],
    ['Medication', 'Dosage', 'Quantity', 'Unit Price', 'Total'],
    ...medicationRows,
    [],
    ['', '', '', 'Grand Total:', formatCurrency(total)]
  ];
  
  // Create worksheet and add to workbook
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Prescription');
  
  // Generate file name
  const fileName = `Prescription_${prescriptionId}_${patientId}.xlsx`;
  
  // Write and download file
  XLSX.writeFile(wb, fileName);
};

// Export prescription to PDF
export const exportToPDF = (
  prescriptionId: string,
  patientName: string,
  patientId: string,
  doctorName: string,
  date: string,
  medications: Medication[],
  status: string,
  dispensedBy?: string,
  dispensedDate?: string
) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set font size and type
  doc.setFontSize(20);
  doc.text('Prescription', 105, 15, { align: 'center' });
  
  // Add prescription details
  doc.setFontSize(12);
  doc.text(`Prescription ID: ${prescriptionId}`, 14, 30);
  doc.text(`Patient: ${patientName} (${patientId})`, 14, 40);
  doc.text(`Doctor: ${doctorName}`, 14, 50);
  doc.text(`Date: ${date}`, 14, 60);
  doc.text(`Status: ${status}`, 14, 70);
  
  // Add dispensing details if available
  let yPosition = 80;
  if (dispensedBy && dispensedDate) {
    doc.text(`Dispensed by: ${dispensedBy}`, 14, yPosition);
    yPosition += 10;
    doc.text(`Dispensed date: ${dispensedDate}`, 14, yPosition);
    yPosition += 10;
  }
  
  // Create table data
  const tableColumn = ["Medication", "Dosage", "Quantity", "Unit Price", "Total"];
  const tableRows = medications.map(med => [
    med.name,
    med.dosage,
    med.quantity.toString(),
    formatCurrency(med.price),
    formatCurrency(med.price * med.quantity)
  ]);
  
  // Add medication table
  (doc as any).autoTable({
    startY: yPosition,
    head: [tableColumn],
    body: tableRows,
    foot: [['', '', '', 'Grand Total:', formatCurrency(medications.reduce((sum, med) => sum + (med.price * med.quantity), 0))]],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    footStyles: { fillColor: [235, 237, 242], textColor: 0, fontStyle: 'bold' }
  });
  
  // Generate filename
  const fileName = `Prescription_${prescriptionId}_${patientId}.pdf`;
  
  // Save PDF
  doc.save(fileName);
};
