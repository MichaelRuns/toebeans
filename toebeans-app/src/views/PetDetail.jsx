// --- Pet Detail View ---
import MedicationCard from "../components/MedicationCard";
import AddMedicationForm from "../forms/AddMedicationForm";
import EditPetForm from "../forms/EditPetForm";
import EditMedicationForm from "../forms/EditMedicationForm";
import AdministrationHistoryModal from "../components/AdministrationHistoryModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../components/Button";
import { convertToBaseUnit } from "../utils";
import { useState, useMemo } from 'react';

/**
 * @param {{
 *   pet: Pet,
 *   onBack: function,
 *   onDelete: function,
 *   addMedication: function,
 *   updatePet: function,
 *   updateMedication: function,
 *   deleteMedication: function,
 *   recordAdministration: function,
 *   clearAdministrationHistory: function
 * }} props
 */
const PetDetail = ({
  pet,
  onBack,
  onDelete,
  addMedication,
  updatePet,
  updateMedication,
  deleteMedication,
  recordAdministration,
  clearAdministrationHistory
}) => {
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [showEditPetForm, setShowEditPetForm] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState(null);
  const [deletingMedicationId, setDeletingMedicationId] = useState(null);
  const [showDeletePetConfirm, setShowDeletePetConfirm] = useState(false);
  const [historyMedicationId, setHistoryMedicationId] = useState(null);

  // Calculate pet weight in kg for display consistency
  const petWeightKg = useMemo(() => {
    return convertToBaseUnit(parseFloat(pet.weight), pet.weightUnit, 'petWeight');
  }, [pet.weight, pet.weightUnit]);

  // Get medication for editing
  const editingMedication = useMemo(() => {
    if (!editingMedicationId) return null;
    return pet.medications.find(m => m.id === editingMedicationId);
  }, [editingMedicationId, pet.medications]);

  // Get medication for deletion confirmation
  const deletingMedication = useMemo(() => {
    if (!deletingMedicationId) return null;
    return pet.medications.find(m => m.id === deletingMedicationId);
  }, [deletingMedicationId, pet.medications]);

  // Get medication for history modal
  const historyMedication = useMemo(() => {
    if (!historyMedicationId) return null;
    return pet.medications.find(m => m.id === historyMedicationId);
  }, [historyMedicationId, pet.medications]);

  if (showAddMedForm) {
    return (
      <div className="page-padding page-enter">
        <AddMedicationForm
          pet={pet}
          onAdd={addMedication}
          onCancel={() => setShowAddMedForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="page-padding space-y-4 page-enter">
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
        <div className="flex-row-spaced" style={{ alignItems: 'center' }}>
          <h2 className="detail-subtitle" style={{ marginBottom: 0 }}>Pet Details</h2>
          <button
            className="icon-btn"
            onClick={() => setShowEditPetForm(true)}
            aria-label="Edit pet"
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <div className="detail-row text-gray-600 margin-top-sm">
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
          pet.medications.map(med => (
            <MedicationCard
              key={med.id}
              medication={med}
              pet={pet}
              onRecordAdministration={(medId) => recordAdministration(pet.id, medId)}
              onShowHistory={(medId) => setHistoryMedicationId(medId)}
              onEdit={(medId) => setEditingMedicationId(medId)}
              onDelete={(medId) => setDeletingMedicationId(medId)}
            />
          ))
        ) : (
          <div className="empty-state">
            No medications added for {pet.name}. Add one to calculate a dose!
          </div>
        )}
      </div>

      <div className="margin-top">
        <Button onClick={() => setShowDeletePetConfirm(true)} color="red">
          Delete {pet.name}
        </Button>
      </div>

      {/* Edit Pet Modal */}
      {showEditPetForm && (
        <div className="fixed-overlay">
          <div className="modal-content-wrapper">
            <EditPetForm
              pet={pet}
              onSave={updatePet}
              onCancel={() => setShowEditPetForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {editingMedication && (
        <div className="fixed-overlay">
          <div className="modal-content-wrapper">
            <EditMedicationForm
              medication={editingMedication}
              petName={pet.name}
              onSave={(medId, updates) => {
                updateMedication(pet.id, medId, updates);
              }}
              onCancel={() => setEditingMedicationId(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Medication Confirm */}
      {deletingMedication && (
        <div className="fixed-overlay">
          <div className="modal-content-wrapper">
            <ConfirmDialog
              title="Delete Medication"
              message={`Are you sure you want to delete ${deletingMedication.name}? This action cannot be undone.`}
              onConfirm={() => {
                deleteMedication(pet.id, deletingMedication.id);
                setDeletingMedicationId(null);
              }}
              onCancel={() => setDeletingMedicationId(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Pet Confirm */}
      {showDeletePetConfirm && (
        <div className="fixed-overlay">
          <div className="modal-content-wrapper">
            <ConfirmDialog
              title="Delete Pet"
              message={`Are you sure you want to delete ${pet.name} and all their medications? This action cannot be undone.`}
              onConfirm={() => {
                onDelete(pet.id);
              }}
              onCancel={() => setShowDeletePetConfirm(false)}
            />
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyMedication && (
        <div className="fixed-overlay">
          <div className="modal-content-wrapper">
            <AdministrationHistoryModal
              medication={historyMedication}
              onClose={() => setHistoryMedicationId(null)}
              onClearHistory={() => {
                clearAdministrationHistory(pet.id, historyMedication.id);
                setHistoryMedicationId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetail;
