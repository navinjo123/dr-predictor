// Explainability view: Display Grad-CAM heatmap overlay with opacity control
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, ENDPOINTS } from '../config';

interface ExplainResult {
  grade: string;
  confidence: number;
  heatmap_b64: string;
}

interface ExplainProps {
  lastUploadedImage: string | File | null;
}

function Explain({ lastUploadedImage }: ExplainProps) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(
    lastUploadedImage instanceof File ? lastUploadedImage : null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    lastUploadedImage instanceof File ? URL.createObjectURL(lastUploadedImage) : null
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.6);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleExplain = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // TODO: Backend endpoint must exist: POST /explain (returns heatmap_b64)
      const response = await axios.post<ExplainResult>(
        `${API_BASE}${ENDPOINTS.EXPLAIN}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setResult(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
          'Failed to generate explanation. Please ensure the backend is running.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHeatmap = () => {
    if (!result?.heatmap_b64) return;

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${result.heatmap_b64}`;
    link.setAttribute('download', `heatmap_${Date.now()}.png`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <div className="explain-view">
      <div className="view-header">
        <h1>Explainability Analysis</h1>
        <p>Visualize which regions of the retina image influenced the prediction</p>
      </div>

      <div className="explain-container">
        <div className="upload-section">
          <h3>Upload Retina Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="file-input"
          />
          <button
            className="btn btn-small"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Image
          </button>
        </div>

        {previewUrl && !result && (
          <div className="preview-card">
            <h3>Selected Image</h3>
            <img src={previewUrl} alt="Selected retina" className="preview-image" />
          </div>
        )}

        {previewUrl && !result && (
          <button
            className="btn btn-primary"
            onClick={handleExplain}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              'Generate Heatmap'
            )}
          </button>
        )}

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="explanation-section">
            <div className="explanation-info">
              <p><strong>Grade:</strong> {result.grade}</p>
              <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
            </div>

            <div className="heatmap-comparison">
              <div className="image-container">
                <h4>Original Image</h4>
                {previewUrl && (
                  <img src={previewUrl} alt="Original" className="comparison-image" />
                )}
              </div>

              <div className="image-container heatmap-container">
                <h4>Grad-CAM Overlay</h4>
                <div className="heatmap-wrapper">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="comparison-image"
                      style={{ position: 'absolute' }}
                    />
                  )}
                  {result.heatmap_b64 && (
                    <img
                      src={`data:image/png;base64,${result.heatmap_b64}`}
                      alt="Heatmap"
                      className="comparison-image"
                      style={{ opacity }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="opacity-control">
              <label>Heatmap Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="slider"
              />
              <span>{Math.round(opacity * 100)}%</span>
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                onClick={handleDownloadHeatmap}
              >
                Download Heatmap
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setResult(null);
                }}
              >
                Analyze Another
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explain;
