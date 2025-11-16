// History view: Display list of previous predictions
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, ENDPOINTS } from '../config';

interface HistoryItem {
  id: string;
  ts: string;
  grade: string;
  confidence: number;
  thumbnail_b64: string;
  report_url?: string;
}

function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Backend endpoint must exist: GET /history (returns array of items)
      const response = await axios.get<HistoryItem[]>(
        `${API_BASE}${ENDPOINTS.HISTORY}`
      );
      setItems(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
          'Failed to load history. Please ensure the backend is running.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the local cache?')) {
      localStorage.clear();
      alert('Local cache cleared.');
    }
  };

  const handleDownloadReport = (reportUrl?: string) => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    }
  };

  const getGradeColor = (grade: string): string => {
    const gradeMap: Record<string, string> = {
      '0': 'grade-0',
      '1': 'grade-1',
      '2': 'grade-2',
      '3': 'grade-3',
      '4': 'grade-4',
    };
    return gradeMap[grade] || 'grade-unknown';
  };

  return (
    <div className="history-view">
      <div className="view-header">
        <h1>Prediction History</h1>
        <p>Review your previous Diabetic Retinopathy predictions</p>
      </div>

      <div className="history-container">
        <div className="history-controls">
          <button className="btn btn-secondary" onClick={fetchHistory}>
            Refresh
          </button>
          <button className="btn btn-secondary" onClick={handleClearCache}>
            Clear Local Cache
          </button>
        </div>

        {loading && <p className="loading-text">Loading history...</p>}

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="empty-state">
            <p>No predictions yet. Start by analyzing a retina image on the Home page.</p>
          </div>
        )}

        {!loading && items.length > 0 && !selectedItem && (
          <div className="history-grid">
            {items.map((item) => (
              <div key={item.id} className="history-card">
                {item.thumbnail_b64 && (
                  <img
                    src={`data:image/png;base64,${item.thumbnail_b64}`}
                    alt="Thumbnail"
                    className="history-thumbnail"
                  />
                )}
                <div className="history-card-content">
                  <p className="history-timestamp">
                    {new Date(item.ts).toLocaleString()}
                  </p>
                  <div className={`grade-badge ${getGradeColor(item.grade)}`}>
                    Grade: {item.grade}
                  </div>
                  <p className="history-confidence">
                    Confidence: {(item.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="history-card-actions">
                  <button
                    className="btn btn-small"
                    onClick={() => setSelectedItem(item)}
                  >
                    View
                  </button>
                  {item.report_url && (
                    <button
                      className="btn btn-small"
                      onClick={() => handleDownloadReport(item.report_url)}
                    >
                      Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedItem && (
          <div className="detail-modal">
            <div className="detail-content">
              <button
                className="close-btn"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
              <h3>Prediction Details</h3>
              {selectedItem.thumbnail_b64 && (
                <img
                  src={`data:image/png;base64,${selectedItem.thumbnail_b64}`}
                  alt="Full size"
                  className="detail-image"
                />
              )}
              <div className="detail-info">
                <p>
                  <strong>Date:</strong> {new Date(selectedItem.ts).toLocaleString()}
                </p>
                <p>
                  <strong>Grade:</strong>{' '}
                  <span className={`grade-badge ${getGradeColor(selectedItem.grade)}`}>
                    {selectedItem.grade}
                  </span>
                </p>
                <p>
                  <strong>Confidence:</strong> {(selectedItem.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div className="detail-actions">
                {selectedItem.report_url && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDownloadReport(selectedItem.report_url)}
                  >
                    Download Report
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
