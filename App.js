import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

const screen = Dimensions.get("window");

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};

const CREATE_MINUTES = createArray(11);
const CREATE_SECOND = createArray(60);

const getValue = (number) => {
  return `0${number}`.slice(-2);
};

const getRemaining = (time_item) => {
  const Minutes = Math.floor(time_item / 60);
  const Second = time_item - (Minutes*60);

  return { minutes: getValue(Minutes), second: getValue(Second) };
};

export default class App extends React.Component {
  state = {
    remainingSecond: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSecond: "0"
  };

  interval = null;

  start = () => {
    this.setState((index) => ({
      remainingSecond:
        parseInt(index.selectedMinutes, 10) * 60 +
        parseInt(index.selectedSecond, 10),
      isRunning: true,
    }));
    this.interval = setInterval(() => {
      this.setState(
        (index) => ({
          remainingSecond: index.remainingSecond - 1,
        })

      );
    }, 1000);
  };

  stop = () => {
  
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSecond: 5,
      isRunning: false,
    });
  };

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remainingSecond === 0 && prevState.remainingSecond !== 0) {
      this.stop();
    }
    if (this.state.remainingSecond === 5 && prevState.remainingSecond === 0) {
      Alert.alert('Chú ý', 'Hãy chọn giờ để countdown', [
        {text: 'OK', onPress: () => this.stop()},
      ]);
      console.log(this.state.selectedMinutes)
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  RenderPicker = () => {
    return (
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={(item, itemIndex) =>
            this.setState({ selectedMinutes: item })
          }
          selectedValue={this.state.selectedMinutes}
          mode="dropdown"
        >
          {CREATE_MINUTES.map((value) => (
            <Picker.Item key={value} value={value} label={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}> Minutes </Text>

        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedSecond}
          onValueChange={(item, itemIndex) =>
            this.setState({ selectedSecond: item })
          }
          mode="dropdown"
        >
          {CREATE_SECOND.map((item, itemIndex) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}> Second </Text>
      </View>
    );
  };

  render() {
    const { minutes, second } = getRemaining(this.state.remainingSecond);
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />

        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${minutes}:${second}`}</Text>
        ) : (
          this.RenderPicker()
        )}
        {this.state.isRunning ? (
          <TouchableOpacity
            style={[styles.buttonView, styles.buttonViewStop]}
            onPress={this.stop}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.buttonView}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },

  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    color: "#fff",
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#07121B",
        // backgroundColor: "#070707",
        backgroundColor: "#fff",
        marginLeft: 10,
      
        
      },
    }),
    flex: 1,
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
   pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  buttonView: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonViewStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
});
