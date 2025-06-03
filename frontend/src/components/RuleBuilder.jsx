import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Paper,
  Grid
} from '@mui/material';

function RuleBuilder({ rules, onChange }) {
  const handleOperatorChange = (e) => {
    onChange({
      ...rules,
      operator: e.target.value
    });
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...rules.conditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value
    };
    onChange({
      ...rules,
      conditions: newConditions
    });
  };

  const addCondition = () => {
    onChange({
      ...rules,
      conditions: [
        ...rules.conditions,
        { field: 'totalSpent', operator: '>', value: 0 }
      ]
    });
  };

  const removeCondition = (index) => {
    const newConditions = rules.conditions.filter((_, i) => i !== index);
    onChange({
      ...rules,
      conditions: newConditions
    });
  };

  return (
    <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
      <Typography variant="h6" gutterBottom>
        Segment Rules
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Combine Rules With</InputLabel>
        <Select
          value={rules.operator}
          onChange={handleOperatorChange}
          label="Combine Rules With"
        >
          <MenuItem value="AND">AND (All conditions must match)</MenuItem>
          <MenuItem value="OR">OR (Any condition can match)</MenuItem>
        </Select>
      </FormControl>

      {rules.conditions.map((condition, index) => (
        <Box key={index} style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel>Field</InputLabel>
                <Select
                  value={condition.field}
                  onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                  label="Field"
                >
                  <MenuItem value="totalSpent">Total Spent</MenuItem>
                  <MenuItem value="visitCount">Visit Count</MenuItem>
                  <MenuItem value="lastVisit">Days Since Last Visit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={condition.operator}
                  onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                  label="Operator"
                >
                  <MenuItem value=">">Greater Than</MenuItem>
                  <MenuItem value="<">Less Than</MenuItem>
                  <MenuItem value=">=">Greater Than or Equal</MenuItem>
                  <MenuItem value="<=">Less Than or Equal</MenuItem>
                  <MenuItem value="==">Equal To</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Value"
                type="number"
                value={condition.value}
                onChange={(e) => handleConditionChange(index, 'value', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                color="error"
                onClick={() => removeCondition(index)}
                disabled={rules.conditions.length === 1}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Box display="flex" justifyContent="center" marginTop="1rem">
        <Button
          variant="outlined"
          onClick={addCondition}
        >
          Add Condition
        </Button>
      </Box>
    </Paper>
  );
}

export default RuleBuilder; 