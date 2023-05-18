import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, db } from '../firebase/firebase-utilities';
import { useNavigation } from "@react-navigation/native";

const TableListScreen = () => {
  const [tables, setTables] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tables'));
        const tableData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTables(tableData);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  const navigateToTableDetails = (tableId) => {
    navigation.navigate('tableDetailsScreen', { tableId });
  };

  const renderTableItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tableItem}
      onPress={() => navigateToTableDetails(item.id)}
    >
      <View style={styles.tableInfo}>
        <Text style={styles.tableName}>{item.tableName}</Text>
        <Text style={styles.rowCount}>{item.rows?.length || 0} Rows</Text>
      </View>
      <Text style={styles.columnCount}>{item.columns.length} Columns</Text>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      {tables.length === 0 ? (
        <Text>No tables found.</Text>
      ) : (
        <FlatList
          data={tables}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
    paddingHorizontal: "6%",
    backgroundColor: '#ffffff',
  },
  tableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eaeaea',
  },
  tableInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  columnCount: {
    color: '#888888',
  },
  rowCount: {
    color: '#888888',
    marginRight: 8,
  },
});

export default TableListScreen;
