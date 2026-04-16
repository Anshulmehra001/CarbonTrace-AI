import React, { useState } from 'react';
import axios from 'axios';
import './Reports.css';

const API_URL = 'http://localhost:8000';

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);

      const response = await axios.get(`${API_URL}/api/reports/generate?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReport(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const reportText = JSON.stringify(report, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbontrace-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>ESG Reports</h1>
        <p>Generate comprehensive carbon footprint reports</p>
      </div>

      <div className="report-generator">
        <h2>Generate Report</h2>
        <div className="date-range-selector">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
            />
          </div>
          <button 
            onClick={handleGenerate} 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {report && (
        <div className="report-content">
          <div className="report-header-section">
            <h2>Carbon Footprint Report</h2>
            <button onClick={handleDownload} className="btn-secondary">
              Download JSON
            </button>
          </div>

          <div className="report-section">
            <h3>Report Period</h3>
            <p><strong>Start:</strong> {report.period.start}</p>
            <p><strong>End:</strong> {report.period.end}</p>
            <p><strong>Generated:</strong> {new Date(report.report_date).toLocaleString()}</p>
          </div>

          <div className="report-section">
            <h3>Summary</h3>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-label">Total Emissions</div>
                <div className="summary-value">{report.summary.total_emissions_kg} kg</div>
                <div className="summary-sublabel">{report.summary.total_emissions_tonnes} tonnes</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Total Activities</div>
                <div className="summary-value">{report.summary.total_activities}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Average per Activity</div>
                <div className="summary-value">{report.summary.average_per_activity} kg</div>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h3>Breakdown by Category</h3>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Activities</th>
                  <th>Emissions (kg CO₂)</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.breakdown).map(([category, data]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{data.count}</td>
                    <td>{data.emissions_kg}</td>
                    <td>{((data.emissions_kg / report.summary.total_emissions_kg) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {report.recommendations && report.recommendations.length > 0 && (
            <div className="report-section">
              <h3>AI-Powered Recommendations</h3>
              <div className="recommendations-list">
                {report.recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                    <div className="rec-header">
                      <span className={`priority-badge ${rec.priority}`}>
                        {rec.priority} priority
                      </span>
                      <span className="rec-category">{rec.category}</span>
                    </div>
                    <p className="rec-text">{rec.recommendation}</p>
                    {rec.potential_reduction && (
                      <div className="rec-impact">
                        <span>Potential Reduction: {rec.potential_reduction}</span>
                        {rec.estimated_savings_kg && (
                          <span>Est. Savings: {rec.estimated_savings_kg} kg CO₂</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="report-section">
            <h3>Compliance Information</h3>
            <p>This report follows the GHG Protocol standards and can be used for:</p>
            <ul>
              <li>EU Corporate Sustainability Reporting Directive (CSRD)</li>
              <li>SEC Climate Disclosure Rule</li>
              <li>ISO 14064 Greenhouse Gas Accounting</li>
              <li>CDP (Carbon Disclosure Project) Reporting</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
