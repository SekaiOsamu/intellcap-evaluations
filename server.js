const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize DB
const db = new sqlite3.Database('evaluations.db');

// Create table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phoneNumber TEXT NOT NULL,
      emailAddress TEXT NOT NULL,
      team TEXT NOT NULL,
      projectName TEXT NOT NULL,
      teamType TEXT NOT NULL,
      passion INTEGER NOT NULL,
      motivation INTEGER NOT NULL,
      integrity INTEGER NOT NULL,
      originality INTEGER NOT NULL,
      creativity INTEGER NOT NULL,
      feasibility INTEGER NOT NULL,
      scientificValue INTEGER NOT NULL,
      technologicalValue INTEGER NOT NULL,
      impact INTEGER NOT NULL,
      teamSize INTEGER NOT NULL,
      participantQuality INTEGER NOT NULL,
      teamStrengths INTEGER NOT NULL,
      investedEffort INTEGER NOT NULL,
      investedResources INTEGER NOT NULL,
      maturityLevel INTEGER NOT NULL,
      hrNeeds INTEGER NOT NULL,
      investmentNeeds INTEGER NOT NULL,
      businessPlan INTEGER NOT NULL,
      businessModel INTEGER NOT NULL,
      developmentPlanning INTEGER NOT NULL,
      mathematics INTEGER NOT NULL,
      physics INTEGER NOT NULL,
      mechanics INTEGER NOT NULL,
      chemistry INTEGER NOT NULL,
      biology INTEGER NOT NULL,
      algorithmic INTEGER NOT NULL,
      ai INTEGER NOT NULL,
      coding INTEGER NOT NULL,
      financialAnalysis INTEGER NOT NULL,
      marketAnalysis INTEGER NOT NULL,
      strategicPlanning INTEGER NOT NULL,
      projectManagement INTEGER NOT NULL,
      communication INTEGER NOT NULL,
      adaptability INTEGER NOT NULL,
      problemSolving INTEGER NOT NULL,
      teamwork INTEGER NOT NULL,
      criticalThinking INTEGER NOT NULL,
      curiosity INTEGER NOT NULL,
      empathy INTEGER NOT NULL,
      timeManagement INTEGER NOT NULL,
      leadership INTEGER NOT NULL,
      detailOrientation INTEGER NOT NULL,
      design INTEGER NOT NULL,
      intellectualProperty INTEGER NOT NULL,
      ipPatentStatus INTEGER NOT NULL,
      quality INTEGER NOT NULL,
      formalizationCapacity INTEGER NOT NULL,
      projectDetails TEXT,
      expectations TEXT,
      totalScore INTEGER NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Evaluations table ready');
    }
  });
});

// POST route for submitting evaluations
app.post('/submit-evaluation', (req, res) => {
  const data = req.body;
  
  // Validate required fields
  if (!data.firstName || !data.lastName || !data.emailAddress || !data.projectName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

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
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?
    )`;

  const params = [
    data.firstName, data.lastName, data.phoneNumber || '', data.emailAddress, 
    data.team || '', data.projectName, data.teamType || '',
    parseInt(data.passion) || 0, parseInt(data.motivation) || 0, 
    parseInt(data.integrity) || 0, parseInt(data.originality) || 0, 
    parseInt(data.creativity) || 0, parseInt(data.feasibility) || 0,
    parseInt(data.scientificValue) || 0, parseInt(data.technologicalValue) || 0,
    parseInt(data.impact) || 0, parseInt(data.teamSize) || 0,
    parseInt(data.participantQuality) || 0, parseInt(data.teamStrengths) || 0,
    parseInt(data.investedEffort) || 0, parseInt(data.investedResources) || 0,
    parseInt(data.maturityLevel) || 0, parseInt(data.hrNeeds) || 0,
    parseInt(data.investmentNeeds) || 0, parseInt(data.businessPlan) || 0,
    parseInt(data.businessModel) || 0, parseInt(data.developmentPlanning) || 0,
    parseInt(data.mathematics) || 0, parseInt(data.physics) || 0,
    parseInt(data.mechanics) || 0, parseInt(data.chemistry) || 0,
    parseInt(data.biology) || 0, parseInt(data.algorithmic) || 0,
    parseInt(data.ai) || 0, parseInt(data.coding) || 0,
    parseInt(data.financialAnalysis) || 0, parseInt(data.marketAnalysis) || 0,
    parseInt(data.strategicPlanning) || 0, parseInt(data.projectManagement) || 0,
    parseInt(data.communication) || 0, parseInt(data.adaptability) || 0,
    parseInt(data.problemSolving) || 0, parseInt(data.teamwork) || 0,
    parseInt(data.criticalThinking) || 0, parseInt(data.curiosity) || 0,
    parseInt(data.empathy) || 0, parseInt(data.timeManagement) || 0,
    parseInt(data.leadership) || 0, parseInt(data.detailOrientation) || 0,
    parseInt(data.design) || 0, parseInt(data.intellectualProperty) || 0,
    parseInt(data.ipPatentStatus) || 0, parseInt(data.quality) || 0,
    parseInt(data.formalizationCapacity) || 0,
    data.projectDetails || '', data.expectations || '',
    parseInt(data.totalScore) || 0
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ 
        error: 'Database error',
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}/dashboard`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
