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
 * @returns {DosageResult}
 */
export const calculateDosage = (medication) => {
  const { doseAmount, doseUnit, doseForm, concentrationValue, concentrationMassUnit, concentrationVolumeUnit, tabletSize } = medication;

  const doseAmountNum = parseFloat(doseAmount);

  if (isNaN(doseAmountNum) || doseAmountNum <= 0) {
    return { result: 0, unit: doseForm === 'Pill' ? 'tablets' : 'ml', error: "" };
  }

  // 1. Convert required dose to base mass unit (mg)
  const doseMassMg = convertToBaseUnit(doseAmountNum, doseUnit, 'mass');

  if (doseForm === 'Liquid' && concentrationValue && concentrationMassUnit && concentrationVolumeUnit) {
    const concValueNum = parseFloat(concentrationValue);
    if (isNaN(concValueNum) || concValueNum <= 0) {
        return { result: 0, unit: 'ml', error: "Concentration mass value is invalid." };
    }

    // 2. Convert concentration mass part to base mass unit (mg)
    const concMassMg = convertToBaseUnit(concValueNum, concentrationMassUnit, 'mass');

    // 3. Ensure concentration volume unit is correct (e.g., 1 ml or 1 L)
    const concVolumeMl = convertToBaseUnit(1, concentrationVolumeUnit, 'volume');

    if (concMassMg === 0) {
      return { result: 0, unit: 'ml', error: "Concentration mass cannot be zero." };
    }

    // 4. Calculate the required volume in milliliters (ml)
    const requiredVolumeMl = (doseMassMg / concMassMg) * concVolumeMl;

    if (isNaN(requiredVolumeMl) || requiredVolumeMl < 0) {
      return { result: 0, unit: 'ml', error: "Calculation failed. Check all number inputs." };
    }

    return { result: requiredVolumeMl, unit: 'ml', error: "" };

  } else if (doseForm === 'Pill' && tabletSize) {
    const tabletSizeNum = parseFloat(tabletSize);
    if (isNaN(tabletSizeNum) || tabletSizeNum <= 0) {
      return { result: 0, unit: 'tablets', error: "Tablet size value is invalid." };
    }

    // 2. Convert tablet size to base mass unit (mg).
    const tabletSizeMg = convertToBaseUnit(tabletSizeNum, doseUnit, 'mass');

    if (tabletSizeMg === 0) {
      return { result: 0, unit: 'tablets', error: "Tablet size cannot be zero." };
    }

    // 3. Calculate the required number of units (tablets/capsules)
    const requiredUnits = doseMassMg / tabletSizeMg;

    if (isNaN(requiredUnits) || requiredUnits < 0) {
      return { result: 0, unit: 'tablets', error: "Calculation failed. Check all number inputs." };
    }

    return { result: requiredUnits, unit: 'tablets', error: "" };
  }

  return { result: 0, unit: doseForm === 'Pill' ? 'tablets' : 'ml', error: "Missing required fields for calculation." };
};