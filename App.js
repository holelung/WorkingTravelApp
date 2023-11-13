import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert  } from 'react-native';
import React, { useEffect, useState } from "react";
import { theme } from "./colors.js";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY ="@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };
  const loadToDos = async() => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY)
      setToDos( JSON.parse(s))
    } catch(e){

    }
  };
 

  const addToDo = async () => {
    if(text === ""){
      return
    }
    const newToDos = {...toDos, 
      [Date.now()] : {text, working},
    };
    setToDos(newToDos); 
    await saveToDos(newToDos)
    setText("");
  };
  console.log(toDos)
 
  const deleteToDo = async(key) => {
    Alert.alert(
      "Delete To Do?",
      "Are you sure?", [
        {text: "Cancel", style: "cancel"},
        {
          text: "I`m sure",
          style: "destructive",
          onPress: async() => {
           const newToDos = {...toDos};
           delete newToDos[key];
           setToDos(newToDos); 
           await saveToDos(newToDos)
        }},
      ])
  };

  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}> 
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View> 

      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
        style={styles.input} 
      />

      <ScrollView>
        {Object.keys(toDos).map((key) => 
          toDos[key].working === working ?(
          <View style={styles.toDo} key={key}>
             <Text style={styles.toDoText}>{toDos[key].text}</Text>
             <TouchableOpacity onPress={() => deleteToDo(key)}>
             <MaterialCommunityIcons name="delete" size={24} color={theme.grey} />
             </TouchableOpacity>
          </View>
          ) : null
         )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100, 
  },
  btnText: {
    fontSize: 38, 
    fontWeight: "700", 
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20, 
    borderRadius: 15,
    marginVertical: 20,
    fontSize: 16,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius:15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  }
});
