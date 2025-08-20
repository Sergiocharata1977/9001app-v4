const { createClient } = require('@libsql/client');

// Configuración de la base de datos isoflow4
const tursoClient = createClient({
  url: 'libsql://isoflow4-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTU2OTAwMDYsImlkIjoiYjRjZTU4MWItZjc3Yy00OTY4LTgxODYtNjEwM2E4MmY0NWQxIiwicmlkIjoiMmI4MTUwOWEtYWQ2Yy00NThkLTg2OTMtYjQ3ZDQ1OWFkYWNiIn0.hs83X428FW-ZjxGvLZ1eWE6Gjp4JceY2e88VDSAgaLHOxVe-IntR-S_-bQoyA-UnMnoFYJtP-PiktziqDMOVDw'
});

module.exports = tursoClient;
