/**
 * @param {{children: React.ReactNode, onClick: function, color?: ('blue'|'red'), className?: string, type?: ('button'|'submit'|'reset')}} props
 */
const Button = ({ children, onClick, color = 'blue', className = '', type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`btn ${color === 'red' ? 'btn-red' : 'btn-blue'} ${className}`}
  >
    {children}
  </button>
);
export default Button;