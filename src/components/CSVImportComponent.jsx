import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AppContext } from '/src/context/AppContext';

export default function CSVImportComponent({ onImportSuccess }) {
  const { user } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid CSV file.',
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#fff',
        color: '#2d2d2d',
        confirmButtonColor: '#77407B'
      });
      setFile(null);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split("\n").filter(line => line.trim() !== "");
    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length >= 3) {
        const [date, title, amount] = values;

        const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(date.replace(/"/g, ''))) {
          throw new Error(`Invalid date on line ${i + 1}: ${date}`);
        }

        const numericAmount = parseFloat(amount.replace(/"/g, '').replace(',', '.'));
        if (isNaN(numericAmount)) {
          throw new Error(`Invalid amount on line ${i + 1}: ${amount}`);
        }

        const type = numericAmount < 0 ? 'income' : 'expense';

        transactions.push({
          date: date.replace(/"/g, ''),
          description: title.replace(/"/g, ''),
          amount: Math.abs(numericAmount),
          type: type
        });
      }
    }

    return transactions;
  };

  const handleImport = async () => {
    if (!file) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a CSV file.',
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#fff',
        color: '#2d2d2d',
        confirmButtonColor: '#77407B'
      });
      return;
    }

    setIsLoading(true);

    try {
      const fileContent = await file.text();
      const transactions = parseCSV(fileContent);

      if (transactions.length === 0) {
        throw new Error('No valid transactions found in the file.');
      }

      const result = await Swal.fire({
        title: 'Confirm Import',
        html: `
          <p><strong>${transactions.length}</strong> transactions found.</p>
          <p>Do you want to import all of them?</p>
          <div style="max-height: 200px; overflow-y: auto; text-align: left; margin-top: 10px;">
            ${transactions.slice(0, 5).map(t => 
              `<div style="margin: 5px 0; padding: 5px; background: #f5f5f5; border-radius: 3px;">
                <strong>${t.description}</strong><br>
                ${t.date} - $${t.amount.toFixed(2)} (${t.type === 'income' ? 'Income' : 'Expense'})
              </div>`
            ).join('')}
            ${transactions.length > 5 ? `<p>... and ${transactions.length - 5} more transactions</p>` : ''}
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Import',
        cancelButtonText: 'Cancel',
        background: '#fff',
        color: '#2d2d2d',
        confirmButtonColor: '#77407B'
      });

      if (!result.isConfirmed) {
        setIsLoading(false);
        return;
      }

      const config = { headers: { Authorization: user.token } };
      let successCount = 0;
      let errorCount = 0;

      for (const transaction of transactions) {
        try {
          const reqBody = {
            description: transaction.description,
            amount: transaction.amount
          };

          await axios.post(
            `${import.meta.env.VITE_API_URL}/new-transaction/${transaction.type}`,
            reqBody,
            config
          );
          successCount++;
        } catch (error) {
          console.error('Error importing transaction:', transaction, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        Swal.fire({
          title: 'Import Completed!',
          html: `
            <p><strong>${successCount}</strong> transactions successfully imported.</p>
            ${errorCount > 0 ? `<p><strong>${errorCount}</strong> transactions failed.</p>` : ''}
          `,
          icon: 'success',
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#2d2d2d',
          confirmButtonColor: '#77407B'
        });

        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        throw new Error('No transactions were successfully imported.');
      }

    } catch (error) {
      console.error('Import error:', error);
      Swal.fire({
        title: 'Import Error!',
        text: error.message || 'An error occurred while processing the CSV file.',
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#fff',
        color: '#2d2d2d',
        confirmButtonColor: '#77407B'
      });
    } finally {
      setIsLoading(false);
      setFile(null);
      const fileInput = document.getElementById('csv-file-input');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  return (
    <ImportContainer>
      <ImportSection>
        <h3>Import Expenses via CSV</h3>
        <p>Expected format: date, title, amount</p>
        <p>Example: 2024-01-15, "Grocery shopping", -150.50</p>

        <FileInputContainer>
          <FileInput
            id="csv-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <FileLabel htmlFor="csv-file-input">
            {file ? file.name : 'Choose CSV File'}
          </FileLabel>
        </FileInputContainer>

        <ImportButton
          onClick={handleImport}
          disabled={!file || isLoading}
        >
          {isLoading ? 'Importing...' : 'Import Transactions'}
        </ImportButton>
      </ImportSection>
    </ImportContainer>
  );
}

const ImportContainer = styled.div`
  margin: 20px 0;
`;

const ImportSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  h3 {
    color: white;
    margin-bottom: 10px;
    font-size: 18px;
  }

  p {
    color: #ccc;
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const FileInputContainer = styled.div`
  margin: 15px 0;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-block;
  padding: 10px 15px;
  background: #77407B;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: #5a2f5c;
  }
`;

const ImportButton = styled.button`
  width: 100%;
  height: 46px;
  background: #77407B;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: #5a2f5c;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;
