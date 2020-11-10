import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, SafeAreaView, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';
import NewReminder from '../components/NewReminder';
import { Text, View } from '../components/Themed';

export default function TabOneScreen() {

	const defaultData = [
		{
			"title": "task1", 
			"date": new Date(1598051730000)
		}, 
		{
			"title": "task2",
			"date": new Date(1598056000000)
		} 
	];

	const [allReminders, setAllReminders] = useState([...defaultData]);

	// For dev use; re-initialize data at any time
	const setDefaultData = async () => {
		const newReminders = [...defaultData];
		const dataToStore = JSON.stringify({"data": newReminders});
		try {
			await AsyncStorage.setItem('@reminder_data', dataToStore);
			setAllReminders(newReminders);
		} catch(e){
			console.log("Error storing data: " + e);
		}
	};

	const storeData = async (contents) => {
		const newReminders = [...allReminders];
		newReminders.push(contents);
		const dataToStore = JSON.stringify({"data": newReminders});
		try {
			await AsyncStorage.setItem('@reminder_data', dataToStore);
			setAllReminders(newReminders);
		} catch(e){
			console.log("Error storing data: " + e);
		}
	};

	const getData = async () => {
		try {
			const stringReminders = await AsyncStorage.getItem('@reminder_data')
			console.log("returned stored object: " + JSON.stringify(stringReminders));
			return jsonReminders = (stringReminders != null) ? JSON.parse(stringReminders).data : null;
		} catch (e) {
			console.log("Error loading data: " + e);
		}
	}

	useEffect(() => {
		getData().then((arrReminders) => {
			console.log("useEffect jsonReminders: " + JSON.stringify(arrReminders));
			setAllReminders(arrReminders);
		}, () => {
			setAllReminders(defaultData);
		});
	}, []);

	const renderItem = ({ item, index }) => (
		<View>
			<Text>{ item.title }: { JSON.stringify(item.date) }</Text>
		</View>
	);

  return (
    <View style={styles.container}>

			<Button onPress={setDefaultData} title="reset to default Data" />

			<NewReminder insertData={storeData}/>

			<SafeAreaView style={{flex: 1}} >
				<FlatList
					data={allReminders}
					renderItem={renderItem}
				/>
			</SafeAreaView>

      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
