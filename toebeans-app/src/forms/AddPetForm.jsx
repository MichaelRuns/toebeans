import InputField from "../components/InputField";
import Button from "../components/Button";
import UnitSelect from "../components/UnitSelect";

/**
 * @param {{onAdd: function, onCancel: function}} props
 */
const AddPetForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', species: '', weight: '', weightUnit: 'kg' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  /** @type {UnitOption[]} */
  const weightOptions = [
    { value: 'kg', label: 'kg' },
    { value: 'lb', label: 'lb' },
  ];

  return (
    <div className="card form-card">
      <h2 className="form-title">New Furry Friend</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <InputField
          label="Species (e.g., Cat, Dog)"
          name="species"
          value={formData.species}
          onChange={handleChange}
          required
        />
        <div className="input-group">
          <label htmlFor="weight" className="input-label">
            Weight <span className="text-danger">*</span>
          </label>
          <div className="input-field-wrapper-split">
            <input
              type="number"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="0.1"
              step="0.1"
              className="input-field input-field-split"
              placeholder="0.0"
            />
            <UnitSelect
              name="weightUnit"
              value={formData.weightUnit}
              onChange={handleChange}
              options={weightOptions}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" className="flex-1" onClick={() => {}}>Add Pet</Button>
          <Button onClick={onCancel} color="red" className="flex-1">Cancel</Button>
        </div>
      </form>
    </div>
  );
};
export default AddPetForm