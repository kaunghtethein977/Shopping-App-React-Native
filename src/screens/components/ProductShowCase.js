import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as theme from '../../util/theme';
import ImageView from 'react-native-image-view';
import RenderRatings from './RenderRatings';
import _ from 'lodash';
import ReviewModal from './ReviewModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  onUpdateWishList,
  onRemoveWishList,
} from '../../redux/actions/UserAction';
import RenderHeartButton from './RenderHeartButton';

const {width, height} = Dimensions.get('window');
const scrollX = new Animated.Value(0);

const ProductShowCase = (props) => {
  const [index, setIndex] = useState(null);
  const {item, closeModal} = props;
  const [isVisible, setIsVisible] = useState(false);

  const [reviewVisible, setReviewVisible] = useState(false);

  const dispatch = useDispatch();

  const wishList = useSelector((state) => state.User.WishList);

  const checkWishList = wishList.some((listItem) => listItem.id === item.id);

  const onAdd = () => {
    dispatch(onUpdateWishList(item));
  };

  const onRemove = () => {
    dispatch(onRemoveWishList(item));
  };

  const ToggleReviewVisible = () => {
    setReviewVisible(!reviewVisible);
  };

  const Header = () => {
    return (
      <View style={[styles.flex, styles.row, styles.header]}>
        <TouchableOpacity style={styles.back} onPress={closeModal}>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={30}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, width);

    return (
      <View style={[styles.flex, styles.row, styles.dotsContainer]}>
        {item.images.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`step-${item}-${index}`}
              style={[styles.dots, {opacity}]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {Header()}
      <ScrollView style={styles.flex}>
        <View style={[styles.flex]}>
          <ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center"
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {x: scrollX}}},
            ])}>
            {item.images.map((img, index) => (
              <View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    await setIndex(index);
                    await setIsVisible(true);
                  }}>
                  <Image
                    key={`${index}-${img.source.uri}`}
                    source={{uri: img.source.uri}}
                    resizeMode="cover"
                    style={{width, height: height / 2}}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {renderDots()}
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'transparent',
            paddingVertical: 10,
            justifyContent: 'space-around',
            borderBottomColor: '#bec4cf',
            borderBottomWidth: 0.9,
            alignItems: 'center',
          }}>
          <RenderHeartButton
            onAdd={onAdd}
            onRemove={onRemove}
            checkWishList={checkWishList}
            size={30}
          />
          <TouchableOpacity onPress={() => setReviewVisible(true)}>
            <Ionicons name="newspaper-outline" size={30} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="share-square-o" size={30} color={'black'} />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            visible={reviewVisible}
            onRequestClose={() => ToggleReviewVisible()}>
            <ReviewModal closeModal={() => ToggleReviewVisible()} item={item} />
          </Modal>
        </View>
        <View style={[styles.contentHeader]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.titleText}>{props.item.title}</Text>
            <Text style={styles.priceText}>${props.item.price}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <RenderRatings rating={props.item.rating} />
            <Text>({item.reviews.reviewerCount})</Text>
          </View>
          <Text
            seeMoreStyle={{color: theme.colors.black}}
            seeLessStyle={{color: theme.colors.black}}
            style={styles.description}>
            {item.description}
          </Text>
        </View>
      </ScrollView>
      <ImageView
        images={item.images}
        imageIndex={index}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'black',
  },
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingTop: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  back: {
    width: theme.sizes.base * 3,
    height: theme.sizes.base * 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentHeader: {
    flex: 1,
    padding: 17,
    backgroundColor: theme.colors.white,
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
    right: 0,
    left: 0,
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
  },
  description: {
    marginTop: 20,
    fontWeight: '900',
    fontSize: theme.sizes.h2,
    color: '#121730',
    textAlign: 'justify',
  },
  badgeContainer: {
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: theme.colors.green,
  },
  badgeText: {
    color: theme.colors.light.foreground,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: theme.sizes.h1,
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: theme.sizes.h2,
    color: '#CB1649',
  },
  footerContainer: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: theme.colors.light.background,
  },
  btnContainer: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: theme.sizes.h3,
    color: 'white',
  },
});

export default ProductShowCase;
