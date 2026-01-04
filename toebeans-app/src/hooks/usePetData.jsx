import React, {useState, useEffect, useCallback} from 'react'
/**
 * @returns {{pets: Pet[], addPet: function, addMedication: function, deletePet: function, isReady: boolean}}
 */

/**
 * Generates a simple UUID for use as an ID.
 * @returns {string}
 */
const generateId = () => 'id-' + Math.random().toString(36).substring(2, 9);

/**
 * @returns {{
 *   pets: Pet[],
 *   addPet: function,
 *   updatePet: function,
 *   deletePet: function,
 *   addMedication: function,
 *   updateMedication: function,
 *   deleteMedication: function,
 *   recordAdministration: function,
 *   clearAdministrationHistory: function,
 *   isReady: boolean
 * }}
 */
const usePetData = () => {
  const [pets, setPets] = useState([]);
  const [isReady, setIsReady] = useState(false);
  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedPets = localStorage.getItem('toebeans_pets');
      if (storedPets) {
        setPets(JSON.parse(storedPets));
      }
    } catch (e) {
      console.error("Could not load data from localStorage", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  // Save data to localStorage whenever pets state changes
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('toebeans_pets', JSON.stringify(pets));
    }
  }, [pets, isReady]);

  /**
   * @param {Omit<Pet, 'id' | 'medications'>} newPet
   */
  const addPet = useCallback((newPet) => {
    const petToAdd = { ...newPet, id: generateId(), medications: [] };
    setPets(prev => [...prev, petToAdd]);
  }, []);

  /**
   * @param {string} petId
   * @param {Omit<Medication, 'id'>} newMedication
   */
  const addMedication = useCallback((petId, newMedication) => {
    const medicationToAdd = { ...newMedication, id: generateId() };
    setPets(prev => prev.map(pet =>
      pet.id === petId
        ? {
            ...pet,
            medications: [...pet.medications, medicationToAdd]
          }
        : pet
    ));
  }, []);

  /**
   * @param {string} petId
   */
  const deletePet = useCallback((petId) => {
    setPets(prev => prev.filter(p => p.id !== petId));
  }, []);

  /**
   * Updates an existing pet
   * @param {string} petId
   * @param {Partial<Pet>} updates
   */
  const updatePet = useCallback((petId, updates) => {
    setPets(prev => prev.map(pet =>
      pet.id === petId ? { ...pet, ...updates } : pet
    ));
  }, []);

  /**
   * Updates an existing medication
   * @param {string} petId
   * @param {string} medicationId
   * @param {Partial<Medication>} updates
   */
  const updateMedication = useCallback((petId, medicationId, updates) => {
    setPets(prev => prev.map(pet => {
      if (pet.id !== petId) return pet;
      return {
        ...pet,
        medications: pet.medications.map(med =>
          med.id === medicationId ? { ...med, ...updates } : med
        )
      };
    }));
  }, []);

  /**
   * Deletes a medication from a pet
   * @param {string} petId
   * @param {string} medicationId
   */
  const deleteMedication = useCallback((petId, medicationId) => {
    setPets(prev => prev.map(pet => {
      if (pet.id !== petId) return pet;
      return {
        ...pet,
        medications: pet.medications.filter(med => med.id !== medicationId)
      };
    }));
  }, []);

  /**
   * Records a medication administration
   * @param {string} petId
   * @param {string} medicationId
   */
  const recordAdministration = useCallback((petId, medicationId) => {
    setPets(prev => prev.map(pet => {
      if (pet.id !== petId) return pet;
      return {
        ...pet,
        medications: pet.medications.map(med => {
          if (med.id !== medicationId) return med;
          const history = med.administrationHistory || [];
          return {
            ...med,
            administrationHistory: [...history, { timestamp: new Date().toISOString() }]
          };
        })
      };
    }));
  }, []);

  /**
   * Clears administration history for a medication
   * @param {string} petId
   * @param {string} medicationId
   */
  const clearAdministrationHistory = useCallback((petId, medicationId) => {
    setPets(prev => prev.map(pet => {
      if (pet.id !== petId) return pet;
      return {
        ...pet,
        medications: pet.medications.map(med => {
          if (med.id !== medicationId) return med;
          return { ...med, administrationHistory: [] };
        })
      };
    }));
  }, []);

  return {
    pets,
    addPet,
    updatePet,
    deletePet,
    addMedication,
    updateMedication,
    deleteMedication,
    recordAdministration,
    clearAdministrationHistory,
    isReady
  };
};

export default usePetData;