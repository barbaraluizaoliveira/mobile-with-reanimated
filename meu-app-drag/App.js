import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DROP_ZONE_LEFT = SCREEN_WIDTH * 0.33;
const DROP_ZONE_RIGHT = SCREEN_WIDTH * 0.66;

const CARDS_DATA = [
  { id: 1, text: '🥦 Brócolis' },
  { id: 2, text: '🍕 Pizza' },
  { id: 3, text: '🌧️ Chuva' },
  { id: 4, text: '🏖️ Praia' },
];

function DragCard({ text }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const snapToColumn = (absoluteX) => {
    if (absoluteX < DROP_ZONE_LEFT) {
      translateX.value = withSpring(-SCREEN_WIDTH * 0.25);
      translateY.value = withSpring(0);
    } else if (absoluteX > DROP_ZONE_RIGHT) {
      translateX.value = withSpring(SCREEN_WIDTH * 0.25);
      translateY.value = withSpring(0);
    } else {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);
      runOnJS(snapToColumn)(event.absoluteX);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: scale.value > 1 ? 99 : 1,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.cardText}>{text}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        
        <View style={styles.columnsContainer}>
          <View style={[styles.column, styles.columnLeft]}>
            <Text style={styles.columnTitle}>NÃO GOSTO 👎</Text>
          </View>
          
          <View style={[styles.column, styles.columnRight]}>
            <Text style={styles.columnTitle}>GOSTO 👍</Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {CARDS_DATA.map((item) => (
            <DragCard key={item.id} text={item.text} />
          ))}
        </View>

      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  columnsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '33%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  columnLeft: {
    backgroundColor: '#ffebee',
    borderRightWidth: 2,
    borderRightColor: '#ffcdd2',
  },
  columnRight: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 2,
    borderLeftColor: '#c8e6c9',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 140,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
  },
});