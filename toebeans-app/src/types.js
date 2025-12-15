
/**
 * @typedef {('Liquid'|'Pill')} DoseForm
 * @typedef {{mass: {[unit: string]: number}, volume: {[unit: string]: number}, petWeight: {[unit: string]: number}}} UnitFactors
 * @typedef {('mass'|'volume'|'petWeight')} UnitType
 * @typedef {{result: number, unit: string, error: string}} DosageResult
 * @typedef {{value: string, label: string}} UnitOption
 */
/**
 * 
 * 
 * * @typedef {object} Medication
 * @property {string} id
 * @property {string} name
 * @property {DoseForm} doseForm
 * * // --- NEW WEIGHT-BASED DOSAGE FIELDS ---
 * @property {string} dosagePerKgValue - Required dosage per weight value (e.g., 5.0)
 * @property {string} dosageUnitPerKg - Required dosage unit per weight (e.g., mg or g)
 * // ---------------------------------------
 * * @property {string} frequency
 * * @property {string} [concentrationValue] - Liquid: Mass value in concentration (e.g., 5)
 * @property {string} [concentrationMassUnit] - Liquid: Mass unit in concentration (e.g., g)
 * @property {string} [concentrationVolumeUnit] - Liquid: Volume unit in concentration (e.g., ml)
 * * @property {string} [tabletSize] - Pill: Mass per unit (e.g., 100)
 */

/**
 * @typedef {object} Pet
 * @property {string} id
 * @property {string} name
 * @property {string} species
 * @property {string} weight
 * @property {string} weightUnit
 * @property {Medication[]} medications
 */