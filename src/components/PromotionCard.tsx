import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Promotion, ImagePromotion as PromotionImage } from '../redux/types/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store/store';
import { addFavoriteAction, removeFavoriteAction } from '../redux/actions/userActions';
import { getMemoizedFavorites } from '../redux/selectors/userSelectors';
import * as Animatable from 'react-native-animatable';
import type { View as AnimatableView } from 'react-native-animatable';
import { formatDateToDDMMYYYY } from '../utils/formatDate';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PromotionCardProps {
  promotion: Promotion;
  index: number;
  handlePress: (promotion: Promotion) => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, index, handlePress }) => {
  const dispatch: AppDispatch = useDispatch();
  const userFavorites = useSelector(getMemoizedFavorites);
  const [loadingImg, setLoadingImg] = useState(false);
  const heartRefs = useRef<Animatable.View[]>([]);
  const isFavorite = userFavorites.includes(promotion.promotion_id);

  // console.log("pormocion en card", promotion);

  const handleImageLoadStart = () => setLoadingImg(true);
  const handleImageLoadEnd = () => setLoadingImg(false);

  const renderItem = ({ item }: { item: PromotionImage }) => (
    <View style={styles.carouselItem}>

      {/* <Image
        source={{ uri: item.image_path }}
        style={styles.carouselImage}
        onLoadStart={handleImageLoadStart}
        onLoadEnd={handleImageLoadEnd}
      /> */}
    </View>
  );

  const handleFavoritePress = useCallback(() => {
    if (isFavorite) {
      dispatch(removeFavoriteAction(promotion.promotion_id));
    } else {
      dispatch(addFavoriteAction(promotion));
      animateHeart(index);
    }
  }, [dispatch, isFavorite, promotion, index]);

  const animateHeart = (index: number) => {
    if (heartRefs.current[index]?.rubberBand) {
      heartRefs.current[index].rubberBand(1000);
    }
  };

  return (
    <TouchableOpacity
      key={promotion.promotion_id}
      style={styles.promotionCard}
      onPress={() => handlePress(promotion)}
    >
      <View style={styles.carouselItem}>
        {promotion.images.length?
        <Image
          source={{ uri: promotion.images[0].image_path }}
          style={styles.carouselImage}
          onLoadStart={handleImageLoadStart}
          onLoadEnd={handleImageLoadEnd}
        /> : 
        <Image
          source={ require('../../assets/noImageAvailable.png')} 
          style={styles.carouselImage}
          onLoadStart={handleImageLoadStart}
          onLoadEnd={handleImageLoadEnd}
        />
        }
      </View>
      {/* <Carousel
        loop
        width={screenWidth}
        height={screenWidth / 2}
        autoPlay={true}
        autoPlayInterval={5000}
        data={promotion.images}
        scrollAnimationDuration={3000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.8,
          parallaxScrollingOffset: 50,
        }}
        renderItem={renderItem}
        style={styles.carousel}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      /> */}
      <View style={styles.promotionContent}>
        <View style={styles.discountContainerText}>
          <Text style={styles.promotionTitle}>{promotion.title}</Text>
          <Text style={styles.promotionDates}>
            Desde: {formatDateToDDMMYYYY(promotion.start_date)}
          </Text>
          <Text style={styles.promotionDates}>
            Hasta: {formatDateToDDMMYYYY(promotion.expiration_date) }
          </Text>
          <Text style={styles.promotionDates}>
            Disponibles: {promotion.available_quantity? promotion.available_quantity: 'Sin límite'}
          </Text>
        </View>
        <View style={styles.discountContainer}>
        <View style={styles.discountContainerimage}>
          <Image
            source={require('../../assets/starDisc.png')}
            style={styles.discountImage}
          />
          <Text style={styles.discountText}>{promotion.discount_percentage}%</Text>
          <Text style={styles.discountText2}>OFF</Text>
      </View>
          {/* <View style={styles.discountContText}>
            <Text style={styles.discountText}>{promotion.discount_percentage}% OFF</Text>
          </View> */}
          <View style={styles.starCont}>
            <Animatable.View ref={(ref: AnimatableView | null) => {
              heartRefs.current[index] = ref as Animatable.View;
            }}>
              <TouchableOpacity onPress={handleFavoritePress}>
                <MaterialCommunityIcons
                  name={isFavorite ? 'cards-heart' : 'cards-heart-outline'}
                  size={35}
                  color={isFavorite ? '#007a8c' : '#007a8c'}
                  style={styles.star}
                />
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  promotionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 10,
    marginBottom: 25,
    width: '95%',
    alignSelf: 'center',
  },
  promotionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  promotionTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    color: 'rgba(51, 103, 73,1)',
  },
  promotionDates: {
    marginTop: 5,
    fontSize: screenWidth * 0.035,
    color: 'rgb(0, 122, 140)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(51, 103, 73,0.4)',
    marginHorizontal: 15,
  },
  carouselItem: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
  },
  carousel: {
    alignSelf: 'center',
  },
  discountContainerText: {
    width: '80%',
  },
  discountContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '20%',
  },
  discountContText: {
    // backgroundColor: '#fff',
    width: '90%',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  starCont: {
    marginTop: screenWidth * 0.2,
    zIndex: 10,
  },
  star: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    elevation: 1,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.029, 
    position: 'absolute',
    top: 12,
    right:15
  },
  discountText2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.03,
    position: 'absolute',
    top: 27,
    right:15
  },
  discountContainerimage: {
    // backgroundColor: '#FF6347',
    paddingVertical: 0,
    paddingHorizontal: 0,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  discountImage: {
    right:0,
    width: 55, 
    height: 55,
    position: 'absolute',
  },
});

export default React.memo(PromotionCard);
