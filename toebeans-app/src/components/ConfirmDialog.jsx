import Button from "./Button";

/**
 * @param {{title: string, message: string, onConfirm: function, onCancel: function, confirmText?: string, confirmColor?: string}} props
 */
const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  confirmColor = "red"
}) => (
  <div className="card form-card confirm-dialog">
    <h2 className="form-title">{title}</h2>
    <p className="confirm-message">{message}</p>
    <div className="form-actions">
      <Button onClick={onCancel} className="flex-1">Cancel</Button>
      <Button onClick={onConfirm} color={confirmColor} className="flex-1">
        {confirmText}
      </Button>
    </div>
  </div>
);

export default ConfirmDialog;
