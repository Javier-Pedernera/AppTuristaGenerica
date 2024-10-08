import React from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../services/authService';
import { SimpleLineIcons } from '@expo/vector-icons';
import SemicirclesOverlaySideBar from './SemicirclesOverlaySideBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const Sidebar: React.FC<DrawerContentComponentProps> = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser() as any);
  };

  const navigateToScreen = (screenName: string) => {
    props.navigation.navigate('MainTabs', { screen: screenName });
  };


  return (
    <View style={styles.container}>
      <SemicirclesOverlaySideBar/>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Perfil')}>
        <MaterialCommunityIcons style={styles.icon} name="account-box" size={width * 0.06} color="#000" />
        <Text style={styles.optionText}>{t('sidebar.profile')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Favoritos')}>
        <MaterialCommunityIcons style={styles.icon} name="folder-heart-outline" size={width * 0.06} color="#000" />
        <Text style={styles.optionText}>{t('sidebar.favorites')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Contacto')}>
        <MaterialCommunityIcons style={styles.icon} name="card-account-phone-outline" size={width * 0.06} color="#000" />
        <Text style={styles.optionText}>{t('sidebar.contact')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('PuntosTuristicos')}>
      <FontAwesome6 style={styles.icon} name="umbrella-beach"size={width * 0.06} color="#000" />
        <Text style={styles.optionText}>{t('sidebar.touristPoints')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Mapa')}>
        <FontAwesome style={styles.icon} name="map-o" size={width * 0.06} color="#000" />
        <Text style={styles.optionText}>{t('sidebar.map')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Configuracion')}>
      <Ionicons style={styles.icon} name="settings-outline" size={width * 0.06} color="#000" />
        <Text style={styles.optionText}>{t('sidebar.settings')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigateToScreen('Legales')}>
        <Ionicons name="information-circle-outline" style={styles.icon} size={width * 0.06} color="#000" />
        <Text style={styles.optionText}>{t('sidebar.legal')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <SimpleLineIcons style={styles.icon} name="logout" size={width * 0.05} color="#fff" />
        <Text style={styles.optionText}>{t('sidebar.logout')}</Text>
      </TouchableOpacity>
      <View style={styles.logoLogSideCont}>
        <Image source={require('../../assets/logo.png')} style={styles.logoLogSide}/>
        <Image source={require('../../assets/logo2.png')} style={styles.logoLog2Side}/>
      </View>
        <Text  style={styles.versionText} >{t('sidebar.version')} 0.1.7</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.02,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.02,
  },
  icon: {
    width: 25,
    marginRight: width * 0.024,
    marginLeft: width * 0.05,
    color: 'rgb(246, 246, 246)'
  },
  optionText: {
    width:'100%',
    color: 'rgb(246, 246, 246)',
    fontSize: width * 0.042,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.05,
    marginTop: height * 0.05,
  },
  logoLogSideCont:{
    position:'absolute',
    bottom: height * 0.05,
    alignSelf:'center'
  },
  logoLogSide:{
    alignSelf:'center',
    marginBottom:10,
    width: width * 0.12,
    height: width * 0.12,
  },
  logoLog2Side:{
    width: width * 0.25,
    height: height * 0.041,
  },
  versionText:{
    position:'absolute',
    bottom:10,
    left: 80,
    marginTop:2,
    fontSize: width *0.03,
    fontFamily: 'Inter-Regular-400',
    color: '#007a8c',
    fontWeight:'400'
  }
});

export default Sidebar;


// Paleta: naranja: #007a8c
//         mostaza: #d59831
//         azul: #007a8c
//         celeste: #64C9ED