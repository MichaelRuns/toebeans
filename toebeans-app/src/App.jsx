import React, { useState, useMemo } from 'react';
import './App.css';
import usePetData from './hooks/usePetData';
import AddPetForm from './forms/AddPetForm'
import PetDetail from './views/PetDetail';
import PetList from './views/PetList'




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