/**
 * @param {{name: string, value: string, onChange: function, options: UnitOption[]}} props
 */
const UnitSelect = ({ name, value, onChange, options }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="unit-select"
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
export default UnitSelect