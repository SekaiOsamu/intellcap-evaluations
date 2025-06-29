const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;  // Modification pour Render
const HOST = '0.0.0.0';  // Nouveau - nécessaire pour Render

// Middleware (modification CORS uniquement)
app.use(cors({
  origin: [
    'https://intellcap-evaluations.onrender.com',  // Votre URL Render
    'http://localhost:3000'  // Pour développement local
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize DB (identique)
const db = new sqlite3.Database('evaluations.db');

// Create table (identique)
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
)`);

// POST route (identique)
app.post('/submit-evaluation', (req, res) => {
  const data = req.body;
  console.log('Nouvelle évaluation reçue:', data);

  const sql = `
  INSERT INTO evaluations (
    firstName, lastName, phoneNumber, emailAddress, team, projectName, teamType,
    passion, motivation, integrity,
    originality, creativity, feasibility, scientificValue, technologicalValue, impact,
    teamSize, participantQuality, teamStrengths, investedEffort, investedResources,
    maturityLevel, hrNeeds, investmentNeeds,
    businessPlan, businessModel, developmentPlanning,
    mathematics, physics, mechanics, chemistry, biology, algorithmic, ai, coding,
    financialAnalysis, marketAnalysis, strategicPlanning, projectManagement,
    communication, adaptability, problemSolving, teamwork, criticalThinking, curiosity, empathy, timeManagement, leadership, detailOrientation,
    design, intellectualProperty, ipPatentStatus, quality, formalizationCapacity,
    projectDetails, expectations, totalScore
  ) VALUES (
    ?,?,?,?,?,?,?, ?,?,?, ?,?,?,?,?,?, ?,?,?,?, ?,?, ?,?,?, ?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?
  )`;

  const params = [
    data.firstName, data.lastName, data.phoneNumber, data.emailAddress, data.team, data.projectName, data.teamType,
    data.passion, data.motivation, data.integrity,
    data.originality, data.creativity, data.feasibility, data.scientificValue, data.technologicalValue, data.impact,
    data.teamSize, data.participantQuality, data.teamStrengths, data.investedEffort, data.investedResources,
    data.maturityLevel, data.hrNeeds, data.investmentNeeds,
    data.businessPlan, data.businessModel, data.developmentPlanning,
    data.mathematics, data.physics, data.mechanics, data.chemistry, data.biology, data.algorithmic, data.ai, data.coding,
    data.financialAnalysis, data.marketAnalysis, data.strategicPlanning, data.projectManagement,
    data.communication, data.adaptability, data.problemSolving, data.teamwork, data.criticalThinking, data.curiosity, data.empathy, data.timeManagement, data.leadership, data.detailOrientation,
    data.design, data.intellectualProperty, data.ipPatentStatus, data.quality, data.formalizationCapacity,
    data.projectDetails, data.expectations, data.totalScore
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Erreur insertion:', err);
      res.status(500).json({ error: 'Erreur enregistrement' });
    } else {
      res.json({ success: true, id: this.lastID });
    }
  });
});

// GET all evaluations (identique)
app.get('/evaluations', (req, res) => {
  db.all('SELECT * FROM evaluations ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur récupération' });
    } else {
      res.json(rows);
    }
  });
});

// GET one evaluation (identique)
app.get('/evaluations/:id', (req, res) => {
  db.get('SELECT * FROM evaluations WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Erreur récupération' });
    } else if (!row) {
      res.status(404).json({ error: 'Évaluation non trouvée' });
    } else {
      res.json(row);
    }
  });
});

// Export CSV (identique)
app.get('/export-csv', (req, res) => {
  db.all('SELECT * FROM evaluations ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur export' });
    } else if (rows.length === 0) {
      res.status(404).send('Aucune donnée');
    } else {
      const keys = Object.keys(rows[0]);
      let csv = keys.join(',') + '\n';
      rows.forEach(row => {
        const line = keys.map(k => JSON.stringify(row[k] || '')).join(',');
        csv += line + '\n';
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="evaluations.csv"');
      res.send(csv);
    }
  });
});

// Serve dashboard (identique)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Démarrage serveur (modifié pour Render)
app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
});

// Graceful shutdown (identique)
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
