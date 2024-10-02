import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedPromotions } from '../redux/selectors/promotionSelectors';
import MapView, { Marker } from 'react-native-maps';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import PromotionCard from '../components/PromotionCard';
import PromotionCardSmall from '../components/PromotionCardSmall';
import { Promotion } from '../redux/types/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { getMemoizedBranchRatingsWithMetadata } from '../redux/selectors/branchSelectors';
import { AppDispatch } from '../redux/store/store';
import { fetchBranchRatings } from '../redux/actions/branchActions';
import SemicirclesOverlay from '../components/SemicirclesOverlay';

const { width } = Dimensions.get('window');

type RouteParams = {
    branch: {
      branch_id: number;
      name: string;
      address: string;
      image_url?: string;
      latitude: number;
      longitude: number;
    };
  };
  
  const BranchDetails = () => {
    const route = useRoute();
    const dispatch: AppDispatch = useDispatch();
    const { branch } = route.params as RouteParams;
  const promotions = useSelector(getMemoizedPromotions);
  const ratings = useSelector(getMemoizedBranchRatingsWithMetadata);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    console.log("sucursal seleccionada",branch);
    console.log("promociones seleccionada",promotions);
  const filteredPromotions = promotions.filter(promotion => promotion.branch_id === branch.branch_id);


  useEffect(() => {
    if (branch) {
      dispatch(fetchBranchRatings(branch.branch_id));
    }
  }, [branch]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : i - rating <= 0.5 ? 'star-half' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const handlePress = useCallback((promotion: Promotion) => {
    navigation.navigate('PromotionDetail', { promotion });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
        {/* <SemicirclesOverlay/> */}
        {branch.image_url && (
          <Image source={{ uri: branch.image_url }} style={styles.image} />
        )}
        <View style={styles.container2}>
      <View style={styles.header}>
        <View style={styles.ratingContainerTitle}>
        <Text style={styles.title}>{branch.name}</Text>
        <View style={styles.stars}>
            {renderStars(ratings.average_rating)}
        </View>
        </View>
      </View>
        <Text style={styles.address}>{branch.address}</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: branch.latitude,
          longitude: branch.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: branch.latitude, longitude: branch.longitude }} />
      </MapView>

      <View style={styles.promotionsContainer}>
        <Text style={styles.promotionsTitle}>Promociones:</Text>
        {filteredPromotions.length > 0 ? (
          filteredPromotions.map((promotion, index) => (
            <PromotionCardSmall
                    key={promotion.promotion_id}
                    promotion={promotion}
                    index={index}
                    handlePress={handlePress}
                />
          ))
        ) : (
          <Text>No hay promociones disponibles para esta sucursal.</Text>
        )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
      },
      container2: {
        padding: 20,
      },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: width*0.05,
    fontWeight: 'bold',
    color:'#007a8c'
  },
  stars:{
    // marginVertical: 20,
    width: width*0.042,
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'flex-end',
  },
  address: {
    fontSize: width*0.035,
    color: '#336749',
  },
  ratingContainerTitle: {
    marginVertical: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center',
    // justifyContent:'flex-end',
    justifyContent: 'space-between'
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 0,
    marginTop: 0,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  promotionsContainer: {
    marginTop: 20,
    marginBottom:50
  },
  promotionsTitle: {
    marginBottom:10,
    fontSize: 15,
    color:'#333',
    fontWeight: 'bold',
  },
  promotionItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default BranchDetails;
