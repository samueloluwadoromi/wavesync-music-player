import { FlatList, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import React, { useState } from 'react';
import TrackListItem from '@/src/components/TrackListItem';
import { tracks } from '@/assets/data/tracks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function SearchScreen() {
  const [search, setSearch]= useState('');
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <FontAwesome name='search' size={16} color='#EDF4F2'/>
        <TextInput 
          placeholder='What do you want to listen to' 
          style={styles.input}
          placeholderTextColor='rgba(0, 0, 0, 0.4)'
          value={search}
          onChangeText={setSearch}
        />
        <Text onPress={() => setSearch('')}>
          Cancel
        </Text>
      </View>

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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#EDF4F2',
    padding: 8,
    marginHorizontal: 10,
    borderRadius: 5,
    color: '#000000'
  },
})