const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb+srv://vinayst:5OLN0a7MMM0MH3zN@bluestock.8icni.mongodb.net/?retryWrites=true&w=majority&appName=Bluestock');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Mongoose Schema
const apiSchema = new mongoose.Schema({
  name: String,
  endpoint: String,
  method: String,
  responseStatus: { type: Number, default: 200 },
  responseType: String,
  responseFile: String,
  templateFile: String,
  templateContent: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Api = mongoose.model('Api', apiSchema);

const RESPONSES_DIR = path.join(__dirname, 'responses');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Create directories if needed
[RESPONSES_DIR, TEMPLATES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Management API
app.get('/management/apis', async (req, res) => {
  const apis = await Api.find();
  res.json(apis);
});

app.post('/management/apis', async (req, res) => {
  try {
    const apiConfig = req.body;

    if (apiConfig.responseType === 'template') {
      const templatePath = path.join(TEMPLATES_DIR, apiConfig.templateFile);
      fs.writeFileSync(templatePath, apiConfig.templateContent);
    } else {
      const filePath = path.join(RESPONSES_DIR, apiConfig.responseFile);
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Response file not found' });
      }
    }

    const newApi = new Api({
      ...apiConfig,
      responseStatus: parseInt(apiConfig.responseStatus) || 200,
    });

    await newApi.save();
    res.status(201).json(newApi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/management/apis/:id', async (req, res) => {
  try {
    const apiConfig = req.body;
    const api = await Api.findById(req.params.id);
    if (!api) return res.status(404).json({ error: 'API not found' });

    if (apiConfig.responseType === 'template') {
      const templatePath = path.join(TEMPLATES_DIR, apiConfig.templateFile);
      fs.writeFileSync(templatePath, apiConfig.templateContent);
    }

    Object.assign(api, apiConfig, { updatedAt: new Date() });
    await api.save();

    res.json(api);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/management/apis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid API ID' });
    }
    const deletedApi = await Api.findByIdAndDelete(id);
    if (!deletedApi) {
      return res.status(404).json({ error: 'API not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// API Request Handling
app.use(async (req, res, next) => {
  const api = await Api.findOne({
    endpoint: req.path,
    method: req.method,
    active: true,
  });

  if (!api) return next();

  try {
    if (api.responseType === 'template') {
      const templatePath = path.join(TEMPLATES_DIR, api.templateFile);
      const content = ejs.render(fs.readFileSync(templatePath, 'utf8'), {
        query: req.query,
        body: req.body,
        params: req.params,
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
