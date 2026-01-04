import Button from "./Button";

/**
 * @param {{medication: Medication, onClose: function, onClearHistory: function}} props
 */
const AdministrationHistoryModal = ({ medication, onClose, onClearHistory }) => {
  const history = medication.administrationHistory || [];

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="card form-card">
      <h2 className="form-title">{medication.name} - History</h2>

      {history.length === 0 ? (
        <p className="empty-state">No administration records yet.</p>
      ) : (
        <div className="history-list">
          {history.slice().reverse().map((record, index) => (
            <div key={index} className="history-item">
              <span className="history-date">{formatDateTime(record.timestamp)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="form-actions">
        <Button onClick={onClose} className="flex-1">Close</Button>
        {history.length > 0 && (
          <Button onClick={onClearHistory} color="red" className="flex-1">
            Clear History
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdministrationHistoryModal;
