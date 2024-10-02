import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedCountries } from '../redux/selectors/countrySelectors';
import { AppDispatch, RootState } from '../redux/store/store';
import { fetchCountries } from '../redux/actions/countryActions';

interface CountryPickerProps {
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  estilo: boolean;
}

const CountryPicker: React.FC<CountryPickerProps> = ({ selectedCountry, onCountryChange, estilo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const countries = useSelector((state: RootState) => getMemoizedCountries(state));

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const countryOptions = countries.map((country: any) => ({
    label: country.name,
    value: country.name,
  }));

  return (
    <View style={styles.container}>
      <View style={estilo && styles.pickerWrapper}>
        <RNPickerSelect
          placeholder={{
            label: '* Seleccione un país',
            value: '',
            color: '#9EA0A4',
          }}
          items={countryOptions}
          onValueChange={onCountryChange}
          value={selectedCountry}
          style={pickerStyles}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  pickerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: '#fff',
    height: 35,
    alignContent: 'center',
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    width: '100%',
    fontSize: 16,
    paddingHorizontal: 15,
    color: '#333',
  },
  inputAndroid: {
    width: '100%',
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  placeholder: {
    color: '#9EA0A4',
  },
});

export default CountryPicker;
