// --- Pet Detail View ---
import MedicationCard from "../components/MedicationCard";
import AddMedicationForm from "../forms/AddMedicationForm";
import Button from "../components/Button";
import { convertToBaseUnit } from "../utils";
import {useState, useMemo} from 'react'
/**
 * @param {{pet: Pet, onBack: function, onDelete: function, addMedication: function}} props
 */
const PetDetail = ({ pet, onBack, onDelete, addMedication}) => {
  const [showAddMedForm, setShowAddMedForm] = useState(false);

  // Calculate pet weight in kg for display consistency
  const petWeightKg = useMemo(() => {
    return convertToBaseUnit(parseFloat(pet.weight), pet.weightUnit, 'petWeight');
  }, [pet.weight, pet.weightUnit]);


  if (showAddMedForm) {
    return (
      <div className="page-padding">
        <AddMedicationForm
          pet={pet}
          onAdd={addMedication}
          onCancel={() => setShowAddMedForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="page-padding space-y-4">
      <div className="detail-header">
        <h1 className="detail-title">{pet.name}</h1>
        <Button onClick={onBack} className="btn-small btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-sm icon-mr" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Button>
      </div>

      <div className="card detail-info-card">
        <h2 className="detail-subtitle">Pet Details</h2>
        <div className="detail-row text-gray-600">
          <p>Species:</p>
          <p className="text-bold text-indigo">{pet.species}</p>
        </div>
        <div className="detail-row text-gray-600 margin-top-sm">
          <p>Weight:</p>
          <p className="text-bold text-indigo">
            {pet.weight} {pet.weightUnit} ({petWeightKg.toFixed(2)} kg)
          </p>
        </div>
      </div>

      <div className="flex-row-spaced margin-top">
        <h2 className="detail-subtitle">Medications ({pet.medications.length})</h2>
        <Button onClick={() => setShowAddMedForm(true)} className="btn-small btn-secondary">
          + Add Med
        </Button>
      </div>

      <div className="space-y-4">
        {pet.medications.length > 0 ? (
          pet.medications.map(med => <MedicationCard key={med.id} medication={med} pet={pet} />)
        ) : (
          <div className="empty-state">
            No medications added for {pet.name}. Add one to calculate a dose!
          </div>
        )}
      </div>

      <div className="margin-top">
        <Button onClick={() => onDelete(pet.id)} color="red">
          Delete {pet.name}
        </Button>
      </div>
    </div>
  );
}; export default PetDetail;