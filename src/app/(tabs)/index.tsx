import { 
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View, } from '@/src/components/Themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { tracks } from '@/assets/data/tracks';
import TrackListItem from '@/src/components/TrackListItem';
import Player from '@/src/components/Player';

const {width, height} = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView>
      
      <FlatList 
        data={tracks}
        renderItem={( {item} ) => 
          <TrackListItem tracks={ item }/>
        }
        showsVerticalScrollIndicator={false}
      />
      
    </SafeAreaView>
  );
}


