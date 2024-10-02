import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
import { Branch } from '../redux/types/types';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SemicirclesOverlay from '../components/SemicirclesOverlay';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Branches: undefined;
  BranchDetails: { branch: Branch };
};

const BranchesScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const branches = useSelector(getMemoizedBranches);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>(branches);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [addressFilter, setAddressFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let filtered = branches;

    if (nameFilter) {
      filtered = filtered.filter(branch =>
        branch.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (addressFilter) {
      filtered = filtered.filter(branch =>
        branch.address.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(branch => branch.status.name === statusFilter);
    }

    setFilteredBranches(filtered);
  }, [nameFilter, addressFilter, statusFilter, branches]);

  const handleBranchPress = (branch: Branch) => {
    navigation.navigate('BranchDetails', { branch });
  };

  return (
    <ScrollView style={styles.container}>
      <SemicirclesOverlay />
      <View style={styles.container2}>
        <View style={styles.filterContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={nameFilter}
              onChangeText={(text) => setNameFilter(text)}
              placeholder="Buscar por nombre"
            />
            <MaterialCommunityIcons name="store-search-outline" size={24} color="#acd0d5" style={styles.inputIcon} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={addressFilter}
              onChangeText={(text) => setAddressFilter(text)}
              placeholder="Buscar por dirección"
            />
            <MaterialCommunityIcons name="store-marker-outline" size={24} color="#acd0d5" style={styles.inputIcon} />
          </View>
        </View>

        <View style={styles.branchesList}>
          {filteredBranches.length > 0 ? (
            filteredBranches.map(branch => (
              <TouchableOpacity 
                key={branch.branch_id} 
                style={styles.branchItem}
                onPress={() => handleBranchPress(branch)}
              >
                <View style={styles.branchInfo}>
                  <Text style={styles.branchTitle}>{branch.name}</Text>
                  <Text style={styles.branchAddress}>{branch.address}</Text>
                </View>
                {branch.image_url && (
                  <Image
                    source={{ uri: branch.image_url }}
                    style={styles.branchImage}
                    alt={branch.name}
                  />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text>No se encontraron sucursales.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  container2: {
    padding: 20,
  },
  filterContainer: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    paddingRight: 40,
    borderColor: '#acd0d5',
    borderWidth: 1,
    color: "#000",
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
  },
  branchesList: {
    marginTop: 20,
  },
  branchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#acd0d5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  branchInfo: {
    flex: 1,
    marginRight: 10,
  },
  branchTitle: {
    fontSize: width*0.05,
    fontWeight: 'bold',
    color:'#007a8c'
  },
  branchAddress: {
    fontSize: width*0.03,
    color:'#333'
    // fontWeight: 'bold',
  },
  branchImage: {
    width: 40,
    height: 40,
  },
});

export default BranchesScreen;
