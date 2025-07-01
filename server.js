const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

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
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize DB - Create table if not exists
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(50),
        emailAddress VARCHAR(255) NOT NULL,
        team VARCHAR(255),
        projectName VARCHAR(255) NOT NULL,
        teamType VARCHAR(100),
        passion INTEGER NOT NULL DEFAULT 0,
        motivation INTEGER NOT NULL DEFAULT 0,
        integrity INTEGER NOT NULL DEFAULT 0,
        originality INTEGER NOT NULL DEFAULT 0,
        creativity INTEGER NOT NULL DEFAULT 0,
        feasibility INTEGER NOT NULL DEFAULT 0,
        scientificValue INTEGER NOT NULL DEFAULT 0,
        technologicalValue INTEGER NOT NULL DEFAULT 0,
        impact INTEGER NOT NULL DEFAULT 0,
        teamSize INTEGER NOT NULL DEFAULT 0,
        participantQuality INTEGER NOT NULL DEFAULT 0,
        teamStrengths INTEGER NOT NULL DEFAULT 0,
        investedEffort INTEGER NOT NULL DEFAULT 0,
        investedResources INTEGER NOT NULL DEFAULT 0,
        maturityLevel INTEGER NOT NULL DEFAULT 0,
        hrNeeds INTEGER NOT NULL DEFAULT 0,
        investmentNeeds INTEGER NOT NULL DEFAULT 0,
        businessPlan INTEGER NOT NULL DEFAULT 0,
        businessModel INTEGER NOT NULL DEFAULT 0,
        developmentPlanning INTEGER NOT NULL DEFAULT 0,
        mathematics INTEGER NOT NULL DEFAULT 0,
        physics INTEGER NOT NULL DEFAULT 0,
        mechanics INTEGER NOT NULL DEFAULT 0,
        chemistry INTEGER NOT NULL DEFAULT 0,
        biology INTEGER NOT NULL DEFAULT 0,
        algorithmic INTEGER NOT NULL DEFAULT 0,
        ai INTEGER NOT NULL DEFAULT 0,
        coding INTEGER NOT NULL DEFAULT 0,
        financialAnalysis INTEGER NOT NULL DEFAULT 0,
        marketAnalysis INTEGER NOT NULL DEFAULT 0,
        strategicPlanning INTEGER NOT NULL DEFAULT 0,
        projectManagement INTEGER NOT NULL DEFAULT 0,
        communication INTEGER NOT NULL DEFAULT 0,
        adaptability INTEGER NOT NULL DEFAULT 0,
        problemSolving INTEGER NOT NULL DEFAULT 0,
        teamwork INTEGER NOT NULL DEFAULT 0,
        criticalThinking INTEGER NOT NULL DEFAULT 0,
        curiosity INTEGER NOT NULL DEFAULT 0,
        empathy INTEGER NOT NULL DEFAULT 0,
        timeManagement INTEGER NOT NULL DEFAULT 0,
        leadership INTEGER NOT NULL DEFAULT 0,
        detailOrientation INTEGER NOT NULL DEFAULT 0,
        design INTEGER NOT NULL DEFAULT 0,
        intellectualProperty INTEGER NOT NULL DEFAULT 0,
        ipPatentStatus INTEGER NOT NULL DEFAULT 0,
        quality INTEGER NOT NULL DEFAULT 0,
        formalizationCapacity INTEGER NOT NULL DEFAULT 0,
        projectDetails TEXT,
        expectations TEXT,
        totalScore INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('Evaluations table ready (PostgreSQL)');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

// Initialize database on startup
initializeDatabase();

// Test endpoints for debugging
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL'
  });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM evaluations');
    res.json({ 
      message: 'Database connected successfully (PostgreSQL)',
      recordCount: parseInt(result.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Database connection failed',
      message: err.message 
    });
  }
});

app.get('/debug-schema', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'evaluations' 
      ORDER BY ordinal_position
    `);
    const columns = result.rows.map(row => row.column_name);
    res.json({
      totalColumns: columns.length,
      columns: columns,
      columnsWithoutId: columns.filter(col => col !== 'id' && col !== 'created_at'),
      insertableColumns: columns.filter(col => col !== 'id' && col !== 'created_at').length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route for submitting evaluations
app.post('/submit-evaluation', async (req, res) => {
  console.log('Received evaluation submission:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    contentType: req.headers['content-type'],
    bodyKeys: Object.keys(req.body || {}),
    bodyKeysCount: Object.keys(req.body || {}).length
  });

  const data = req.body;
  
  console.log('Form data received:', {
    firstName: data.firstName,
    lastName: data.lastName,
    emailAddress: data.emailAddress,
    projectName: data.projectName,
    acknowledgment: data.acknowledgment,
    captchaInput: data.captchaInput
  });
  
  // Validate required fields
  if (!data.firstName || !data.lastName || !data.emailAddress || !data.projectName) {
    console.error('Missing required fields:', {
      firstName: !!data.firstName,
      lastName: !!data.lastName,
      emailAddress: !!data.emailAddress,
      projectName: !!data.projectName
    });
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['firstName', 'lastName', 'emailAddress', 'projectName']
    });
  }

  // PostgreSQL SQL with numbered parameters
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
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
      $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, 
      $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, 
      $51, $52, $53, $54, $55, $56, $57
    ) RETURNING id`;

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

  console.log('Attempting database insert...');
  console.log('Params count:', params.length);
  
  try {
    const result = await pool.query(sql, params);
    console.log('Evaluation submitted successfully, ID:', result.rows[0].id);
    res.json({ 
      success: true, 
      id: result.rows[0].id,
      message: 'Evaluation submitted successfully'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Database error',
      message: err.message,
      code: err.code || 'UNKNOWN'
    });
  }
});

// GET all evaluations (for dashboard)
app.get('/evaluations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM evaluations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving evaluations:', err);
    res.status(500).json({ error: 'Error retrieving evaluations' });
  }
});

// GET single evaluation (detailed view)
app.get('/evaluations/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM evaluations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Evaluation not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error retrieving evaluation:', err);
    res.status(500).json({ error: 'Error retrieving evaluation' });
  }
});

// GET evaluation metrics (organized by category)
app.get('/evaluation-metrics/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM evaluations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Evaluation not found' });
    } else {
      const row = result.rows[0];
      // Same organization logic as before
      const metrics = {
        personalInfo: {
          firstName: row.firstname,
          lastName: row.lastname,
          email: row.emailaddress,
          phone: row.phonenumber,
          team: row.team,
          project: row.projectname,
          teamType: row.teamtype
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
          scientificValue: row.scientificvalue,
          technologicalValue: row.technologicalvalue,
          impact: row.impact
        },
        teamComposition: {
          teamSize: row.teamsize,
          participantQuality: row.participantquality,
          teamStrengths: row.teamstrengths,
          investedEffort: row.investedeffort,
          investedResources: row.investedresources
        },
        projectMaturity: {
          maturityLevel: row.maturitylevel,
          hrNeeds: row.hrneeds,
          investmentNeeds: row.investmentneeds
        },
        businessDevelopment: {
          businessPlan: row.businessplan,
          businessModel: row.businessmodel,
          developmentPlanning: row.developmentplanning
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
          financialAnalysis: row.financialanalysis,
          marketAnalysis: row.marketanalysis,
          strategicPlanning: row.strategicplanning,
          projectManagement: row.projectmanagement
        },
        softSkills: {
          communication: row.communication,
          adaptability: row.adaptability,
          problemSolving: row.problemsolving,
          teamwork: row.teamwork,
          criticalThinking: row.criticalthinking,
          curiosity: row.curiosity,
          empathy: row.empathy,
          timeManagement: row.timemanagement,
          leadership: row.leadership,
          detailOrientation: row.detailorientation
        },
        additionalCriteria: {
          design: row.design,
          intellectualProperty: row.intellectualproperty,
          ipPatentStatus: row.ippatentStatus,
          quality: row.quality,
          formalizationCapacity: row.formalizationcapacity
        },
        projectDetails: row.projectdetails || '',
        expectations: row.expectations || '',
        totalScore: row.totalscore,
        createdAt: row.created_at
      };
      res.json(metrics);
    }
  } catch (err) {
    console.error('Error retrieving evaluation metrics:', err);
    res.status(500).json({ error: 'Error retrieving evaluation metrics' });
  }
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Export CSV
app.get('/export-csv', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM evaluations ORDER BY created_at DESC');
    if (result.rows.length === 0) {
      res.status(404).send('No data available');
    } else {
      const keys = Object.keys(result.rows[0]);
      let csv = keys.join(',') + '\n';
      result.rows.forEach(row => {
        const line = keys.map(k => `"${(row[k] || '').toString().replace(/"/g, '""')}"`).join(',');
        csv += line + '\n';
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="evaluations.csv"');
      res.send(csv);
    }
  } catch (err) {
    console.error('Error exporting data:', err);
    res.status(500).json({ error: 'Error exporting data' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Evaluation API Server (PostgreSQL)',
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
  console.log('Database: PostgreSQL');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

