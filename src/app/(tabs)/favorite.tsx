import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import React from 'react';
import TrackListItem from '@/src/components/TrackListItem';
import { tracks } from '@/assets/data/tracks';

export default function FavoritesScreen() {
  return (
    <View>
      
      <FlatList 
        data={tracks}
        renderItem={( {item} ) => 
          <TrackListItem tracks={ item }/>
        }
        showsVerticalScrollIndicator={false}
      />
      
    </View>
  );
}

