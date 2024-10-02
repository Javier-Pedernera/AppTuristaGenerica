import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainAppScreen from '../screens/MainAppScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PromotionsScreen from '../screens/PromotionsScreen';
import CustomHeader from '../components/CustomHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PromotionDetailScreen from '../screens/PromotionDetailScreen';
import { Promotion, TouristPoint } from '../redux/types/types';
import { getMemoizedAccessToken } from '../redux/selectors/userSelectors';
import FavoritesScreen from '../screens/FavoritesScreen';
import TouristDetailScreen from '../screens/TouristDetailScreen';
import LandingPage from '../screens/LandingPage';
import { LinkingOptions } from '@react-navigation/native';

export type RootStackParamList = {
  Landing: undefined;
  MainAppScreen: undefined;
  Home: undefined;
  Login: { promotionId?: number };
  Register: undefined;
  ForgotPassword: undefined;
  Profile: undefined;
  FavoritesScreen: undefined;
  PromotionsScreen: undefined;
  ResetPassword: undefined;
  PromotionDetail: { promotionId: number };
  TouristDetailScreen: { touristPoint: TouristPoint };
  MainTabs: { screen: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['https://app-cobquecura.vercel.app', 'cobquecurapp://'],
  config: {
    screens: {
      Landing: 'landing',
      Home: 'home',
      Login: 'login/:promotionId?',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password',
      MainAppScreen: 'main',
      Profile: 'profile',
      FavoritesScreen: 'favorites',
      PromotionsScreen: 'promotions',
      PromotionDetail: 'PromotionDetail/:promotionId'
    },
  },
};

const AppNavigator = () => {
  const accessToken = useSelector(getMemoizedAccessToken);
  const isAuthenticated = !!accessToken;
  // console.log("isAuthenticated en appnavigator",isAuthenticated);


  return (
    <NavigationContainer independent={true} linking={linking}>
      <Stack.Navigator initialRouteName={isAuthenticated ? "MainAppScreen" : "Landing"} screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainAppScreen"
              component={MainAppScreen}
              options={{
                headerShown: true,
                header: () => <CustomHeader />
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: false,
                headerTitle: 'Perfil',
                headerStyle: { backgroundColor: '#007a8c' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="FavoritesScreen"
              component={FavoritesScreen}
              options={{
                headerShown: false,
                headerTitle: 'Promociones Favoritas',
                headerStyle: { backgroundColor: '#007a8c' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="TouristDetailScreen"
              component={TouristDetailScreen}
              options={{
                headerShown: false,
                headerTitle: "Detalles",
                headerStyle: { backgroundColor: '#007a8c' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="PromotionDetail"
              component={PromotionDetailScreen}
              options={{
                headerShown: false,
                headerTitle: "Detalles",
                headerStyle: { backgroundColor: '#007a8c' },
                headerTintColor: '#fff',
              }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

