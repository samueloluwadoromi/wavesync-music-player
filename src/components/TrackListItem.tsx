import { 
    Text, 
    View, 
    StyleSheet, 
    Image, 
    Dimensions, 
    SafeAreaView 
} from 'react-native';
import { Track } from '../types';

type TrackListItemProps = {
    tracks: Track
}

const {width, height} = Dimensions.get('window');

export default function TrackListItem({ tracks }: TrackListItemProps){
    return(
        <View style={styles.container}>
            <Image source={{ uri: tracks.album.images[0]?.url}} style={styles.image}/>

            <View style={styles.trackDetails}>
                <Text style={styles.title}>
                    {tracks.name}
                </Text>
                <Text style={styles.subtitle}>
                    {tracks.artists[0]?.name}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#31473A',
        marginVertical: 5,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
    },
    trackDetails:{
        width: width - 85,
    },
    title: {
        color: '#EDF4F2',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 1,
    },
    subtitle: {
        //color: '#31473A',
        color: '#EDF4F2',
        fontWeight: '300',
        fontSize: 12,
        marginTop: 1,
    },
    image: {
        width: 64, 
        aspectRatio: 1,
        borderRadius: 5, 
        marginRight: 10,
    },
})