import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const currencyOptions = Object.keys(data.rates);
        setCurrencies(currencyOptions);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    } 
  
    fetchCurrencies();
  }, []);
  
  const convertToEuros = async () => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const convertedAmount = parseFloat(amount) * data.rates['EUR'];
      setResult(convertedAmount.toFixed(2));
    } catch (error) {
      setResult('Error converting currency. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select currency:</Text>
      <Picker
        selectedValue={currency}
        onValueChange={(itemValue) => setCurrency(itemValue)}
        style={styles.picker}
      >
        {currencies.map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <Button
          title="Convert"
          onPress={convertToEuros}
        />
      </View>
      
      <Text style={styles.result}>{result ? `Converted amount in EUR: ${result}` : null}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: 150,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});