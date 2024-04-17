import { 
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View, } from '@/src/components/Themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.shadowed}>
          <View style={styles.musicControls}>
              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="shuffle" size={30} color="#EDF4F2" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="play-skip-back" size={30} color="#EDF4F2" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                  <Ionicons
                      name={'play-circle'}
                      size={75}
                      color="#EDF4F2"
                  />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="play-skip-forward" size={30} color="#EDF4F2" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="repeat" size={30} color="#EDF4F2" />
              </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomIconWrapper}>
              <TouchableOpacity>
                <Ionicons name="share-outline" size={25} color="#EDF4F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="heart-outline" size={25} color="#EDF4F2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#31473A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  mainContainer: {
    flex: 1,
    fontFamily: 'Helvetica',
  },
  shadowed: {
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    //backgroundColor: 'rgba(237, 244, 242, 0.5)',
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '65%',
    marginBottom: 15,
  },
  bottomContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
  },
});
