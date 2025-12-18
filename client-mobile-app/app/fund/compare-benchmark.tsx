
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function CompareBenchmarkScreen() {
  const params = useLocalSearchParams();
  // Editable state for all parameters
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  // All possible fields
  type InputState = {
    min_sip: number;
    fund_age_yr: number;
    category: string;
    sub_category: string;
    min_lumpsum: number;
    expense_ratio: number;
    fund_size_cr: number;
    sortino: number;
    alpha: number;
    sd: number;
    beta: number;
    sharpe: number;
    risk_level: number;
    amc_name: string;
    rating: number;
  };
  const [input, setInput] = useState<InputState>({
    min_sip: Number(params.min_sip) || 5000,
    fund_age_yr: Number(params.fund_age_yr) || 5,
    category: params.category?.toString() || 'Equity',
    sub_category: params.sub_category?.toString() || 'FoFs Domestic',
    min_lumpsum: Number(params.min_lumpsum) || 10000,
    expense_ratio: Number(params.expense_ratio) || 1.5,
    fund_size_cr: Number(params.fund_size_cr) || 2000,
    sortino: Number(params.sortino) || 0.5,
    alpha: Number(params.alpha) || 2.0,
    sd: Number(params.sd) || 10.0,
    beta: Number(params.beta) || 1.0,
    sharpe: Number(params.sharpe) || 0.8,
    risk_level: Number(params.risk_level) || 3,
    amc_name: params.amc_name?.toString() || 'HDFC Mutual Fund',
    rating: Number(params.rating) || 4.5,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Prepare body based on mode
      let body;
      if (mode === 'simple') {
        body = {
          min_sip: input.min_sip,
          fund_age_yr: input.fund_age_yr,
          category: input.category,
          sub_category: input.sub_category,
          // Hardcoded advanced params
          min_lumpsum: 10000,
          expense_ratio: 1.5,
          fund_size_cr: 2000,
          sortino: 0.5,
          alpha: 2.0,
          sd: 10.0,
          beta: 1.0,
          sharpe: 0.8,
          risk_level: 3,
          amc_name: 'HDFC Mutual Fund',
          rating: 4.5,
        };
      } else {
        body = { ...input };
      }
      console.log('Sending request:', body);
      const response = await fetch('https://pred-mod-776087882401.europe-west1.run.app/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await response.text();
      console.log('Raw response:', text);
      if (!response.ok) throw new Error('Network response was not ok: ' + text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Invalid JSON: ' + text);
      }
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Mode Toggle */}
      <View style={{ flexDirection: 'row', marginBottom: 16, alignSelf: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor: mode === 'simple' ? '#000' : '#fff',
            borderColor: '#000',
            borderWidth: 1,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 24,
          }}
          onPress={() => setMode('simple')}
        >
          <Text style={{ color: mode === 'simple' ? '#fff' : '#000', fontWeight: 'bold' }}>Simple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: mode === 'advanced' ? '#000' : '#fff',
            borderColor: '#000',
            borderWidth: 1,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 24,
          }}
          onPress={() => setMode('advanced')}
        >
          <Text style={{ color: mode === 'advanced' ? '#fff' : '#000', fontWeight: 'bold' }}>Advanced</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Benchmark Comparison</Text>
      <View style={styles.inputBox}>
        <Text style={styles.inputTitle}>Input Parameters</Text>
        {/* SIP Amount Slider */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>SIP Amount</Text>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <Slider
              value={input.min_sip}
              minimumValue={500}
              maximumValue={50000}
              step={500}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor="#000"
              onValueChange={v => setInput(i => ({ ...i, min_sip: v }))}
            />
            <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.min_sip}</Text>
          </View>
        </View>
        {/* Fund Age Slider */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Fund Age (Years)</Text>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <Slider
              value={input.fund_age_yr}
              minimumValue={1}
              maximumValue={30}
              step={1}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor="#000"
              onValueChange={v => setInput(i => ({ ...i, fund_age_yr: v }))}
            />
            <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.fund_age_yr}</Text>
          </View>
        </View>
        {/* Category Dropdown */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Category</Text>
          <View style={{flex: 1}}>
            <Picker
              selectedValue={input.category}
              style={{ color: '#000', backgroundColor: '#fff' }}
              onValueChange={v => setInput(i => ({ ...i, category: v }))}
            >
              <Picker.Item label="Equity" value="Equity" />
              <Picker.Item label="Debt" value="Debt" />
              <Picker.Item label="Hybrid" value="Hybrid" />
            </Picker>
          </View>
        </View>
        {/* Sub Category Dropdown */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Sub Category</Text>
          <View style={{flex: 1}}>
            <Picker
              selectedValue={input.sub_category}
              style={{ color: '#000', backgroundColor: '#fff' }}
              onValueChange={v => setInput(i => ({ ...i, sub_category: v }))}
            >
              <Picker.Item label="FoFs Domestic" value="FoFs Domestic" />
              <Picker.Item label="Large Cap" value="Large Cap" />
              <Picker.Item label="Small Cap" value="Small Cap" />
              <Picker.Item label="Mid Cap" value="Mid Cap" />
            </Picker>
          </View>
        </View>
        {/* Advanced fields, only show in advanced mode */}
        {mode === 'advanced' && (
          <>
            {/* Lumpsum */}
            <View style={styles.inputRow}>
              <Text style={styles.inputKey}>Min Lumpsum</Text>
              <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
                <Slider
                  value={input.min_lumpsum}
                  minimumValue={1000}
                  maximumValue={100000}
                  step={1000}
                  minimumTrackTintColor="#000"
                  maximumTrackTintColor="#000"
                  thumbTintColor="#000"
                  onValueChange={v => setInput(i => ({ ...i, min_lumpsum: v }))}
                />
                <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.min_lumpsum}</Text>
              </View>
            </View>
            {/* Expense Ratio */}
            <View style={styles.inputRow}>
              <Text style={styles.inputKey}>Expense Ratio</Text>
              <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
                <Slider
                  value={input.expense_ratio}
                  minimumValue={0}
                  maximumValue={5}
                  step={0.01}
                  minimumTrackTintColor="#000"
                  maximumTrackTintColor="#000"
                  thumbTintColor="#000"
                  onValueChange={v => setInput(i => ({ ...i, expense_ratio: v }))}
                />
                <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.expense_ratio}</Text>
              </View>
            </View>
            {/* Fund Size */}
            <View style={styles.inputRow}>
              <Text style={styles.inputKey}>Fund Size (Cr)</Text>
              <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
                <Slider
                  value={input.fund_size_cr}
                  minimumValue={10}
                  maximumValue={10000}
                  step={10}
                  minimumTrackTintColor="#000"
                  maximumTrackTintColor="#000"
                  thumbTintColor="#000"
                  onValueChange={v => setInput(i => ({ ...i, fund_size_cr: v }))}
                />
                <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.fund_size_cr}</Text>
              </View>
            </View>
            {/* Fund Metrics */}
            {[
              { key: 'sortino', label: 'Sortino', min: 0, max: 3, step: 0.01 },
              { key: 'alpha', label: 'Alpha', min: -5, max: 10, step: 0.01 },
              { key: 'sd', label: 'SD', min: 0, max: 50, step: 0.1 },
              { key: 'beta', label: 'Beta', min: 0, max: 3, step: 0.01 },
              { key: 'sharpe', label: 'Sharpe', min: 0, max: 3, step: 0.01 },
              { key: 'risk_level', label: 'Risk Level', min: 1, max: 5, step: 1 },
              { key: 'rating', label: 'Rating', min: 1, max: 5, step: 0.1 },
            ].map(slider => (
              <View style={styles.inputRow} key={slider.key}>
                <Text style={styles.inputKey}>{slider.label}</Text>
                <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
                  <Slider
                    value={input[slider.key as keyof InputState] as number}
                    minimumValue={slider.min}
                    maximumValue={slider.max}
                    step={slider.step}
                    minimumTrackTintColor="#000"
                    maximumTrackTintColor="#000"
                    thumbTintColor="#000"
                    onValueChange={v => setInput(i => ({ ...i, [slider.key]: v } as InputState))}
                  />
                  <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input[slider.key as keyof InputState]}</Text>
                </View>
              </View>
            ))}
            {/* AMC Name Dropdown */}
            <View style={styles.inputRow}>
              <Text style={styles.inputKey}>AMC Name</Text>
              <View style={{flex: 1}}>
                <Picker
                  selectedValue={input.amc_name}
                  style={{ color: '#000', backgroundColor: '#fff' }}
                  onValueChange={v => setInput(i => ({ ...i, amc_name: v }))}
                >
                  <Picker.Item label="HDFC Mutual Fund" value="HDFC Mutual Fund" />
                  <Picker.Item label="SBI Mutual Fund" value="SBI Mutual Fund" />
                  <Picker.Item label="Axis Mutual Fund" value="Axis Mutual Fund" />
                  <Picker.Item label="Nippon India Mutual Fund" value="Nippon India Mutual Fund" />
                </Picker>
              </View>
            </View>
          </>
        )}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          borderRadius: 24,
          paddingVertical: 16,
          paddingHorizontal: 32,
          marginTop: 24,
          marginBottom: 32,
        }}
        onPress={handlePredict}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          Predict
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator color="#000" size="large" style={{ marginTop: 32 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {error && <Text style={{ color: '#000', fontSize: 12, marginTop: 8 }}>{JSON.stringify(input)}</Text>}
      {error && <Text style={{ color: '#000', fontSize: 12, marginTop: 8 }}>{'Endpoint: https://pred-mod-776087882401.europe-west1.run.app/predict'}</Text>}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>1 Year Return:</Text>
          <Text style={styles.resultValue}>{result.returns_1yr ?? result.returns_1yr ?? '--'}%</Text>
          <Text style={styles.resultLabel}>3 Year Return:</Text>
          <Text style={styles.resultValue}>{result.returns_3yr ?? result.returns_3yr ?? '--'}%</Text>
          <Text style={styles.resultLabel}>5 Year Return:</Text>
          <Text style={styles.resultValue}>{result.returns_5yr ?? result.returns_5yr ?? '--'}%</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  error: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginTop: 32,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    padding: 24,
    marginBottom: 32,
    width: '100%',
  },
  resultLabel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  resultValue: {
    color: '#000',
    fontSize: 18,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    width: '100%',
  },
  inputTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inputKey: {
    color: '#000',
    fontWeight: 'bold',
  },
  inputValue: {
    color: '#000',
  },
});
