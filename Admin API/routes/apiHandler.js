// routes/apiHandler.js
const Api = require('../models/Api');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports = async function (req, res, next) {
  if (req.path.startsWith('/admin') || req.path.startsWith('/management')) return next();
  try {
    const api = await Api.findOne({ endpoint: req.path, method: req.method, active: true });
    if (!api) return next();
    if (api.responseType === 'template') {
      const templatePath = path.join(__dirname, '..', 'templates', api.templateFile);
      if (!fs.existsSync(templatePath)) return res.status(500).send('Template file not found');
      const content = ejs.render(fs.readFileSync(templatePath, 'utf8'), {
        query: req.query,
        body: req.body,
        params: req.params,
      });
      return res.type('html').status(api.responseStatus).send(content);
    } else {
      const filePath = path.join(__dirname, '..', 'responses', api.responseFile);
      if (!fs.existsSync(filePath)) return res.status(500).send('Response file not found');
      const content = fs.readFileSync(filePath, 'utf8');
      return res.type(api.responseType).status(api.responseStatus).send(content);
    }
  } catch (error) {
    console.error('API Handling Error:', error);
    res.status(500).send('Error processing request');
  }
};
