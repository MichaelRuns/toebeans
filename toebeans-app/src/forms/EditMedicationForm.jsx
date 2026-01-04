import InputField from "../components/InputField";
import UnitSelect from "../components/UnitSelect";
import Button from "../components/Button";
import { useState } from 'react';

/**
 * @param {{medication: Medication, petName: string, onSave: function, onCancel: function}} props
 */
const EditMedicationForm = ({ medication, petName, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: medication.name,
    doseForm: medication.doseForm,
    dosagePerKgValue: medication.dosagePerKgValue,
    dosageUnitPerKg: medication.dosageUnitPerKg,
    frequency: medication.frequency,
    concentrationValue: medication.concentrationValue || '',
    concentrationMassUnit: medication.concentrationMassUnit || 'g',
    concentrationVolumeUnit: medication.concentrationVolumeUnit || 'ml',
    tabletSize: medication.tabletSize || '',
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
    onSave(medication.id, formData);
    onCancel();
  };

  return (
    <div className="card form-card max-w-xl">
      <h2 className="form-title">Edit {medication.name} for {petName}</h2>
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

        <div className="section-box section-box-blue">
          <h3 className="section-title text-indigo">Required Dosage (Prescription)</h3>
          <p className="text-note">Dosage is required per kilogram of pet weight (e.g., 5 mg/kg)</p>
          <div className="flex-row-spaced">
            <div className="flex-col-half">
              <label htmlFor="dosagePerKgValue" className="input-label">Mass Value per Kg</label>
              <div className="input-field-wrapper-split-unit-compact">
                <input
                  type="number"
                  name="dosagePerKgValue"
                  id="dosagePerKgValue"
                  value={formData.dosagePerKgValue}
                  onChange={handleChange}
                  required
                  min="0.001"
                  step="0.001"
                  className="input-field input-field-split-compact"
                  placeholder="5.0"
                />
                <UnitSelect
                  name="dosageUnitPerKg"
                  value={formData.dosageUnitPerKg}
                  onChange={handleChange}
                  options={massOptions}
                />
                <div className="unit-label-compact">/ kg</div>
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
            <p className="text-note">e.g., 100 mg per tablet. Unit must match the prescribed dose unit.</p>
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
                  name="dosageUnitPerKg"
                  value={formData.dosageUnitPerKg}
                  onChange={handleChange}
                  options={massOptions}
                />
                <div className="unit-label">/ unit</div>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <Button type="submit" className="flex-1">Save Changes</Button>
          <Button onClick={onCancel} color="red" className="flex-1">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicationForm;
