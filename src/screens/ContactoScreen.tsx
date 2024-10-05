import { useTranslation } from 'react-i18next';
import { View, Text, Linking, StyleSheet, ScrollView, Image } from 'react-native';

const ContactComponent = () => {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo} 
      />
      <Image 
        source={require('../../assets/logo2.png')} 
        style={styles.logo2} 
      />
      
      <Text style={styles.text}>
        {t('contactComponent.description')}
      </Text>
      
      <Text style={styles.subHeader}>{t('contactComponent.boardTitle')}</Text>
      <Text style={styles.text}>
        {t('contactComponent.president')} {'\n'}
        {t('contactComponent.vicePresident')} {'\n'}
        {t('contactComponent.treasurer')} {'\n'}
        {t('contactComponent.secretary')} {'\n'}
        {t('contactComponent.director')} {'\n'}
        {t('contactComponent.counselorDirector')}
      </Text>
      
      <Text style={styles.subHeader}>{t('contactComponent.contactMethods')}</Text>
      <Text style={styles.text}>{t('contactComponent.cesfam')}</Text>
      <Text style={styles.text}>{t('contactComponent.emergency')}</Text>
      <Text style={styles.text}>{t('contactComponent.recycling')}</Text>
      
      <Text style={styles.link} onPress={() => Linking.openURL('https://www.camaradeturismocobquecura.cl/')}>
        {t('contactComponent.website')}
      </Text>
      
      <Text style={styles.footer}>{t('contactComponent.footer')}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logo2: {
    width: 98,
    height: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666',
    lineHeight: 26,
  },
  link: {
    fontSize: 18,
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginTop: 20,
    textAlign: 'center',
  },
  footer: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
  },
});

export default ContactComponent;