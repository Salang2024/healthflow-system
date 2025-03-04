
// Define PrescriptionStatus type
export type PrescriptionStatus = 'pending' | 'approved' | 'rejected' | 'paid' | 'dispensed';

// Define Medication interface
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
}

// Define Prescription interface
export interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  status: PrescriptionStatus;
  medications: Medication[];
  rejectionReason?: string;
  dispensedBy?: string;
  dispensedDate?: string;
}
