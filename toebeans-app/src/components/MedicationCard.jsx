// --- Medication Card ---

import { calculateDosage } from "../utils";
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
}; export default MedicationCard;