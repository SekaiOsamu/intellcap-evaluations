-- Base de données SQLite pour le formulaire INTELLCAP
-- Fichier: database.sql

CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Informations personnelles
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    emailAddress TEXT NOT NULL,
    team TEXT NOT NULL,
    projectName TEXT NOT NULL,
    teamType TEXT NOT NULL,
    
    -- Key Qualities
    passion INTEGER NOT NULL,
    motivation INTEGER NOT NULL,
    integrity INTEGER NOT NULL,
    
    -- Project Evaluation
    originality INTEGER NOT NULL,
    creativity INTEGER NOT NULL,
    feasibility INTEGER NOT NULL,
    scientificValue INTEGER NOT NULL,
    technologicalValue INTEGER NOT NULL,
    impact INTEGER NOT NULL,
    
    -- Team Composition and Resources
    teamSize INTEGER NOT NULL,
    participantQuality INTEGER NOT NULL,
    teamStrengths INTEGER NOT NULL,
    investedEffort INTEGER NOT NULL,
    investedResources INTEGER NOT NULL,
    
    -- Project Maturity
    maturityLevel INTEGER NOT NULL,
    hrNeeds INTEGER NOT NULL,
    investmentNeeds INTEGER NOT NULL,
    
    -- Business Development
    businessPlan INTEGER NOT NULL,
    businessModel INTEGER NOT NULL,
    developmentPlanning INTEGER NOT NULL,
    
    -- Technical Skills
    mathematics INTEGER NOT NULL,
    physics INTEGER NOT NULL,
    mechanics INTEGER NOT NULL,
    chemistry INTEGER NOT NULL,
    biology INTEGER NOT NULL,
    algorithmic INTEGER NOT NULL,
    ai INTEGER NOT NULL,
    coding INTEGER NOT NULL,
    
    -- Economics and Business Administration Skills
    financialAnalysis INTEGER NOT NULL,
    marketAnalysis INTEGER NOT NULL,
    strategicPlanning INTEGER NOT NULL,
    projectManagement INTEGER NOT NULL,
    
    -- Soft Skills
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
    
    -- Additional Criteria
    design INTEGER NOT NULL,
    intellectualProperty INTEGER NOT NULL,
    ipPatentStatus INTEGER NOT NULL,
    quality INTEGER NOT NULL,
    formalizationCapacity INTEGER NOT NULL,
    
    -- Project Details
    projectDetails TEXT,
    expectations TEXT,
    
    -- Score
    totalScore INTEGER NOT NULL
);
