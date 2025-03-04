
// Just updating a specific part of the file to fix the DOM nesting warning
<CardHeader>
  <CardTitle>Prescription Details</CardTitle>
  <CardDescription>
    ID: {selectedPrescription.id} | Patient: {selectedPrescription.patientName} ({selectedPrescription.patientId})
    <br />
    Prescribed by: {selectedPrescription.doctorName} on {selectedPrescription.date}
    {selectedPrescription.status === 'dispensed' && (
      <div className="mt-2 text-medical-600 font-medium">
        Dispensed by: {selectedPrescription.dispensedBy} on {selectedPrescription.dispensedDate}
      </div>
    )}
  </CardDescription>
</CardHeader>
