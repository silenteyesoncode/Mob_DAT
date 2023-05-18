import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, db } from '../firebase/firebase-utilities';
import { useNavigation } from "@react-navigation/native";
import { Button_1 } from "../components/export";

const TableCreationScreen = () => {
  const navigation = useNavigation();

  const [tableName, setTableName] = useState('');
  const [columnNames, setColumnNames] = useState(['']);
  const [rowData, setRowData] = useState([]);

  const handleColumnNameChange = (index, columnName) => {
    const updatedColumnNames = [...columnNames];
    updatedColumnNames[index] = columnName;
    setColumnNames(updatedColumnNames);
  };

  const handleRowDataChange = (index, columnName, value) => {
    const updatedRowData = [...rowData];
    if (!updatedRowData[index]) {
      updatedRowData[index] = {};
    }
    updatedRowData[index][columnName] = value;
    setRowData(updatedRowData);
  };

  const addColumn = () => {
    setColumnNames([...columnNames, '']);
  };

  const addRow = () => {
    setRowData([...rowData, {}]);
  };

  const createTable = async () => {
    if (tableName.length == 0) {
      Alert.alert('Error', 'Table name cannot be empty', [{ text: 'OK'}]);
    }else if (columnNames.length == 0) {
      Alert.alert('Error', 'Please input a column', [{ text: 'OK'}]);
    }else{

      try {
        const tableData = {
          tableName,
          columns: columnNames.filter((columnName) => columnName !== ''),
          rows: rowData.filter((row) => Object.keys(row).length > 0),
        };
  
        const docRef = await addDoc(collection(db, 'tables'), tableData);
        console.log('Table created successfully! Document ID:', docRef.id);
        Alert.alert('Success', 'Table created successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } catch (error) {
        console.error('Error creating table:', error);
      }
    }


  };

  return (
    <View style={styles.container}>
      <ScrollView >

      <TextInput
        style={styles.input}
        placeholder="Table Name"
        value={tableName}
        onChangeText={setTableName}
      />

      {columnNames.map((columnName, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Column ${index + 1}`}
          value={columnName}
          onChangeText={(text) => handleColumnNameChange(index, text)}
        />
      ))}

      <View style={styles.button}>
        <Button_1 title="Add Column" onPress={addColumn} />
      </View>
      <ScrollView horizontal={true} >

        {rowData.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            {columnNames.map((columnName, columnIndex) => (
              <TextInput
                key={columnIndex}
                style={styles.input}
                placeholder={`Row ${rowIndex + 1} - ${columnName}`}
                value={row[columnName] || ''}
                onChangeText={(text) => handleRowDataChange(rowIndex, columnName, text)}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.button}>
        <Button_1 title="Add Row" onPress={addRow} />
      </View>

      <View style={styles.button}>
        <Button_1 title="Create Table" onPress={createTable} />
      </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "15%",
    paddingHorizontal: "5%",
    flexDirection: "column",
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  input: {
    marginBottom: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: '8%',
    paddingVertical: '2%',
  }
});

export default TableCreationScreen;
