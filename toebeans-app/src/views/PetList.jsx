// --- Pet List View ---
import Button from "../components/Button";
/**
 * @param {{pets: Pet[], onSelectPet: function, onAddPet: function}} props
 */
const PetList = ({ pets, onSelectPet, onAddPet }) => (
  <div className="page-padding space-y-4 page-enter">
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
export default PetList;