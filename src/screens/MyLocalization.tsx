import React, {useState} from 'react';
import {
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Box, Button, Flex} from 'native-base';
import MapView, {Region, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {ref, push, set} from 'firebase/database';
import {db} from '../firebase';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../components/MenuProfile';
import {Header} from '../components/Header';
import {useAuthContext} from '../contexts/AuthContext';

interface MyLocalizationProps {
  navigation: NavigationProp<ParamListBase>;
}

const {width} = Dimensions.get('screen');

export function MyLocalization({navigation}: MyLocalizationProps) {
  const [region, setRegion] = useState<Region>({
    latitude: -22.8274127,
    longitude: -47.0523085,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [rua, setRua] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const {user} = useAuthContext();

  console.log(user?.uid);

  function getMyLocation() {
    Geolocation.getCurrentPosition(
      info => {
        console.log('LAT', info.coords.latitude);
        console.log('LONG', info.coords.longitude);

        setRegion({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      err => {
        console.log('deu algum erro', err);
      },
      {
        enableHighAccuracy: true,
        //timeout: 2000,
      },
    );
  }

  const cadastrarEndereco = () => {
    return new Promise<void>((resolve, reject) => {
      if (!rua || !latitude || !longitude) {
        const error = new Error(
          'Por favor, escolha um endereço para prosseguir.',
        );
        reject(error);
        return;
      }

      const novoEnderecoRef = push(ref(db, 'enderecos'));

      const novoEnderecoData = {
        rua,
        latitude,
        longitude,
      };

      set(novoEnderecoRef, novoEnderecoData)
        .then(() => {
          console.log('Endereço cadastrado com sucesso!');
          resolve();
        })
        .catch(error => {
          console.error(`Erro ao cadastrar endereço: ${error.message}`);
          reject(error);
        });
    });
  };

  return (
    <View>
      <SafeAreaView>
        <Flex
          backgroundColor="#CFD2CC"
          height="100%"
          width="100%"
          paddingBottom="4">
          <Header />
          <GooglePlacesAutocomplete
            minLength={2}
            placeholder="Procure um endereço"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (!details?.geometry.location) {
                return;
              }
              setRegion(prev => ({
                ...prev,
                latitude: details?.geometry.location.lat,
                longitude: details?.geometry.location.lng,
              }));
              setRua(details.formatted_address);
              setLatitude(details.geometry.location.lat);
              setLongitude(details.geometry.location.lng);
            }}
            query={{
              language: 'en',
              key: '',
            }}
            onTimeout={console.log}
            onFail={error => console.log(error)}
            styles={{
              description: {
                fontWeight: 'bold',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              listView: {
                color: 'black', //To see where exactly the list is
                zIndex: 2, //To popover the component outwards
                position: 'absolute',
                top: 40,
              },
            }}
          />
          <Box alignItems="center">
            <MapView
              provider={PROVIDER_GOOGLE}
              onMapReady={() => {
                Platform.OS === 'android'
                  ? PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    ).then(() => {
                      console.log('Usuario aceitou');
                      getMyLocation();
                    })
                  : console.log(PermissionsAndroid);
              }}
              initialRegion={region}
              style={{width: width, height: '75%'}}
              region={region}
              zoomEnabled={true}
              minZoomLevel={17}
              loadingEnabled={true}
            />
          </Box>
          <Button
            onPress={() => {
              cadastrarEndereco()
                .then(() => {
                  navigation.navigate('Home');
                })
                .catch(error => {
                  console.error(error);
                });
            }}>
            Salvar endereço
          </Button>
          <Box alignItems="center">
            <Box position="absolute" bottom="2" width="350px">
              <MenuProfile navigation={navigation} />
            </Box>
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
