import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tracks } from '../../assets/data/tracks';
import { usePlayerContext } from '../providers/PlayerProvider';
import React, { useEffect, useState } from 'react';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import Slider from '@react-native-community/slider';
// import  MarqueeText  from 'react-native-marquee-ab';


//const track = tracks[0];

// get dimension of the device screen
const {width, height} = Dimensions.get('window');

const Player = () => {
  // use the track from context
  const { track, setTrack } = usePlayerContext();

  /** Initializing state variables */
  const [ sound, setSound ] = useState<Sound>();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ maximized, setMaximized] = useState(false);
  const [ isRepeated, setIsRepeated ] = useState(false);
  const [ position, setPosition ] = useState('00:00');
  const [ sliderPosition, setSliderPosition ] = useState(0);
  const [sliderDuration, setSliderDuration] = useState<number | undefined>(undefined);
  const [ songDuration, setSongDuration ] = useState('00:00');

  /** handle changes in the selected track */
  useEffect(() => {
    if (track){
      playTrack();
    }
  }, [track]);

  /** handle unloading the track when a new track is selected */
  useEffect(() => {
    return sound
    ? () => {
      sound.unloadAsync();
    }
    : undefined;
  }, [sound]);

  /** Change player size */
  const toggleMaximized = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMaximized(!maximized);
  };

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
    //console.log(status)
    if (!status.isLoaded){
      return
    }

    // If the playback has ended and repeat mode is active, replay the song
    if (status.didJustFinish && isRepeated) {
      playTrack();
    }

    setIsPlaying(status.isPlaying);

    setSliderPosition(status.positionMillis);
    setSliderDuration(status.playableDurationMillis);

    // Calculate the postion and duration in seconds
    const positionInSeconds = status.positionMillis / 1000;
    const durationInSeconds = (status.durationMillis ?? 0) / 1000;

    // Format the position and duration into mm:ss format
    const positionFormatted = formatTime(positionInSeconds);
    const durationFormatted = formatTime(durationInSeconds);

    // Update the UI with the position and duration
    setPosition(positionFormatted);
    setSongDuration(durationFormatted);
  };

  /** Function to format time into mm:ss format */
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

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

  /** Control the song position with the slider */
  const onSliderValueChange = (value: number) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  };

  /** Control song repeat functions */
  const toggleRepeatMode = () => {
    setIsRepeated(!isRepeated);
  };

  /** shuffle the songs */
  const shuffleSongs = () => {
    // Implement Shuffle
  };
  
  /** play the previous song */
  const playPreviousSong = async () => {
    if (!track){
      return;
    }

    const currentIndex = tracks.findIndex((item) => item.id === track.id);
    const previousIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    const previousTrack = tracks[previousIndex]; 

    if (previousTrack){
      // update the player context with the previous track
      setTrack(previousTrack)
    }
  };
  
  /** play the next song */
  const playNextSong = async() => {
    if (!track) {
      return;
    }

    const currentIndex = tracks.findIndex((item) => item.id === track.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];

    if (nextTrack) {
      // update the player context with the next track
      setTrack(nextTrack);
    }
  };

  if (!track) {
    return null;
  }

  const image = track.album.images?.[0];

  return (
    <View>
      {!maximized ? (
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
      ) : (
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
                  value={sliderPosition}
                  minimumValue={0}
                  maximumValue={sliderDuration}
                  thumbTintColor="#EDF4F2"
                  minimumTrackTintColor="#EDF4F2"
                  maximumTrackTintColor="#31473A"
                  onSlidingComplete={(value) => {
                    if (value === sliderDuration && !isRepeated) {
                      playNextSong();
                    }
                  }}
                  onValueChange={onSliderValueChange}
                />

                <View style={styles.progressLevelDuration}>
                  <Text style={styles.progressLabelText}>
                    {position}
                  </Text>
                  <Text style={styles.progressLabelText}>
                    {songDuration}
                  </Text>
                </View>
              </View>
              {/** music controls */}
              <View style={styles.musicControls}>
                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="shuffle" size={30} color="#EDF4F2" onPress={shuffleSongs}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="play-skip-back" size={30} color="#EDF4F2" onPress={playPreviousSong}/>
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
                    <Ionicons name="play-skip-forward" size={30} color="#EDF4F2" onPress={playNextSong}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="repeat" size={30} color={isRepeated ? '#31473A' : '#EDF4F2'} onPress={toggleRepeatMode} />
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
      )
    }
    </View>
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