import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import i18n from '../utils/i18n';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const currentLanguage = i18n.language;
  const { t } = useTranslation();
const [NewLanguage, setNewLanguage] = useState(false);
  const changeLanguageSelect = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getFlagStyle = (lng: string) => {
    return {
      width: currentLanguage === lng ? 40 : 30,
      height: currentLanguage === lng ? 35 : 30,
    };
  };

  return (
    <View style={{ flexDirection: 'row', height:50 }}>
        {NewLanguage? 
        <>
      <TouchableOpacity style={{ height:25 }} onPress={() => changeLanguageSelect('es')}>
        <Image 
          source={require('../../assets/images/es_flag.png')} 
          style={getFlagStyle('es')} 
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguageSelect('en')}>
        <Image 
          source={require('../../assets/images/en_flag.png')} 
          style={getFlagStyle('en')} 
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguageSelect('sv')}>
        <Image 
          source={require('../../assets/images/sv_flag.png')} 
          style={getFlagStyle('sv')} 
        />
      </TouchableOpacity></>:
      <TouchableOpacity  onPress={() => setNewLanguage(true)}>
      <Text style={styles.Text}>{t('languageSelector.chooseLanguage')}</Text>
    </TouchableOpacity>
}
    </View>
  );
};
const styles = StyleSheet.create({
    Text:{
        color: '#007A8C',
        fontSize: 14,
        fontFamily: 'Inter-Regular-400',
    },
});
export default LanguageSelector;