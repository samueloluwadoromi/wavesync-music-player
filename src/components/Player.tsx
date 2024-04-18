import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tracks } from '../../assets/data/tracks';
import { usePlayerContext } from '../providers/PlayerProvider';
import React, { useEffect, useState } from 'react';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import Slider from '@react-native-community/slider';
// import  MarqueeText  from 'react-native-marquee-ab';


const track = tracks[0];

const {width, height} = Dimensions.get('window');

const Player = () => {
    const { track } = usePlayerContext();
    const [ sound, setSound ] = useState<Sound>();
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ maximized, setMaximized] = useState(false);

    useEffect(() => {
      if (track){
        playTrack();
      }
    }, [track]);

    useEffect(() => {
      return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
    }, [sound]);

    /** Change player size */
    const toggleMaximized = () => {
      setMaximized(!maximized);
    }

    /** Play selected track */
    const playTrack = async () => {
      if (sound){
        await sound.unloadAsync();
      }
      if (!track?.preview_url){
        return;
      }
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: track.preview_url,
      });
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(onPlayBackStatusUpdate);
      await newSound.playAsync();
    };

    /** Get the playback status and record if the song is playing */
    const onPlayBackStatusUpdate = (status: AVPlaybackStatus) => {
      console.log(status)
      if (!status.isLoaded){
        return
      }
      setIsPlaying(status.isPlaying);
    };

    /** Control the play and pause function of the music player */
    const onPlayPause = async () => {
      if (!sound) {
        return
      }
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    };

  if (!track) {
    return null;
  }

  const image = track.album.images?.[0];

  if (!maximized) {
    return (
      <TouchableOpacity style={styles.container} onPress={toggleMaximized}>
        <View style={styles.player}>
          {image && <Image source={{ uri: image.url }} style={styles.image} />}

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{track.name}</Text>
            <Text style={styles.subtitle}>{track.artists[0]?.name}</Text>
          </View>

          <Ionicons
            name={'heart-outline'}
            size={20}
            color={'white'}
            style={{ marginHorizontal: 10 }} />
          <Ionicons
            onPress={onPlayPause}
            disabled={!track?.preview_url}
            name={isPlaying ? 'pause' : 'play'}
            size={22}
            color={track?.preview_url ? 'white' : 'gray'} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
      <SafeAreaView style={[styles.maxContainer]}>
        <TouchableOpacity style={styles.backButton} onPress={toggleMaximized}>
          <Ionicons name="chevron-down" size={36} color="#EDF4F2" />
        </TouchableOpacity>
        
        <ImageBackground source={{ uri: image.url }} style={styles.musicImage}>
          <View style={styles.maxMainPlayer}>
            {/** song details */}
            <View>
              <Text style={[styles.songContent, styles.songTitle]}>
                {track.name}
              </Text>
              <Text style={[styles.songContent, styles.songArtist]}>
                {track.artists[0]?.name}
              </Text>
            </View>

            {/** song duration slider */}
            <View>
              <Slider 
                style={styles.progressBar}
                value={0}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor="#EDF4F2"
                minimumTrackTintColor="#EDF4F2"
                maximumTrackTintColor="#EDF4F2"
                onSlidingComplete={() => {}}
              />

              <View style={styles.progressLevelDuration}>
                <Text style={styles.progressLabelText}>
                  00:00
                </Text>
                <Text style={styles.progressLabelText}>
                  00:00
                </Text>
              </View>
            </View>
            {/** music controls */}
            <View style={styles.musicControls}>
              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="shuffle" size={30} color="#EDF4F2" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="play-skip-back" size={30} color="#EDF4F2" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <Ionicons
                  onPress={onPlayPause}
                  disabled={!track?.preview_url}
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={75}
                  color={track?.preview_url ? '#EDF4F2' : '#EDF4F2'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="play-skip-forward" size={30} color="#EDF4F2" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="repeat" size={30} color="#EDF4F2" />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomcontainer}>
              <View style={styles.bottomIconWrapper}>
                  <TouchableOpacity onPress={() => {}}>
                      <Ionicons name="share-outline" size={25} color="#EDF4F2" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {}}>
                      <Ionicons name="heart-outline" size={25} color="#EDF4F2" />
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
        
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: -75,
    height: 75,
    padding: 10,
  },
  player: {
    backgroundColor: '#31473A',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 3,
    paddingRight: 15,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: 'lightgray',
    fontSize: 12,
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
  maxContainer: {
    width: width,
    height: height - 170,
    backgroundColor: '#31473A',
  },
  maxMainPlayer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 1,
  },
  musicImage: {
    opacity: 0.7,
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  songContent:{
    textAlign: 'center',
    color: '#EDF4F2',
  },
  songTitle: {
    fontSize: 25,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 15,
    fontWeight: '400',
  },
  progressBar: {
    width: width,
    height: 40,
    flexDirection: 'row',
  },
  progressLevelDuration: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    fontSize: 10,
    color: '#EDF4F2',
    fontWeight: '500',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
    marginBottom: 15,
  },
  bottomcontainer: {
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 10,
},
});

export default Player;