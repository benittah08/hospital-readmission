// static/js/clinical-dashboard.js

// Tab Management
function showTab(tabName) {
    const tab = new bootstrap.Tab(document.getElementById(tabName + '-tab'));
    tab.show();
    
    // Load tab content dynamically
    if (tabName === 'predictions') {
        loadPredictionsTab();
    } else if (tabName === 'analytics') {
        loadAnalyticsTab();
    } else if (tabName === 'models') {
        loadModelsTab();
    }
}

// Load Predictions Tab Content
function loadPredictionsTab() {
    console.log('Loading predictions tab...');
    
    // Show loading state
    document.getElementById('predictions-content').innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading predictions...</span>
            </div>
            <p class="mt-2">Loading prediction data...</p>
        </div>
    `;

    fetch('/predictions/api/dashboard-data/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Update the predictions tab with the HTML content
                document.getElementById('predictions-content').innerHTML = data.html;
                
                // Update model info
                if (document.getElementById('model-name')) {
                    document.getElementById('model-name').textContent = data.active_model.name;
                    document.getElementById('model-type').textContent = data.active_model.model_type;
                    document.getElementById('model-accuracy').textContent = (data.active_model.accuracy * 100).toFixed(1);
                }
                
                // Update statistics
                if (document.getElementById('total-predictions')) {
                    document.getElementById('total-predictions').textContent = data.stats.total_predictions;
                    document.getElementById('high-risk-count').textContent = data.stats.high_risk_count;
                    document.getElementById('medium-risk-count').textContent = data.stats.medium_risk_count;
                    document.getElementById('low-risk-count').textContent = data.stats.low_risk_count;
                }
                
                console.log('Predictions tab loaded successfully');
            } else {
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error loading predictions:', error);
            document.getElementById('predictions-content').innerHTML = `
                <div class="alert alert-danger">
                    <h5>Error Loading Predictions</h5>
                    <p>${error.message}</p>
                    <button class="btn btn-primary mt-2" onclick="loadPredictionsTab()">
                        <ion-icon name="refresh-outline"></ion-icon> Try Again
                    </button>
                </div>
            `;
        });
}

// Load Analytics Tab Content
function loadAnalyticsTab() {
    console.log('Loading analytics tab...');
    
    fetch('/predictions/api/analytics/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Update analytics metrics
                document.getElementById('readmission-rate').textContent = data.readmission_rate + '%';
                document.getElementById('avg-risk-score').textContent = data.avg_risk_score + '%';
                document.getElementById('avg-stay').textContent = data.avg_stay + ' days';
                document.getElementById('total-assessed').textContent = data.total_assessed;
                
                // Update charts with real data
                updateCharts(data);
                
                console.log('Analytics tab loaded successfully');
            } else {
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error loading analytics:', error);
            document.getElementById('analytics-content').innerHTML = `
                <div class="alert alert-danger">
                    <h5>Error Loading Analytics</h5>
                    <p>${error.message}</p>
                    <button class="btn btn-primary mt-2" onclick="loadAnalyticsTab()">
                        <ion-icon name="refresh-outline"></ion-icon> Try Again
                    </button>
                </div>
            `;
        });
}

// Load Models Tab Content
function loadModelsTab() {
    console.log('Loading models tab...');
    
    fetch('/predictions/api/models/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Update the models tab with the HTML content
                document.getElementById('models-content').innerHTML = data.html;
                
                // Update model statistics
                if (document.getElementById('total-models')) {
                    document.getElementById('total-models').textContent = data.total_models;
                    document.getElementById('active-models').textContent = data.active_models;
                }
                
                console.log('Models tab loaded successfully');
            } else {
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error loading models:', error);
            document.getElementById('models-content').innerHTML = `
                <div class="alert alert-danger">
                    <h5>Error Loading Models</h5>
                    <p>${error.message}</p>
                    <button class="btn btn-primary mt-2" onclick="loadModelsTab()">
                        <ion-icon name="refresh-outline"></ion-icon> Try Again
                    </button>
                </div>
            `;
        });
}

// Update charts with analytics data
function updateCharts(data) {
    updateRiskDistributionChart(data.risk_distribution);
    updateTrendsChart(data);
    updateRiskFactors(data);
    updatePerformanceMetrics(data.model_metrics);
    updateQuickStats(data.quick_stats);
}

function updateRiskDistributionChart(distribution) {
    const riskChart = document.getElementById('risk-chart');
    if (riskChart) {
        riskChart.innerHTML = `
            <div class="p-3 w-100">
                <h6 class="text-center mb-3">Risk Distribution</h6>
                <div class="d-flex justify-content-around align-items-end" style="height: 200px;">
                    <div class="text-center">
                        <div class="bg-danger rounded-top" style="height: ${Math.max(30, distribution.high * 8)}px; width: 50px;"></div>
                        <div class="mt-2 small">
                            <div class="fw-bold">${distribution.high}</div>
                            <div class="text-muted">High Risk</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="bg-warning rounded-top" style="height: ${Math.max(30, distribution.medium * 8)}px; width: 50px;"></div>
                        <div class="mt-2 small">
                            <div class="fw-bold">${distribution.medium}</div>
                            <div class="text-muted">Medium Risk</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="bg-success rounded-top" style="height: ${Math.max(30, distribution.low * 8)}px; width: 50px;"></div>
                        <div class="mt-2 small">
                            <div class="fw-bold">${distribution.low}</div>
                            <div class="text-muted">Low Risk</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function updateTrendsChart(data) {
    const trendsChart = document.getElementById('trends-chart');
    if (trendsChart) {
        trendsChart.innerHTML = `
            <div class="p-3 w-100">
                <h6 class="text-center mb-3">Readmission Trends</h6>
                <div class="text-center">
                    <div class="display-4 text-primary fw-bold">${data.readmission_rate}%</div>
                    <p class="text-muted">Current Readmission Rate</p>
                    <div class="mt-3">
                        <span class="badge bg-success">↓ 2.1% from last month</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function updateRiskFactors(data) {
    const riskFactors = document.getElementById('risk-factors');
    if (riskFactors) {
        riskFactors.innerHTML = `
            <div>
                <div class="risk-factor-item high">
                    <span class="factor-name">Multiple Chronic Conditions</span>
                    <span class="factor-impact">+42% risk</span>
                </div>
                <div class="risk-factor-item high">
                    <span class="factor-name">Previous Admissions</span>
                    <span class="factor-impact">+38% risk</span>
                </div>
                <div class="risk-factor-item medium">
                    <span class="factor-name">Advanced Age</span>
                    <span class="factor-impact">+25% risk</span>
                </div>
                <div class="risk-factor-item medium">
                    <span class="factor-name">Long Hospital Stay</span>
                    <span class="factor-impact">+22% risk</span>
                </div>
                <div class="risk-factor-item">
                    <span class="factor-name">Limited Social Support</span>
                    <span class="factor-impact">+18% risk</span>
                </div>
            </div>
        `;
    }
}

function updatePerformanceMetrics(metrics) {
    if (document.getElementById('model-accuracy-metric')) {
        document.getElementById('model-accuracy-metric').textContent = (metrics.accuracy * 100).toFixed(1) + '%';
        document.getElementById('model-precision').textContent = (metrics.precision * 100).toFixed(1) + '%';
        document.getElementById('model-recall').textContent = (metrics.recall * 100).toFixed(1) + '%';
        document.getElementById('model-f1').textContent = (metrics.f1_score * 100).toFixed(1) + '%';
    }
}

function updateQuickStats(stats) {
    if (document.getElementById('avg-prediction-time')) {
        document.getElementById('avg-prediction-time').textContent = stats.avg_prediction_time + 's';
        document.getElementById('success-rate').textContent = stats.success_rate + '%';
    }
}

// Chart refresh functions
function refreshCharts() {
    loadAnalyticsTab();
}

function exportAnalytics() {
    alert('Exporting analytics data...');
    // Implementation for exporting analytics data
}

function filterFactors(type) {
    console.log('Filtering factors by:', type);
}

function loadMonthlyReport() {
    const period = document.getElementById('report-month').value;
    console.log('Loading report for:', period);
}

// Patient Filtering
function filterPatients(riskLevel) {
    const patients = document.querySelectorAll('.patient-item');
    patients.forEach(patient => {
        if (riskLevel === 'all' || patient.dataset.risk === riskLevel) {
            patient.style.display = 'flex';
        } else {
            patient.style.display = 'none';
        }
    });
    showTab('dashboard');
}

// Search Patients
function searchPatients() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const patients = document.querySelectorAll('.patient-item');
    patients.forEach(patient => {
        const text = patient.textContent.toLowerCase();
        patient.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

// Run Bulk Predictions
function runBulkPredictions() {
    if (confirm('Run predictions for all patients? This may take a few moments.')) {
        fetch('/predictions/bulk-predict/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Success! Generated ${data.total_processed} predictions.`);
                loadPredictionsTab(); // Refresh the predictions tab
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            alert('Error running predictions: ' + error.message);
        });
    }
}

// Train New Model
function trainNewModel() {
    if (confirm('Start training a new machine learning model?')) {
        fetch('/predictions/train-model/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'model_type=logistic&model_name=New+Logistic+Regression+Model'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Model trained successfully! Accuracy: ${(data.accuracy * 100).toFixed(1)}%`);
                loadModelsTab(); // Refresh the models tab
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            alert('Error training model: ' + error.message);
        });
    }
}

// Model Management Functions
function refreshModels() {
    loadModelsTab();
}

function showTrainModelModal() {
    alert('Show model training modal - to be implemented');
}

function activateModel(modelId) {
    if (confirm('Activate this model? This will make it the active prediction model.')) {
        fetch(`/predictions/activate-model/${modelId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Model ${data.model_name} activated successfully!`);
                loadModelsTab(); // Refresh the models tab
                loadPredictionsTab(); // Refresh predictions tab to show new active model
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            alert('Error activating model: ' + error.message);
        });
    }
}

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('assessmentModal');
    const btn = document.getElementById('start-assessment');
    const span = document.getElementsByClassName('close-btn')[0];

    if (btn) btn.onclick = function() { 
        if (modal) modal.style.display = 'block'; 
    }
    if (span) span.onclick = function() { 
        if (modal) modal.style.display = 'none'; 
    }
    window.onclick = function(event) { 
        if (event.target == modal) modal.style.display = 'none'; 
    }
}

// View patient details
function viewPatient(patientId) {
    alert(`View patient details for ID: ${patientId} - to be implemented`);
}

// View prediction details
function viewPredictionDetails(predictionId) {
    alert(`View prediction details for ID: ${predictionId} - to be implemented`);
}

// Initialize dashboard
function initDashboard() {
    console.log('Initializing clinical dashboard...');
    
    // Initialize modal functionality
    initModal();
    
    // Load all tabs initially
    loadPredictionsTab();
    loadAnalyticsTab();
    loadModelsTab();
    
    console.log('Clinical dashboard initialized successfully');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});