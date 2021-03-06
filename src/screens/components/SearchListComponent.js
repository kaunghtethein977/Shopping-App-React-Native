import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as theme from '../../util/theme';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  onUpdateWishList,
  onUpdateCart,
  onRemoveWishList,
} from '../../redux/actions/UserAction';
import ProductShowCase from './ProductShowCase';
import RenderHeartButton from './RenderHeartButton';

const SearchListComponent = ({item}) => {
  const dispatch = useDispatch();

  const [productVisible, setProductVisible] = useState(false);
  const wishList = useSelector((state) => state.User.WishList);

  const ToggleProductVisible = () => {
    setProductVisible(!productVisible);
  };

  const didUpdateCart = (unit) => {
    item.unit = unit;
    dispatch(onUpdateCart(item));
  };

  const checkWishList = wishList.some((listItem) => listItem.id === item.id);

  const onAdd = () => {
    dispatch(onUpdateWishList(item));
  };

  const onRemove = () => {
    dispatch(onRemoveWishList(item));
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={productVisible}
        onRequestClose={() => ToggleProductVisible()}>
        <ProductShowCase
          closeModal={() => ToggleProductVisible()}
          item={item}
        />
      </Modal>
      <TouchableOpacity
        style={styles.subContainer}
        activeOpacity={0.8}
        onPress={() => ToggleProductVisible()}>
        <View style={[styles.imgContainer]}>
          <Image
            source={{uri: item.preview}}
            style={{width: 100, height: 150, borderRadius: 10}}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.nameText}>{item.title}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo name="shop" size={25} color={theme.colors.gray} />
            <Text
              style={[
                styles.nameText,
                {marginLeft: 5, fontSize: 12, color: theme.colors.gray},
              ]}>
              {item.shop.name}
            </Text>
          </View>
          <Text style={styles.priceText}>{item.price}.00$</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.cartButton}
              activeOpacity={0.8}
              onPress={() => {
                let unit = isNaN(item.unit) ? 0 : item.unit;
                didUpdateCart(unit + 1);
              }}>
              <Text style={{color: 'white'}}>Add to Cart</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => dispatch(onUpdateWishList(item))}>
              <EvilIcons name="heart" size={30} color={'red'} />
            </TouchableOpacity> */}
            <RenderHeartButton
              onAdd={onAdd}
              onRemove={onRemove}
              checkWishList={checkWishList}
              size={20}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    // borderWidth: 0.7,
    // borderColor: theme.colors.gray,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 5,
  },
  subContainer: {
    flexDirection: 'row',
  },
  imgContainer: {
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-evenly',
  },
  nameText: {
    fontWeight: '900',
    fontSize: theme.sizes.h3,
  },
  priceText: {
    marginTop: 7,
    fontWeight: 'bold',
    color: 'red',
  },
  cartButton: {
    justifyContent: 'center',
    width: 140,
    height: 30,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 20,
  },
});

export default SearchListComponent;
