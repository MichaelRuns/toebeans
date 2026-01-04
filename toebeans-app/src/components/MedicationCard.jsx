// --- Medication Card ---

import { calculateDosage, convertToBaseUnit, formatRelativeTime } from '../utils';
import { useMemo } from "react";
import Button from "./Button";

/**
 * @param {{
 *   medication: Medication,
 *   pet: Pet,
 *   onRecordAdministration?: function,
 *   onShowHistory?: function,
 *   onEdit?: function,
 *   onDelete?: function
 * }} props
 */
const MedicationCard = ({ medication, pet, onRecordAdministration, onShowHistory, onEdit, onDelete }) => {
  const { result, unit, error } = calculateDosage(medication, pet);

  // Determine formatting based on unit
  const displayResult = unit === 'ml' ? result.toFixed(3) : result.toFixed(2);
  const resultBgColor = medication.doseForm === 'Pill' ? 'result-pill' : 'result-liquid';

  const petWeightKg = useMemo(() => {
    return convertToBaseUnit(parseFloat(pet.weight), pet.weightUnit, 'petWeight');
  }, [pet.weight, pet.weightUnit]);

  const requiredDoseMg = convertToBaseUnit(parseFloat(medication.dosagePerKgValue), medication.dosageUnitPerKg, 'mass');
  const totalDoseMg = requiredDoseMg * petWeightKg;

  // Format last administered time
  const lastAdministered = useMemo(() => {
    const history = medication.administrationHistory || [];
    if (history.length === 0) return null;
    const lastTime = new Date(history[history.length - 1].timestamp);
    return formatRelativeTime(lastTime);
  }, [medication.administrationHistory]);

  const historyCount = medication.administrationHistory?.length || 0;

  return (
    <div className="med-card">
      <div className="med-card-header">
        <div>
          <h4 className="med-title">{medication.name}</h4>
          <p className="med-frequency">{medication.frequency}</p>
        </div>
        {(onEdit || onDelete) && (
          <div className="med-card-header-actions">
            {onEdit && (
              <button
                className="icon-btn"
                onClick={() => onEdit(medication.id)}
                aria-label="Edit medication"
              >
                <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                className="icon-btn icon-btn-danger"
                onClick={() => onDelete(medication.id)}
                aria-label="Delete medication"
              >
                <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {lastAdministered && (
        <div className="detail-row margin-top-sm">
          <span className="detail-label">Last given:</span>
          <span className="text-green font-semibold">{lastAdministered}</span>
        </div>
      )}

      <div className="detail-row border-top margin-top">
        <span className="detail-label">Prescribed Dose:</span>
        <span className="text-indigo font-bold">
            {medication.dosagePerKgValue} {medication.dosageUnitPerKg} / kg
        </span>
      </div>
      
      <div className="detail-row">
        <span className="detail-label">Total Mass Required:</span>
        <span className="text-indigo font-bold">{totalDoseMg.toFixed(2)} mg</span>
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
          <span className="text-purple">{medication.tabletSize} {medication.dosageUnitPerKg} / unit</span>
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
                    Warning: This volume is very large. Please double-check your inputs.
                </p>
            )}
            {unit === 'ml' && result < 0.01 && result > 0 && (
                 <p className="warning-note text-orange">
                    Note: This volume is extremely small (less than 0.01 ml). 
                </p>
            )}
            {unit === 'tablets' && result > 2 && (
                 <p className="warning-note text-orange">
                    Note: Administering more than 2 units is unusual. Please double-check the inputs.
                </p>
            )}
            {unit === 'tablets' && result < 0.5 && result > 0 && (
                 <p className="warning-note text-orange">
                    Note: This requires cutting a pill. Use a pill cutter for accuracy.
                </p>
            )}
          </>
        )}
      </div>

      {/* Administration action buttons */}
      {(onRecordAdministration || onShowHistory) && (
        <div className="med-card-actions">
          {onRecordAdministration && (
            <Button
              onClick={() => onRecordAdministration(medication.id)}
              className="btn-small btn-secondary"
            >
              Record Dose
            </Button>
          )}
          {onShowHistory && historyCount > 0 && (
            <Button
              onClick={() => onShowHistory(medication.id)}
              className="btn-small btn-outline"
            >
              History ({historyCount})
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationCard;