// ResultCard component: Display prediction results with grade badge and confidence
interface PredictionResult {
  grade: string;
  confidence: number;
  probabilities: Record<string, number>;
}

interface ResultCardProps {
  result: PredictionResult;
}

function ResultCard({ result }: ResultCardProps) {
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

  const getGradeLabel = (grade: string): string => {
    const labelMap: Record<string, string> = {
      '0': 'No DR',
      '1': 'Mild NPDR',
      '2': 'Moderate NPDR',
      '3': 'Severe NPDR',
      '4': 'PDR',
    };
    return labelMap[grade] || 'Unknown';
  };

  return (
    <div className="result-card fade-in">
      <h2>Prediction Result</h2>

      <div className="result-main">
        <div className={`grade-badge-large ${getGradeColor(result.grade)}`}>
          <div className="grade-number">{result.grade}</div>
          <div className="grade-label">{getGradeLabel(result.grade)}</div>
        </div>

        <div className="result-confidence">
          <h3>Confidence Score</h3>
          <div className="confidence-value">
            {(result.confidence * 100).toFixed(1)}%
          </div>
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${result.confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="result-probabilities">
        <h3>Probability Distribution</h3>
        <div className="probabilities-list">
          {Object.entries(result.probabilities).map(([grade, prob]) => (
            <div key={grade} className="probability-item">
              <div className="probability-label">
                <span className="prob-grade">Grade {grade}</span>
                <span className="prob-value">
                  {(prob * 100).toFixed(1)}%
                </span>
              </div>
              <div className="probability-bar">
                <div
                  className={`probability-fill ${getGradeColor(grade)}`}
                  style={{ width: `${prob * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
