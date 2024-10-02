import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { userLogIn } from '../redux/actions/userActions';
import Loader from '../components/Loader';
import { RootStackParamList } from '../navigation/AppNavigator';
import { fetchAllCategories } from '../redux/actions/categoryActions';
import { AppDispatch } from '../redux/store/store';
import { Dimensions } from 'react-native';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;


const LoginScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<LoginScreenProp>();
  const route = useRoute<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const promotionId = route.params?.promotionId;
  // console.log("ruta del login",route);
  // console.log("id de la promocion",promotionId);
  // console.log("terminos actuales",currentTerms);
  
  useEffect(() => {
    dispatch(fetchAllCategories());
    
  }, [dispatch]);

  

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);



  const handleLogin = async () => {
    const lowerCaseEmail = email.trim().toLowerCase();
    if (lowerCaseEmail === '' || password === '') {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }
    try {
      setLoading(true);
      const response = await dispatch<any>(userLogIn(lowerCaseEmail, password));
      
      setError(null);
      setEmail('')
      setPassword('')
      if (promotionId) {
        navigation.navigate('PromotionDetail', { promotionId });
      } else {
        navigation.navigate('MainAppScreen');
      }
    } catch (err: any) {
      
      setError(err.message);
      setModalMessage(err.message);
      toggleModal();
    } finally {
      setLoading(false);
    }
  }


  return (
    <LinearGradient
      colors={['#007a8c', '#f6f6f6']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image source={require('../../assets/logo.png')} style={styles.logoLog} />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#acd0d5" />
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        <Text style={styles.forgotPasswordText}>No tienes cuenta?</Text>
      </View>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonSecondaryText}>Regístrate</Text>
      </TouchableOpacity>
      {/* <Text  style={styles.versionText} >Version Beta 0.1.1</Text> */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
        {loading && <Loader />}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f6f6f6',
    padding: 20,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',

    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  logoLog: {
    height: 130,
    width: 130,
    marginBottom: 30,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'rgb(172, 208, 213)',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '100%',
    borderColor: 'rgb(172, 208, 213)',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 0,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  inputPassword: {
    flex: 1,
    fontSize: 14,
  },
  error: {
    color: '#007a8c',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007a8c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    fontFamily: 'Inter-Regular-400',
    // Sombra en el botón
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Regular-400',
  },
  buttonSecondary: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#007a8c',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Regular-400',
  },
  forgotPasswordButton: {

    marginTop: 20,
    width: '95%',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end'
  },
  forgotPasswordText: {
    color: '#007a8c',
    fontSize: 12,
    fontFamily: 'Inter-Regular-400',
  },
  modalContent: {
    backgroundColor: 'rgba(246, 246, 246, 0.9)',
    color: 'white',
    display:'flex',
    alignSelf:'center',
    flexDirection:'column',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '70%',
    height:'30%',
    justifyContent:'space-evenly'
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight:'600',
    color: '#007a8c',
  },
  modalButton: {
    backgroundColor: '#007a8c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  // versionText:{
  //   marginTop:20,
  //   fontSize: screenWidth*0.035,
  //   fontFamily: 'Inter-Regular-400',
  //   color: '#007a8c',
  //   fontWeight:'400'
  // }
});

export default LoginScreen;
