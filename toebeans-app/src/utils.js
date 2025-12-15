// --- Utility Functions and Constants ---



/** @type {UnitFactors} */
const UNIT_FACTORS = {
  mass: {
    mg: 1,
    g: 1000,
    kg: 1000000,
  },
  volume: {
    ml: 1,
    L: 1000,
  },
  petWeight: {
    kg: 1,
    lb: 0.453592, // 1 lb is approx 0.453592 kg
  }
};

/**
 * Converts a value from a given unit to the internal base unit (mg, ml, or kg).
 * @param {number} value
 * @param {string} fromUnit
 * @param {UnitType} type
 * @returns {number}
 */
export const convertToBaseUnit = (value, fromUnit, type) => {
  const factor = UNIT_FACTORS[type]?.[fromUnit];
  if (isNaN(value) || factor === undefined) {
    return 0;
  }
  return value * factor;
};

/**
 * Calculates the required volume (ml) or number of units (tablets) to administer.
 * @param {Medication} medication
 * @param {Pet} pet
 * @returns {DosageResult}
 */
export const calculateDosage = (medication, pet) => {
  const { doseForm, dosagePerKgValue, dosageUnitPerKg, concentrationValue, concentrationMassUnit, concentrationVolumeUnit, tabletSize } = medication;
  
  const dosagePerKgNum = parseFloat(dosagePerKgValue);
  const petWeightNum = parseFloat(pet.weight);

  // --- Step 1: Input Validation ---
  if (isNaN(dosagePerKgNum) || dosagePerKgNum <= 0) {
    return { result: 0, unit: doseForm === 'Pill' ? 'tablets' : 'ml', error: "Dosage per kg is invalid." };
  }
  if (isNaN(petWeightNum) || petWeightNum <= 0) {
    return { result: 0, unit: doseForm === 'Pill' ? 'tablets' : 'ml', error: "Pet weight is invalid." };
  }

  // --- Step 2: Calculate Pet Mass in Base Unit (kg) ---
  const petMassKg = convertToBaseUnit(petWeightNum, pet.weightUnit, 'petWeight');
  if (petMassKg <= 0) {
    return { result: 0, unit: doseForm === 'Pill' ? 'tablets' : 'ml', error: "Pet weight conversion failed." };
  }

  // --- Step 3: Calculate Total Required Drug Mass in Base Unit (mg) ---
  // Convert the required dose (e.g., 5 mg) part of the mg/kg to mg
  const requiredDoseMg = convertToBaseUnit(dosagePerKgNum, dosageUnitPerKg, 'mass');
  
  // Total required dose mass (mg) = (Required Dose Mass per Kg) * (Pet Weight in Kg)
  const totalMassDoseMg = requiredDoseMg * petMassKg;

  // --- Step 4: Calculate Administration Amount (Volume or Units) ---

  if (doseForm === 'Liquid' && concentrationValue && concentrationMassUnit && concentrationVolumeUnit) {
    const concValueNum = parseFloat(concentrationValue);
    if (isNaN(concValueNum) || concValueNum <= 0) {
        return { result: 0, unit: 'ml', error: "Concentration mass value is invalid." };
    }

    // Convert concentration mass part (e.g., 5g) to base mass unit (mg)
    const concMassMg = convertToBaseUnit(concValueNum, concentrationMassUnit, 'mass');

    // Ensure concentration volume unit (e.g., 1ml) is converted to ml (base volume unit)
    const concVolumeMl = convertToBaseUnit(1, concentrationVolumeUnit, 'volume');

    if (concMassMg === 0) {
      return { result: 0, unit: 'ml', error: "Concentration mass cannot be zero." };
    }

    // Required Volume (ml) = (Total Mass Dose Mg / Concentration Mass Mg) * Concentration Volume Ml
    const requiredVolumeMl = (totalMassDoseMg / concMassMg) * concVolumeMl;

    if (isNaN(requiredVolumeMl) || requiredVolumeMl < 0) {
      return { result: 0, unit: 'ml', error: "Calculation failed. Check all number inputs." };
    }

    return { result: requiredVolumeMl, unit: 'ml', error: "" };

  } else if (doseForm === 'Pill' && tabletSize) {
    const tabletSizeNum = parseFloat(tabletSize);
    if (isNaN(tabletSizeNum) || tabletSizeNum <= 0) {
      return { result: 0, unit: 'tablets', error: "Tablet size value is invalid." };
    }

    // Convert tablet size (e.g., 100 mg/unit) to base mass unit (mg/unit).
    // The dosageUnitPerKg is reused here to specify the mass unit of the tablet size.
    const tabletSizeMg = convertToBaseUnit(tabletSizeNum, dosageUnitPerKg, 'mass'); 

    if (tabletSizeMg === 0) {
      return { result: 0, unit: 'tablets', error: "Tablet size cannot be zero." };
    }

    // Required Units = Total Mass Dose Mg / Tablet Size Mg
    const requiredUnits = totalMassDoseMg / tabletSizeMg;

    if (isNaN(requiredUnits) || requiredUnits < 0) {
      return { result: 0, unit: 'tablets', error: "Calculation failed. Check all number inputs." };
    }

    return { result: requiredUnits, unit: 'tablets', error: "" };
  }

  return { result: 0, unit: doseForm === 'Pill' ? 'tablets' : 'ml', error: "Missing required fields for calculation." };
};