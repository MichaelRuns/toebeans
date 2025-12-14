import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import usePetData from './hooks/usePetData';
import { calculateDosage, convertToBaseUnit } from './utils';
import Button from './components/Button';
import UnitSelect from './components/UnitSelect';
import InputField from './components/InputField';
import AddPetForm from './forms/AddPetForm';

// --- Components ---



// --- Pet Forms ---




/**
 * @param {{pet: Pet, onAdd: function, onCancel: function}} props
 */
const AddMedicationForm = ({ pet, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    doseForm: 'Liquid',
    doseAmount: '',
    doseUnit: 'mg',
    frequency: 'Once daily',
    concentrationValue: '',
    concentrationMassUnit: 'g',
    concentrationVolumeUnit: 'ml',
    tabletSize: '',
  });

  const { doseForm } = formData;

  /** @type {UnitOption[]} */
  const massOptions = [
    { value: 'mg', label: 'mg' },
    { value: 'g', label: 'g' },
    { value: 'kg', label: 'kg' },
  ];
  /** @type {UnitOption[]} */
  const volumeOptions = [
    { value: 'ml', label: 'ml' },
    { value: 'L', label: 'L' },
  ];
  const frequencyOptions = ['Once daily', '2x daily', '3x daily', 'Every 8 hours', 'Every 12 hours'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(pet.id, formData);
    onCancel();
  };

  return (
    <div className="card form-card max-w-xl">
      <h2 className="form-title">Add Medication for {pet.name}</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Medication Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Dosage Form Selector */}
        <div className="input-group">
          <label htmlFor="doseForm" className="input-label">
            Dosage Form <span className="text-danger">*</span>
          </label>
          <select
            name="doseForm"
            value={formData.doseForm}
            onChange={handleChange}
            required
            className="input-field-full"
          >
            <option value="Liquid">Liquid (Suspension, Drops)</option>
            <option value="Pill">Pill (Tablet, Capsule)</option>
          </select>
        </div>
        {/* End Dosage Form Selector */}


        <div className="section-box section-box-blue">
          <h3 className="section-title text-indigo">Required Dose (Prescription)</h3>
          <div className="flex-row-spaced">
            <div className="flex-col-half">
              <label htmlFor="doseAmount" className="input-label">Amount</label>
              <div className="input-field-wrapper-split">
                <input
                  type="number"
                  name="doseAmount"
                  id="doseAmount"
                  value={formData.doseAmount}
                  onChange={handleChange}
                  required
                  min="0.1"
                  step="0.1"
                  className="input-field input-field-split"
                  placeholder="25"
                />
                <UnitSelect
                  name="doseUnit"
                  value={formData.doseUnit}
                  onChange={handleChange}
                  options={massOptions}
                />
              </div>
            </div>
            <div className="flex-col-half">
              <label htmlFor="frequency" className="input-label">Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="input-field-full"
              >
                {frequencyOptions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Conditional Field Block: Liquid Concentration */}
        {doseForm === 'Liquid' && (
          <div className="section-box section-box-green">
            <h3 className="section-title text-green">Concentration (Bottle Label)</h3>
            <p className="text-note">e.g., 5 g / ml</p>
            <div className="flex-row-divided">
              <div className="flex-col-third">
                <label htmlFor="concentrationValue" className="input-label">Mass Value</label>
                <input
                  type="number"
                  name="concentrationValue"
                  id="concentrationValue"
                  value={formData.concentrationValue}
                  onChange={handleChange}
                  required
                  min="0.1"
                  step="0.1"
                  className="input-field-full"
                  placeholder="5"
                />
              </div>
              <div className="flex-col-third">
                <label htmlFor="concentrationMassUnit" className="input-label">Mass Unit</label>
                <UnitSelect
                  name="concentrationMassUnit"
                  value={formData.concentrationMassUnit || 'g'}
                  onChange={handleChange}
                  options={massOptions}
                />
              </div>
              <span className="text-divider">/</span>
              <div className="flex-col-third">
                <label htmlFor="concentrationVolumeUnit" className="input-label">Volume Unit</label>
                <UnitSelect
                  name="concentrationVolumeUnit"
                  value={formData.concentrationVolumeUnit || 'ml'}
                  onChange={handleChange}
                  options={volumeOptions}
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional Field Block: Pill Tablet Size */}
        {doseForm === 'Pill' && (
            <div className="section-box section-box-purple">
                <h3 className="section-title text-purple">Pill Size (Tablet/Capsule Label)</h3>
                <p className="text-note">e.g., 100 mg per tablet</p>
                <div className="input-group">
                    <label htmlFor="tabletSize" className="input-label">
                        Mass Per Unit (e.g., 100) <span className="text-danger">*</span>
                    </label>
                    <div className="input-field-wrapper-split-unit">
                        <input
                            type="number"
                            name="tabletSize"
                            id="tabletSize"
                            value={formData.tabletSize}
                            onChange={handleChange}
                            required
                            min="0.1"
                            step="0.1"
                            className="input-field input-field-split"
                            placeholder="100"
                        />
                        <UnitSelect
                            name="doseUnit"
                            value={formData.doseUnit}
                            onChange={handleChange}
                            options={massOptions}
                        />
                         <div className="unit-label">
                            / unit
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="form-actions">
          <Button type="submit" className="flex-1" onClick={() => {}}>Add Medication</Button>
          <Button onClick={onCancel} color="red" className="flex-1">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

// --- Medication Card ---

/**
 * @param {{medication: Medication}} props
 */
const MedicationCard = ({ medication }) => {
  const { result, unit, error } = calculateDosage(medication);

  // Determine formatting based on unit
  const displayResult = unit === 'ml' ? result.toFixed(3) : result.toFixed(2);
  const resultBgColor = medication.doseForm === 'Pill' ? 'result-pill' : 'result-liquid';

  return (
    <div className="med-card">
      <h4 className="med-title">{medication.name}</h4>
      <p className="med-frequency">{medication.frequency}</p>

      <div className="detail-row border-top margin-top">
        <span className="detail-label">Required Dose:</span>
        <span className="text-indigo">{medication.doseAmount} {medication.doseUnit}</span>
      </div>

      {medication.doseForm === 'Liquid' && (
        <div className="detail-row">
          <span className="detail-label">Concentration:</span>
          <span className="text-green">{medication.concentrationValue} {medication.concentrationMassUnit} / {medication.concentrationVolumeUnit}</span>
        </div>
      )}

      {medication.doseForm === 'Pill' && (
        <div className="detail-row">
          <span className="detail-label">Tablet Size:</span>
          <span className="text-purple">{medication.tabletSize} {medication.doseUnit} / unit</span>
        </div>
      )}

      <div className={`result-box ${resultBgColor}`}>
        {error ? (
          <p className="result-error">Calculation Error: {error}</p>
        ) : (
          <>
            <p className="result-label">
              {unit === 'ml' ? 'Volume to Administer (Calculated):' : 'Units to Administer (Calculated):'}
            </p>
            <p className="result-value">
              {displayResult} {unit}
            </p>

            {/* Warnings based on unit */}
            {unit === 'ml' && result > 100 && (
                 <p className="warning-note text-danger">
                    Warning: This volume is very large. Please double-check your units and inputs.
                </p>
            )}
            {unit === 'ml' && result < 0.01 && result > 0 && (
                 <p className="warning-note text-orange">
                    Note: This volume is extremely small (less than 0.01 ml). Ensure your dose units (mg vs g) are correct.
                </p>
            )}
            {unit === 'tablets' && result > 2 && (
                 <p className="warning-note text-orange">
                    Note: Administering more than 2 units is unusual. Please double-check the required dose and tablet size.
                </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// --- Pet Detail View ---

/**
 * @param {{pet: Pet, onBack: function, onDelete: function}} props
 */
const PetDetail = ({ pet, onBack, onDelete }) => {
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const { addMedication } = usePetData(); // Only use the function needed

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
          pet.medications.map(med => <MedicationCard key={med.id} medication={med} />)
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
};

// --- Pet List View ---

/**
 * @param {{pets: Pet[], onSelectPet: function, onAddPet: function}} props
 */
const PetList = ({ pets, onSelectPet, onAddPet }) => (
  <div className="page-padding space-y-4">
    <div className="list-header">
      <h1 className="detail-title">Your ToeBeans</h1>
      <Button onClick={onAddPet} className="btn-small btn-secondary btn-shadow">
        + Add Pet
      </Button>
    </div>

    {pets.length === 0 ? (
      <div className="empty-list-state">
        <p className="margin-bottom-sm">No pets yet!</p>
        <p>Click "Add Pet" to get started.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {pets.map(pet => (
          <div
            key={pet.id}
            onClick={() => onSelectPet(pet.id)}
            className="pet-list-item"
          >
            <div>
              <p className="pet-list-name">{pet.name}</p>
              <p className="pet-list-details">{pet.species} | {pet.weight} {pet.weightUnit}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-lg text-indigo-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    )}
  </div>
);


// --- Main Application Component ---

const App = () => {
  const { pets, addPet, addMedication, deletePet, isReady } = usePetData();
  const [activePetId, setActivePetId] = useState(null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);

  const activePet = useMemo(() => pets.find(p => p.id === activePetId), [pets, activePetId]);

  const handleSelectPet = (id) => setActivePetId(id);
  const handleBackToPetList = () => setActivePetId(null);

  if (!isReady) {
    return (
      <div className="loading-container">
        <p className="text-lg text-indigo">Loading ToeBeans data...</p>
      </div>
    );
  }

  return (
    <>
      {/* This style block functions as the app.css file, containing all styles 
        for the application, ensuring it remains a single, self-contained file. 
      */}

      <div className="min-h-screen">
        <header className="app-header">
          <div className="max-w-xl mx-auto">
            <div className="header-title text-2xl font-black tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              ToeBeans
            </div>
          </div>
        </header>

        <main className="max-w-xl mx-auto">
          {showAddPetForm && (
            <div className="fixed-overlay">
              <div className="modal-content-wrapper">
                <AddPetForm
                  onAdd={addPet}
                  onCancel={() => setShowAddPetForm(false)}
                />
              </div>
            </div>
          )}

          {activePet ? (
            <PetDetail
              pet={activePet}
              onBack={handleBackToPetList}
              onDelete={(id) => {
                deletePet(id);
                handleBackToPetList();
              }}
            />
          ) : (
            <PetList
              pets={pets}
              onSelectPet={handleSelectPet}
              onAddPet={() => setShowAddPetForm(true)}
            />
          )}
        </main>

        <footer className="py-4 text-center text-xs text-gray-500 border-top margin-top">
          <p>ToeBeans App - Dosage calculations based on Dimensional Analysis.</p>
          <p className="text-danger font-semibold margin-top-sm">
            Disclaimer: Always consult a veterinary professional. This app is for informational purposes only.
          </p>
        </footer>
      </div>
    </>
  );
};

export default App;