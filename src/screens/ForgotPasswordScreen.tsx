import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Modal from 'react-native-modal';
import { sendPasswordResetEmail } from '../services/authService';
import SemicirclesOverlay from '../components/SemicirclesOverlay';

type ForgotPasswordScreenProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenProp>();
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSendResetEmail = async () => {
    try {
      // Convertir el email a minúsculas
      const normalizedEmail = email.toLowerCase();
  
      await sendPasswordResetEmail(normalizedEmail);
  
      // Configurar el mensaje y mostrar el modal
      setModalMessage('Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.');
      toggleModal();
  
      // Ocultar el modal y redirigir después de 3 segundos
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Login');
      }, 4000);
    } catch (error: any) {
      // Configurar el mensaje de error y mostrar el modal
      setModalMessage(error?.response?.data?.message || 'Error al enviar el correo de recuperación.');
      toggleModal();
    }
  };

  return (
    <View style={styles.container}>
      {/* <SemicirclesOverlay/> */}
      <Image source={require('../../assets/logo.png')} style={styles.logoHome} />
      <Text style={styles.title}>Recupera tu contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendResetEmail}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(172, 208, 213)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    color: '#333',
  },
  logoHome: {
    width: 70,
    height: 70,
    marginTop: 20
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007a8c',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
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
  },
  modalContent: {
    backgroundColor: 'rgba(246, 246, 246,0.9)',
    color: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: "80%",
    alignSelf: 'center'
  },
  modalMessage: {
    textAlign:'center',
    fontSize: 18,
    marginBottom: 20,
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
});

export default ForgotPasswordScreen;
