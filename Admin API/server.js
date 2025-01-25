const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

const RESPONSES_DIR = path.join(__dirname, 'responses');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Create directories if needed
[RESPONSES_DIR, TEMPLATES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

let apis = [];
let idCounter = 1;

// Management API
app.get('/management/apis', (req, res) => res.json(apis));

app.post('/management/apis', (req, res) => {
  try {
    const apiConfig = req.body;
    
    // Validate file existence
    if (apiConfig.responseType === 'template') {
      const templatePath = path.join(TEMPLATES_DIR, apiConfig.templateFile);
      if (!fs.existsSync(templatePath)) {
        fs.writeFileSync(templatePath, apiConfig.templateContent);
      }
    } else {
      const filePath = path.join(RESPONSES_DIR, apiConfig.responseFile);
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Response file not found' });
      }
    }

    const newApi = {
      id: idCounter++,
      ...apiConfig,
      responseStatus: parseInt(apiConfig.responseStatus) || 200,
      active: apiConfig.active !== undefined ? apiConfig.active : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    apis.push(newApi);
    res.status(201).json(newApi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/management/apis/:id', (req, res) => {
  try {
    const index = apis.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'API not found' });

    const apiConfig = req.body;
    const existingApi = apis[index];

    // Update template file if changed
    if (apiConfig.responseType === 'template') {
      const templatePath = path.join(TEMPLATES_DIR, apiConfig.templateFile);
      if (apiConfig.templateFile !== existingApi.templateFile || 
          apiConfig.templateContent !== existingApi.templateContent) {
        fs.writeFileSync(templatePath, apiConfig.templateContent);
      }
    }

    apis[index] = { ...existingApi, ...apiConfig, updatedAt: new Date() };
    res.json(apis[index]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/management/apis/:id', (req, res) => {
  const index = apis.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'API not found' });
  apis.splice(index, 1);
  res.sendStatus(204);
});

// API Request Handling
app.use((req, res, next) => {
  const api = apis.find(a => 
    a.endpoint === req.path && 
    a.method === req.method &&
    a.active
  );

  if (!api) return next();

  try {
    if (api.responseType === 'template') {
      const templatePath = path.join(TEMPLATES_DIR, api.templateFile);
      const content = ejs.render(fs.readFileSync(templatePath, 'utf8'), {
        query: req.query,
        body: req.body,
        params: req.params
      });
      res.type('html').status(api.responseStatus).send(content);
    } else {
      const filePath = path.join(RESPONSES_DIR, api.responseFile);
      const content = fs.readFileSync(filePath, 'utf8');
      res.type(api.responseType).status(api.responseStatus).send(content);
    }
  } catch (error) {
    res.status(500).send('Error processing request');
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));