import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import SemicirclesOverlay from '../components/SemicirclesOverlay';


const SettingsScreen = () => {
    const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
        <SemicirclesOverlay/>
      <Text style={styles.title}>{t('sidebar.settings')}</Text>
      <LanguageSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop:30,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  title: {
   color:'#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 55,
  },
});

export default SettingsScreen;