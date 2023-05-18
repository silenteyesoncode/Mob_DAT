
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { collection, doc, getDoc, getDocs , db, updateDoc, deleteDoc } from '../firebase/firebase-utilities';
import { Button_1 , colors } from "../components/export";
import { useNavigation } from "@react-navigation/native";
 

const TableDetailsScreen = ({ route }) => {


  const navigation = useNavigation();


  const { tableId } = route.params;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [newRowData, setNewRowData] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [refresh, setRefresh] = useState(false); // Refresh state

  useEffect(() => {
    const fetchTableDetails = async () => {
      try {
        const tableDocRef = doc(db, 'tables', tableId);
        const tableDocSnapshot = await getDoc(tableDocRef);
        if (tableDocSnapshot.exists()) {
          const { columns: tableColumns, rows: tableRows } = tableDocSnapshot.data();
          setColumns(tableColumns);
          setRows(tableRows);
        } else {
          console.log('Table does not exist.');
        }
      } catch (error) {
        console.error('Error fetching table details:', error);
      }
    };

    fetchTableDetails();
  }, [tableId , refresh]);

  const handleAddRow = async () => {
    try {
      // Update the rows in the Firestore database
      const tableDocRef = doc(db, 'tables', tableId);
      await updateDoc(tableDocRef, {
        rows: [...rows, newRowData],
      });

      console.log('Row added successfully!');
      setNewRowData({});
      setShowTable(false)
      setRefresh(!refresh); // Toggle the refresh state
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const handleInputChange = (columnName, value) => {
    setNewRowData((prevData) => ({
      ...prevData,
      [columnName]: value,
    }));
  };

  

  const handleDeleteTable = async () => {
    try {
      // Delete the table document from Firestore
      const tableDocRef = doc(db, 'tables', tableId);
      await deleteDoc(tableDocRef);
      Alert.alert('Success', 'Table Deleted successfully!', [{ text: 'OK', onPress: () => navigation.navigate("welcome_screen") }]);

      console.log('Table deleted successfully!');
      // Optionally, you can navigate to a different screen after deleting the table
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Table Details</Text>
      <View style={styles.tableContainer}>
        
        {/* Render the header row if columns are defined */}
        {columns && columns.length > 0 && (
          <View style={styles.row}>
            {columns.map((column, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {column}
              </Text>
            ))}
          </View>
        )}

        {/* Render the data rows if rows are defined */}
        {showTable == false && rows && rows.length > 0 ? (
          rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {columns.map((column, columnIndex) => (
                <Text key={columnIndex} style={styles.cell}>
                  {row[column]}
                </Text>
              ))}
            </View>
          ))
        ) : (
          <Text>Updating...</Text>
        )}

      {showTable == true && (
        <View>
          {columns.map((column, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={column}
              value={newRowData[column] || ''}
              onChangeText={(text) => handleInputChange(column, text)}
            />
          ))}
          <View style={styles.button}>
            <Button_1 title="Add Row" onPress={handleAddRow} />
          </View>
          <View style={styles.button}>
            <Button_1 title="Cancle" onPress={() => setShowTable(false)} />
          </View>
          
        </View>
      )}

      </View>
      {showTable == false ? (
          <View style={styles.button}>
            <Button_1 title="Add Data" onPress={() => setShowTable(true) } />
          </View> 
          
      ) : ( <View /> ) 
    }
      <View style={styles.button}>
        <Button_1 title="Delete Table" onPress={handleDeleteTable} />
      </View>
     
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: "5%",
  },
  tableContainer: {
    marginBottom: "5%",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    paddingHorizontal: '5%',
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  input: {
    paddingVertical: '3%',
    paddingHorizontal: '2%',
    marginBottom: "2%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    },
    button: {
      width: '100%',
      // backgroundColor: colors.test1,
      paddingHorizontal: '8%',
      paddingVertical: '2%',
    }
});
    
    
    
export default TableDetailsScreen;