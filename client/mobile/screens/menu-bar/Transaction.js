import React, { useState } from 'react'; 
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: 'March 3, 2024',
      type: 'Medical Assistance',
      recipient: 'Reported to School Clinic',
      time: '3:00 PM',
    },
    {
      id: 2,
      date: 'April 26, 2024',
      type: 'Utility Failures',
      recipient: 'Reported to GSD',
      time: '10:52 AM',
    },
    {
      id: 3,
      date: 'April 30, 2024',
      type: 'Medical Assistance',
      recipient: 'Reported to School Clinic',
      time: '1:45 PM',
    },
  ]);

  const [details, setDetails] = useState([
    {
      id: 1, 
      responseStart: '3:03 PM',
      sosCallReceived: '3:04 PM',
      dispatch: '3:10 PM',
      responder: 'Erwin Matibag',
      position: 'University Nurse',
    },
    {
      id: 2, 
      responseStart: '3:03 PM',
      sosCallReceived: '3:04 PM',
      dispatch: '3:10 PM',
      responder: 'Erwin Matibag',
      position: 'University Nurse',
    },
    {
      id: 3,
      responseStart: '3:03 PM',
      sosCallReceived: '3:04 PM',
      dispatch: '3:10 PM',
      responder: 'Erwin Matibag',
      position: 'University Nurse',
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.transactionButton} onPress={() => handlePress(item)}>
      <View style={styles.flag} />
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionRecipient}>{item.recipient}</Text>
      </View>
      <Text style={styles.transactionTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  const handlePress = (item) => {
    setSelectedTransaction(item);
    const detail = details.find(detail => detail.id === item.id);
    setSelectedDetail(detail);
    setModalVisible(true);
  };

  return (
    <View>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.transactionsContainer}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Transaction Details</Text>
            <Text style={styles.modalText}>Date: {selectedTransaction && selectedTransaction.date}</Text>
            <Text style={styles.modalText}>Emergency Type: {selectedTransaction && selectedTransaction.type}</Text>
            <Text style={styles.modalText}>Recipient: {selectedTransaction && selectedTransaction.recipient}</Text>
            <Text style={styles.modalText}>Time Reported: {selectedTransaction && selectedTransaction.time}</Text>
            <Text style={styles.modalText}>Response Started: {selectedDetail && selectedDetail.responseStart}</Text>
            <Text style={styles.modalText}>SOS Call Received: {selectedDetail && selectedDetail.sosCallReceived}</Text>
            <Text style={styles.modalText}>Dispatch Time: {selectedDetail && selectedDetail.dispatch}</Text>
            <Text style={styles.modalText}></Text>
            <Text style={styles.modalText}>Responder 1: {selectedDetail && selectedDetail.responder}</Text>
            <Text style={styles.modalText}>Position: {selectedDetail && selectedDetail.position}</Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles .modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#8C1515',
    padding: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8C1515',
  },
  logoSubText: {
    fontSize: 16,
    color: '#8C1515',
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 15,
  },
  transactionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    marginVertical: 3,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  transactionType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  transactionRecipient: {
    color: '#444',
    fontSize: 16,
  },
  transactionTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  flag: {
    width: 15,
    height: 50,
    backgroundColor: '#800000',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
   
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    padding: 13,
    borderBottomWidth: 3,
    borderBottomColor: '#ddd',
  },
  modalText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#800000',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TransactionHistory;