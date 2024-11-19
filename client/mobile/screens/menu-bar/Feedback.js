import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Animated, Alert, SafeAreaView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';

const { width, height } = Dimensions.get('window'); 

const FeedbackComponent = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [displayWithName, setDisplayWithName] = useState(false); 
  const [displayAnonymously, setDisplayAnonymously] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(false);
  const [selectedImprovements, setSelectedImprovements] = useState([]);
  const [thankYouVisible, setThankYouVisible] = useState(false); 
  const fadeAnim = useState(new Animated.Value(0))[0]; 

  const improvementOptions = [
    'Overall Services',
    'External Communication Process',
    'Rescue Speed and Efficiency',
    'Staff Preparedness',
    'Evacuation Planning',
    'Dissemination of Information',
  ];

  const isFeedbackComplete = () => {
    if (
      rating === 0 ||
      selectedImprovements.length === 0 ||
      (!displayWithName && !displayAnonymously) ||
      feedbackText.trim() === ''
    ) {
      return false;
    }
    return true;
  };

  const openModal = () => {
    if (isFeedbackComplete()) {
      setSelectedAlert(true);
    } else {
      Alert.alert('Incomplete Feedback', 'Please complete the feedback.');
    }
  };
  
  const closeModal = () => {
    setSelectedAlert(false);
  }; 

  const handleConfirm = () => {
    closeModal();
    handleFeedbackSubmit(); 
  };

  const handleFeedbackSubmit = () => {
    const feedbackData = {
      rating,
      feedbackText,
      displayWithName,
      displayAnonymously,
      selectedImprovements,
    };
    console.log('Feedback Submitted: ', feedbackData);
    resetFormData();
    showThankYouScreen(); 
  };

  const resetFormData = () => {
    setRating(0);                
    setFeedbackText('');          
    setDisplayWithName(false);    
    setDisplayAnonymously(false);
    setSelectedImprovements([]);
  };

  const handleCheckboxChange = (type) => {
    if (type === 'name') {
      setDisplayWithName(true);
      setDisplayAnonymously(false);
    } else {
      setDisplayWithName(false);
      setDisplayAnonymously(true);
    }
  };

  const handleImprovementSelect = (option) => {
    setSelectedImprovements((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((item) => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const showThankYouScreen = () => {
    setThankYouVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setThankYouVisible(false);
        navigation.navigate('Homepage'); 
      });
    }, 5000);
  };

  const CustomCheckBox = ({ value, onValueChange, label }) => {
    return (
      <TouchableOpacity style={styles.checkboxRow} onPress={() => onValueChange(!value)}>
        <MaterialIcons
          name={value ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color={value ? '#800000' : 'gray'}
        />
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const ImprovementButton = ({ label }) => {
    const isSelected = selectedImprovements.includes(label);
    return (
      <TouchableOpacity
        style={[styles.improvementButton, isSelected && styles.improvementButtonSelected]}
        onPress={() => handleImprovementSelect(label)}
      >
        <Text style={[styles.improvementButtonText, isSelected && styles.improvementButtonTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.headerText}>Rate Your Experience</Text>
      <Text style={styles.subHeaderText}>Are you satisfied with our service?</Text>

      <StarRating
        rating={rating}
        onChange={setRating}
        color="#800000"
        starSize={width * 0.1} 
        style={styles.starRating}
      />

      <Text style={styles.improvementText}>Tell us what can be improved?</Text>

      <View style={styles.improvementContainer}>
        {improvementOptions.map((option, index) => (
          <ImprovementButton key={index} label={option} />
        ))}
      </View>

      <View style={styles.checkboxContainer}>
        <CustomCheckBox
          value={displayWithName}
          onValueChange={() => handleCheckboxChange('name')}
          label="Display with your name"
        />
        <CustomCheckBox
          value={displayAnonymously}
          onValueChange={() => handleCheckboxChange('anonymous')}
          label="Display Anonymously"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Tell us how we can improve..."
        placeholderTextColor="#666"
        multiline={true}
        value={feedbackText}
        onChangeText={setFeedbackText}
      />

      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>

      {selectedAlert && (
        <Modal transparent={true} visible={selectedAlert} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Do you want to send the Feedback?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.buttonModal} onPress={handleConfirm}>
                  <Text style={styles.buttonmodaltext}>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonModal} onPress={closeModal}>
                  <Text style={styles.buttonmodaltext}>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {thankYouVisible && (
        <Animated.View style={[styles.thankYouContainer, { opacity: fadeAnim }]}>
          <MaterialIcons name="thumb-up" size={150} color="#800000" />
          <Text style={styles.thankYouText}>Thank You</Text>
          <Text style={styles.thankYouSubText}>Your feedback was successfully submitted</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05, 
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05, 
    left: width * 0.05, 
    zIndex: 1,
  },
  headerText: {
    fontSize: width * 0.08,
    color: '#800000',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: height * 0.02, 
  },
  subHeaderText: {
    fontSize: width * 0.045, 
    color: '#666',
    textAlign: 'left',
    marginBottom: height * 0.02, 
  },
  starRating: { 
    alignSelf: 'flex-start',
    marginBottom: height * 0.05, 
  },
  improvementText: {
    fontSize: width * 0.045, 
    color: '#666',
    fontWeight: 'bold',
    marginBottom: height * 0.02, 
  },
  improvementContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.02, 
  },
  improvementButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: height * 0.01, 
    paddingHorizontal: width * 0.04, 
    margin: width * 0.01, 
  },
  improvementButtonSelected: {
    backgroundColor: '#800000',
  },
  improvementButtonText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  improvementButtonTextSelected: {
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02, 
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.02, 
  },
  checkboxLabel: {
    marginLeft: width * 0.02, 
    fontSize: width * 0.04,
    color: 'black',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 10,
    padding: width * 0.04, 
    height: height * 0.15, 
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: height * 0.02, 
  },
  button: {
    backgroundColor: '#800000',
    padding: 15, 
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045, 
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: height * 0.03, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: width * 0.045, 
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonModal: {
    backgroundColor: '#7E0000',
    padding: height * 0.01, 
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonmodaltext: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: width * 0.04, 
  },
  thankYouContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  thankYouText: {
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    color: '#800000',
    marginTop: height * 0.02, 
  },
  thankYouSubText: {
    fontSize: width * 0.04, 
    color: '#666',
    marginTop: height * 0.01, 
  },
});

export default FeedbackComponent;