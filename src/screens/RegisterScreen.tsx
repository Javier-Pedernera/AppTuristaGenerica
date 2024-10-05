import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { registerUser } from '../services/authService';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../redux/actions/categoryActions';
import { AppDispatch, RootState } from '../redux/store/store';
import { createTourist } from '../services/touristService';
import Loader from '../components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from '../utils/formatDate';
import { getMemoizedAllCategories } from '../redux/selectors/categorySelectors';
import CountryPicker from '../components/CountrySelect';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import TermsModal from '../components/TermsModal';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
type RegisterScreenProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<RegisterScreenProp>();
  const categories = useSelector(getMemoizedAllCategories);


  useEffect(() => {
    dispatch(fetchAllCategories());
    fetchTerms();
  }, [dispatch]);


  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    city: '',
    phone_number: '',
    gender: '',
    other_gender: '',
    birth_date: '',
    password: '',
    confirmPassword: '',
    subscribed_to_newsletter: false,
    status_id: 1,
    accept_terms: false
  });
  const [showOtherGender, setShowOtherGender] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [termsText, setTermsText] = useState('');
  // console.log("terminos aceptados?",isTermsAccepted);
  
  const fetchTerms = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/terms`);
      if (!response.ok) {
        throw new Error('Error al obtener los términos y condiciones');
      }
      const data = await response.json();
        setTermsText(data.content);
    } catch (error:any) {
      setError(error.message);
    }
  };
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === 'email') {
      value = value.toLowerCase();
    }
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prevSelectedCategories => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter(id => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  };
  // console.log("categorias",formData);
  // console.log(selectedCategories);

  const handleRegister = async () => {
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!isTermsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
  }
    const { confirmPassword, other_gender, ...dataToSend } = formData;
    if (other_gender) {
      dataToSend.gender = other_gender;
    }
    dataToSend.accept_terms = isTermsAccepted;
    try {
      // Registro del usuario
      const userResponse = await registerUser(dataToSend);
      console.log("userResponse", userResponse);

      if (userResponse.status === 201) {
        const { user_id, country, gender, birth_date } = userResponse.data;
        // Crear turista
        const touristData = {
          user_id: user_id,
          origin: country || null,
          birthday: birth_date || null,
          gender: gender || null,
          category_ids: selectedCategories,
        };

        const touristResponse = await createTourist(touristData);
        console.log("touristResponse",touristResponse);
        if (touristResponse.status === 200) {
          setError(null);
          Alert.alert('Éxito', "Usuario registrado correctamente", [{ text: 'OK' }], { cancelable: true });
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            country: '',
            city: '',
            phone_number: '',
            gender: '',
            other_gender: '',
            birth_date: '',
            password: '',
            confirmPassword: '',
            subscribed_to_newsletter: false,
            status_id: 1,
            accept_terms: false
          })
          setTimeout(() => {
            navigation.navigate('Login',{});
          }, 2000);
        } else {
          setError('Fallo al crear el perfil de turista');
        }
      } else {
        setError('Fallo en el registro');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDateChange = (event: any, date?: Date) => {
    console.log("en handlechange",event, date);
    
    if (Platform.OS === 'ios') {
      setSelectedDate(date || selectedDate);
    } else {
      if (date) {
        const formattedDate = formatDateToYYYYMMDD(
          `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        );
        setSelectedDate(date)
        handleInputChange('birth_date', formattedDate);
      }
      setShowDatePicker(false);
    }
  };
  const confirmDate = () => {
    if (selectedDate) {
      const formattedDate = formatDateToYYYYMMDD(
        `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`
      );
      handleInputChange('birth_date', formattedDate);
    }
    setShowDatePicker(false);
  };
  const handleCountryChange = (value: string) => {
    handleInputChange('country', value);
  };
  const handleGenderChange = (value: string) => {
    setShowOtherGender(value === 'other');
    handleInputChange('gender', value);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const isFormValid = () => {
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      formData.country &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    );
  };
  const toggleTermsModal = () => {
    setIsTermsModalVisible(!isTermsModalVisible);
  };

  const acceptTerms = () => {
    setIsTermsAccepted(true);
    toggleTermsModal();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.maincontainer}>
      <LinearGradient
        colors={['#007a8c', '#f6f6f6']}
        style={styles.container}
      >
        {loading && <Loader />}
        <ScrollView contentContainerStyle={styles.containerScroll}>
          <View style={styles.formGrid}>
            <Text style={styles.titleRegister}>{t('register.title')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('register.firstNamePlaceholder')}
              placeholderTextColor="#aaa"
              value={formData.first_name}
              onChangeText={(value) => handleInputChange('first_name', value)}
            />
            
            <TextInput
              style={styles.input}
              placeholder={t('register.lastNamePlaceholder')}
              placeholderTextColor="#aaa"
              value={formData.last_name}
              onChangeText={(value) => handleInputChange('last_name', value)}
            />
            
            <TextInput
              style={styles.input}
              placeholder={t('register.emailPlaceholder')}
              placeholderTextColor="#aaa"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder={t('register.cityPlaceholder')}
              placeholderTextColor="#aaa"
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
            />
            
            <TextInput
              style={styles.input}
              placeholder={t('register.phonePlaceholder')}
              placeholderTextColor="#aaa"
              value={formData.phone_number}
              onChangeText={(value) => handleInputChange('phone_number', value)}
              keyboardType="phone-pad"
            />
            
            <View style={styles.datePickerContainer}>
              {!showDatePicker && (
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputdate}>
                  <Text style={styles.textDate}>
                    {formData.birth_date ? formatDateToDDMMYYYY(formData.birth_date) : t('register.birthDate')}
                  </Text>
                </TouchableOpacity>
              )}
              {showDatePicker && (
                <View>
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity onPress={confirmDate} style={styles.confirmButton}>
                      <Text style={styles.confirmButtonText}>{t('register.confirmDate')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <View style={styles.genderDivider}>
              <View style={styles.pickerWrapper}>
                <RNPickerSelect
                  onValueChange={(value) => handleGenderChange(value)}
                  items={[
                    { label: t('register.male'), value: 'male' },
                    { label: t('register.female'), value: 'female' },
                    { label: t('register.other'), value: 'other' }
                  ]}
                  placeholder={{ label: t('register.genderPlaceholder'), value: '' }}
                  style={pickerSelectStyles}
                />
              </View>
              {showOtherGender && (
                <TextInput
                  style={styles.input}
                  placeholder={t('register.specifyGenderPlaceholder')}
                  placeholderTextColor="#aaa"
                  value={formData.other_gender}
                  onChangeText={(value) => handleInputChange('other_gender', value)}
                />
              )}
            </View>

            <TouchableOpacity style={styles.buttonModal} onPress={toggleModal}>
              <MaterialIcons name="format-list-bulleted-add" size={22} color="#fff" />
              <Text style={styles.buttonModalText}>{t('register.preferences')}</Text>
            </TouchableOpacity>
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t('register.selectPreferences')}</Text>
                {categories.map(category => (
                  <View key={category.category_id} style={styles.checkboxWrapper}>
                    <Checkbox
                      style={styles.checkbox}
                      value={selectedCategories.includes(category.category_id)}
                      onValueChange={() => handleCategoryChange(category.category_id)}
                    />
                    <Text style={styles.checkboxLabel}>{category.name}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
                  <Text style={styles.modalButtonText}>{t('register.close')}</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder={t('register.passwordPlaceholder')}
                placeholderTextColor="#aaa"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder={t('register.confirmPasswordPlaceholder')}
                placeholderTextColor="#aaa"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={toggleTermsModal} style={styles.termsButton}>
            <Checkbox
              style={styles.checkbox}
              value={isTermsAccepted}
              onValueChange={() => setIsTermsAccepted(!isTermsAccepted)}
            />
            <Text style={styles.termsText}>{t('register.acceptTerms')}</Text>
          </TouchableOpacity>

          <TermsModal 
            isVisible={isTermsModalVisible}
            toggleModal={toggleTermsModal} 
            acceptTerms={acceptTerms} 
            termsText={termsText}
            onCancel={undefined}
            newTerms={false}
          />
          
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !isFormValid() && { backgroundColor: '#acd0d5' }]}
              onPress={handleRegister}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>{t('register.register')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login', {})}>
              <Text style={styles.buttonSecondaryText}>{t('register.back')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
    color:'#333'
  },
  
  inputAndroid: {
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  
});

const styles = StyleSheet.create({
  maincontainer:{
    display:'flex',
    flexDirection:'column',
    width:screenWidth,
    height:screenHeight
  },
  container: {
    backgroundColor: 'rgba(246, 246, 246, 0.5)',
  },
  titleRegister:{
  width:'100%',
  color:'#007a8c',
  textAlign:'center',
  alignSelf:'center',
  marginBottom:15,
  marginTop:screenHeight*-0.03,
  fontWeight:'bold'
  },
  containerScroll:{
    height:screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:25,
    borderRadius: 20,
    padding:10,
    margin: 20,
    // marginRight: 20,
    backgroundColor: 'rgba(246, 246, 246, 1)',
  },
  logo: {
    position:'absolute',
    width: 50,
    height: 50,
    bottom: screenHeight*0.05,
    opacity: 0.7,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007a8c',
  },
  formGrid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    
  },
  input: {
    height: 35,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 6,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(246, 246, 246,1)',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(246, 246, 246,1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,

  },
  passwordDivider: {
    width: '100%',
    marginTop: 10,
  },
  genderDivider: {
    width: '100%',
    marginTop: 1,

  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#336749',
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    height: 35,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#007a8c',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    height: 35,
  },
  buttonSecondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    width: '90%',
  },
  checkbox: {
    borderRadius: 5,
    height:12,
    width:12,
    marginLeft: 15,
    marginRight: 10,
    borderWidth:0.3,
    color: 'rgb(51, 103, 73)',
    backgroundColor:'rgba(51, 103, 73,0.3)',
    borderColor: 'rgb(51, 103, 73)'
  },
  checkboxLabel: {
    fontSize: 16,
    color: 'rgb(51, 103, 73)'
  },
  modalContent: {
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-evenly',
    width:screenWidth*0.9,
    height:screenHeight*0.8,
    backgroundColor: 'rgba(246, 246, 246,1)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'rgb(51, 103, 73)',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007a8c',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    width:'80%',
    textAlign:'center'
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center'
  },
//   Nuevos: 
//         verde: #007a8c rgb(0, 122, 140)
//         verde claro: #acd0d5 rgb(172, 208, 213)
//         verdeHoja: background: #336749 rgb(51, 103, 73)
//         gris: #f6f6f6 rgb(246, 246, 246)
// Font:
//         fontFamily: 'Inter-Regular-400', 
  buttonModal: {
    backgroundColor: '#019db2',
    borderRadius: 5,
    padding: 5,
    height: 35,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    borderColor: 'rgb(84, 176, 206)',
    borderWidth: 0.5,
  },
  buttonModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,

  },
  buttonModalIcon: {
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: '#007a8c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 10,
    width: 250,
    alignSelf: 'center'
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center'
  },
  textDate: {
    color: 'rgb(160, 160, 160)',
    fontSize: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  inputdate: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    height: 35,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  pickerWrapper: {
    marginBottom: 10,
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
  termsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  termsText: {
    marginLeft: 8,
    color: '#336749',
  },
});

export default RegisterScreen;

