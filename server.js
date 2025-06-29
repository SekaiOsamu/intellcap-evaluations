const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Improved CORS configuration
const corsOptions = {
  origin: [
    'https://intellcap-evaluations.onrender.com',
    'http://localhost:3001',
    'https://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// DB setup with error handling
const dbPath = path.join(__dirname, 'evaluations.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to database at:', dbPath);
  }
});

// Simplified table creation with only the columns you're actually using
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phoneNumber TEXT,
      emailAddress TEXT NOT NULL,
      team TEXT,
      projectName TEXT NOT NULL,
      teamType TEXT,
      passion INTEGER,
      motivation INTEGER,
      integrity INTEGER,
      originality INTEGER,
      creativity INTEGER,
      feasibility INTEGER,
      scientificValue INTEGER,
      technologicalValue INTEGER,
      impact INTEGER,
      teamSize INTEGER,
      participantQuality INTEGER,
      teamStrengths INTEGER,
      investedEffort INTEGER,
      investedResources INTEGER,
      maturityLevel INTEGER,
      hrNeeds INTEGER,
      investmentNeeds INTEGER,
      businessPlan INTEGER,
      businessModel INTEGER,
      developmentPlanning INTEGER,
      mathematics INTEGER,
      physics INTEGER,
      mechanics INTEGER,
      chemistry INTEGER,
      biology INTEGER,
      algorithmic INTEGER,
      ai INTEGER,
      coding INTEGER,
      financialAnalysis INTEGER,
      marketAnalysis INTEGER,
      strategicPlanning INTEGER,
      projectManagement INTEGER,
      communication INTEGER,
      adaptability INTEGER,
      problemSolving INTEGER,
      teamwork INTEGER,
      criticalThinking INTEGER,
      curiosity INTEGER,
      empathy INTEGER,
      timeManagement INTEGER,
      leadership INTEGER,
      detailOrientation INTEGER,
      design INTEGER,
      intellectualProperty INTEGER,
      ipPatentStatus INTEGER,
      quality INTEGER,
      formalizationCapacity INTEGER,
      projectDetails TEXT,
      expectations TEXT,
      totalScore INTEGER
    )
  `, (err) => {
    if (err) {
      console.error('Table creation error:', err);
    } else {
      console.log('Evaluations table ready');
    }
  });
});

// POST route with simplified data handling
app.post('/submit-evaluation', (req, res) => {
  const data = req.body;
  
  // Validate required fields
  if (!data.firstName || !data.lastName || !data.emailAddress || !data.projectName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simplified SQL with only the fields you're actually sending
  const sql = `
    INSERT INTO evaluations (
      firstName, lastName, phoneNumber, emailAddress, team, projectName, teamType,
      passion, motivation, integrity, originality, creativity, feasibility,
      scientificValue, technologicalValue, impact, teamSize, participantQuality,
      teamStrengths, investedEffort, investedResources, maturityLevel, hrNeeds,
      investmentNeeds, businessPlan, businessModel, developmentPlanning, mathematics,
      physics, mechanics, chemistry, biology, algorithmic, ai, coding, financialAnalysis,
      marketAnalysis, strategicPlanning, projectManagement, communication, adaptability,
      problemSolving, teamwork, criticalThinking, curiosity, empathy, timeManagement,
      leadership, detailOrientation, design, intellectualProperty, ipPatentStatus,
      quality, formalizationCapacity, projectDetails, expectations, totalScore
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?
    )`;

  const params = [
    data.firstName, data.lastName, data.phoneNumber || '', data.emailAddress, 
    data.team || '', data.projectName, data.teamType || '',
    data.passion || 0, data.motivation || 0, 
    data.integrity || 0, data.originality || 0, 
    data.creativity || 0, data.feasibility || 0,
    data.scientificValue || 0, data.technologicalValue || 0,
    data.impact || 0, data.teamSize || 0,
    data.participantQuality || 0, data.teamStrengths || 0,
    data.investedEffort || 0, data.investedResources || 0,
    data.maturityLevel || 0, data.hrNeeds || 0,
    data.investmentNeeds || 0, data.businessPlan || 0,
    data.businessModel || 0, data.developmentPlanning || 0,
    data.mathematics || 0, data.physics || 0,
    data.mechanics || 0, data.chemistry || 0,
    data.biology || 0, data.algorithmic || 0,
    data.ai || 0, data.coding || 0,
    data.financialAnalysis || 0, data.marketAnalysis || 0,
    data.strategicPlanning || 0, data.projectManagement || 0,
    data.communication || 0, data.adaptability || 0,
    data.problemSolving || 0, data.teamwork || 0,
    data.criticalThinking || 0, data.curiosity || 0,
    data.empathy || 0, data.timeManagement || 0,
    data.leadership || 0, data.detailOrientation || 0,
    data.design || 0, data.intellectualProperty || 0,
    data.ipPatentStatus || 0, data.quality || 0,
    data.formalizationCapacity || 0,
    data.projectDetails || '', data.expectations || '',
    data.totalScore || 0
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ 
        error: 'Error submitting evaluation',
        details: err.message
      });
    } else {
      res.json({ 
        success: true, 
        id: this.lastID,
        message: 'Evaluation submitted successfully'
      });
    }
  });
});
// GET all evaluations (for dashboard)
app.get('/evaluations', (req, res) => {
  db.all('SELECT * FROM evaluations ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error retrieving evaluations:', err);
      res.status(500).json({ error: 'Error retrieving evaluations' });
    } else {
      res.json(rows);
    }
  });
});

// GET single evaluation (detailed view)
app.get('/evaluations/:id', (req, res) => {
  db.get('SELECT * FROM evaluations WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error retrieving evaluation:', err);
      res.status(500).json({ error: 'Error retrieving evaluation' });
    } else if (!row) {
      res.status(404).json({ error: 'Evaluation not found' });
    } else {
      res.json(row);
    }
  });
});

// GET evaluation metrics (organized by category)
app.get('/evaluation-metrics/:id', (req, res) => {
  db.get('SELECT * FROM evaluations WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error retrieving evaluation metrics:', err);
      res.status(500).json({ error: 'Error retrieving evaluation metrics' });
    } else if (!row) {
      res.status(404).json({ error: 'Evaluation not found' });
    } else {
      // Organize metrics by category
      const metrics = {
        personalInfo: {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.emailAddress,
          phone: row.phoneNumber,
          team: row.team,
          project: row.projectName,
          teamType: row.teamType
        },
        keyQualities: {
          passion: row.passion,
          motivation: row.motivation,
          integrity: row.integrity
        },
        projectEvaluation: {
          originality: row.originality,
          creativity: row.creativity,
          feasibility: row.feasibility,
          scientificValue: row.scientificValue,
          technologicalValue: row.technologicalValue,
          impact: row.impact
        },
        teamComposition: {
          teamSize: row.teamSize,
          participantQuality: row.participantQuality,
          teamStrengths: row.teamStrengths,
          investedEffort: row.investedEffort,
          investedResources: row.investedResources
        },
        projectMaturity: {
          maturityLevel: row.maturityLevel,
          hrNeeds: row.hrNeeds,
          investmentNeeds: row.investmentNeeds
        },
        businessDevelopment: {
          businessPlan: row.businessPlan,
          businessModel: row.businessModel,
          developmentPlanning: row.developmentPlanning
        },
        technicalSkills: {
          mathematics: row.mathematics,
          physics: row.physics,
          mechanics: row.mechanics,
          chemistry: row.chemistry,
          biology: row.biology,
          algorithmic: row.algorithmic,
          ai: row.ai,
          coding: row.coding
        },
        businessSkills: {
          financialAnalysis: row.financialAnalysis,
          marketAnalysis: row.marketAnalysis,
          strategicPlanning: row.strategicPlanning,
          projectManagement: row.projectManagement
        },
        softSkills: {
          communication: row.communication,
          adaptability: row.adaptability,
          problemSolving: row.problemSolving,
          teamwork: row.teamwork,
          criticalThinking: row.criticalThinking,
          curiosity: row.curiosity,
          empathy: row.empathy,
          timeManagement: row.timeManagement,
          leadership: row.leadership,
          detailOrientation: row.detailOrientation
        },
        additionalCriteria: {
          design: row.design,
          intellectualProperty: row.intellectualProperty,
          ipPatentStatus: row.ipPatentStatus,
          quality: row.quality,
          formalizationCapacity: row.formalizationCapacity
        },
        projectDetails: row.projectDetails || '',
        expectations: row.expectations || '',
        totalScore: row.totalScore,
        createdAt: row.created_at
      };
      res.json(metrics);
    }
  });
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Export CSV
app.get('/export-csv', (req, res) => {
  db.all('SELECT * FROM evaluations ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error exporting data:', err);
      res.status(500).json({ error: 'Error exporting data' });
    } else if (rows.length === 0) {
      res.status(404).send('No data available');
    } else {
      const keys = Object.keys(rows[0]);
      let csv = keys.join(',') + '\n';
      rows.forEach(row => {
        const line = keys.map(k => `"${(row[k] || '').toString().replace(/"/g, '""')}"`).join(',');
        csv += line + '\n';
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="evaluations.csv"');
      res.send(csv);
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Evaluation API Server',
    endpoints: {
      test: '/test',
      testDb: '/test-db',
      submit: 'POST /submit-evaluation',
      evaluations: '/evaluations',
      dashboard: '/dashboard',
      export: '/export-csv'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}/dashboard`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
