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
 * @returns {{pets: Pet[], addPet: function, addMedication: function, deletePet: function, isReady: boolean}}
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

  return { pets, addPet, addMedication, deletePet, isReady };
};

export default usePetData;