/**
 * @param {{label: string, name: string, type?: string, value: string, onChange: function, required?: boolean, min?: string, step?: string}} props
 */
const InputField = ({ label, name, type = 'text', value, onChange, required = false, min, step }) => (
  <div className="input-group">
    <label htmlFor={name} className="input-label">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <div className="input-field-wrapper">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
        className="input-field"
        placeholder={type === 'number' ? '0' : ''}
      />
    </div>
  </div>
);

export default InputField;