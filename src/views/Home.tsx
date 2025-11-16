// Home view: Upload, predict, and view initial results
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUploader from '../components/ImageUploader';
import ResultCard from '../components/ResultCard';
import { API_BASE, ENDPOINTS } from '../config';

interface PredictionResult {
  grade: string;
  confidence: number;
  probabilities: Record<string, number>;
}

interface HomeProps {
  setLastUploadedImage: (image: string | File) => void;
}

function Home({ setLastUploadedImage }: HomeProps) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setLastUploadedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // TODO: Backend endpoint must exist: POST /predict
      const response = await axios.post<PredictionResult>(
        `${API_BASE}${ENDPOINTS.PREDICT}`,
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
          'Failed to analyze image. Please ensure the backend is running.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Optional: add patient name and notes if collected
      // formData.append('patient_name', patientName);
      // formData.append('notes', notes);

      // TODO: Backend endpoint must exist: POST /report (returns PDF bytes)
      const response = await axios.post(
        `${API_BASE}${ENDPOINTS.REPORT}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    }
  };

  const handleExplain = () => {
    navigate('/explain');
  };

  return (
    <div className="home-view">
      <div className="view-header">
        <h1>Diabetic Retinopathy Detection</h1>
        <p>Upload a retina image to analyze DR severity using AI</p>
      </div>

      <div className="home-container">
        <ImageUploader onImageSelect={handleImageSelect} />

        {previewUrl && (
          <div className="preview-card">
            <h3>Selected Image</h3>
            <img src={previewUrl} alt="Selected retina" className="preview-image" />
          </div>
        )}

        {previewUrl && !result && (
          <button
            className="btn btn-primary"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Predict'
            )}
          </button>
        )}

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <ResultCard result={result} />

            {result.confidence < 0.45 && (
              <div className="alert alert-warning">
                <strong>Low Confidence:</strong> Confidence is below 45%. Please consult with a specialist for confirmation.
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                onClick={handleExplain}
              >
                Explain Prediction
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleGenerateReport}
              >
                Generate Report
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setResult(null);
                }}
              >
                New Prediction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
