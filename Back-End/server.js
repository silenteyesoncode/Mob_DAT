const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Assuming you have a JSON file with table data named 'tables.json' in the same directory
const tables = require('./tables.json');

// Middleware to parse request bodies as JSON
app.use(bodyParser.json());

// Endpoint to retrieve a list of existing tables
app.get('/api/tables', (req, res) => {
  res.json(tables);
});

// Endpoint to retrieve columns and rows of a specific table
app.get('/api/tables/:id', (req, res) => {
  const { id } = req.params;
  const table = tables.find(table => table.id === id);

  if (!table) {
    return res.status(404).json({ error: 'Table not found' });
  }

  const { columns, rows } = table;
  res.json({ columns, rows });
});

// Endpoint to accept new table data and store it
app.post('/api/tables', (req, res) => {
  const newTable = req.body;

  // Assuming the new table data is in the format { id: 'tableId', columns: [...], rows: [...] }
  tables.push(newTable);
  res.status(201).json({ message: 'Table created successfully' });
});

// Endpoint to update column and row data for a specific table
app.put('/api/tables/:id', (req, res) => {
  const { id } = req.params;
  const updatedTable = req.body;

  const tableIndex = tables.findIndex(table => table.id === id);

  if (tableIndex === -1) {
    return res.status(404).json({ error: 'Table not found' });
  }

  // Update the column and row data of the table
  tables[tableIndex].columns = updatedTable.columns;
  tables[tableIndex].rows = updatedTable.rows;

  res.json({ message: 'Table updated successfully' });
});

app.delete('/api/tables/:id', (req, res) => {
  const { id } = req.params;
  const tableIndex = tables.findIndex(table => table.id === id);

  if (tableIndex === -1) {
    return res.status(404).json({ error: 'Table not found' });
  }

  tables.splice(tableIndex, 1);
  res.json({ message: 'Table deleted successfully' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
