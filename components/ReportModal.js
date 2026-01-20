import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../state/AuthProvider';
import { reportImage, reportUser, getReportReasons } from '../API/API';

const REPORT_REASONS = [
  { key: 'INAPPROPRIATE_CONTENT', value: 'inappropriate_content', label: 'Inappropriate Content' },
  { key: 'NUDITY_SEXUAL', value: 'nudity_sexual', label: 'Nudity / Sexual Content' },
  { key: 'VIOLENCE_GRAPHIC', value: 'violence_graphic', label: 'Violence / Graphic Content' },
  { key: 'HATE_SPEECH', value: 'hate_speech', label: 'Hate Speech' },
  { key: 'COPYRIGHT_VIOLATION', value: 'copyright_violation', label: 'Copyright Violation' },
  { key: 'TRADEMARK_VIOLATION', value: 'trademark_violation', label: 'Trademark Violation' },
  { key: 'HARASSMENT', value: 'harassment', label: 'Harassment' },
  { key: 'SPAM', value: 'spam', label: 'Spam' },
  { key: 'SCAM_FRAUD', value: 'scam_fraud', label: 'Scam / Fraud' },
  { key: 'IMPERSONATION', value: 'impersonation', label: 'Impersonation' },
  { key: 'OTHER', value: 'other', label: 'Other' },
];

const ReportModal = ({
  visible,
  onClose,
  targetType, // 'image' or 'user'
  targetId,
  targetName, // For display purposes
}) => {
  const { token } = useAuth();
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedReason(null);
      setDescription('');
      setSubmitted(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Select Reason', 'Please select a reason for your report.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (targetType === 'image') {
        result = await reportImage(targetId, selectedReason, description, token);
      } else {
        result = await reportUser(targetId, selectedReason, description, token);
      }

      if (result.success) {
        setSubmitted(true);
      } else {
        Alert.alert('Error', result.error || 'Failed to submit report. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setDescription('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {submitted ? 'Report Submitted' : `Report ${targetType === 'image' ? 'Content' : 'User'}`}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {submitted ? (
            // Success state
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.successTitle}>Thank You</Text>
              <Text style={styles.successText}>
                Your report has been submitted. Our team will review it within 24 hours.
              </Text>
              <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Report form
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {targetName && (
                <Text style={styles.targetInfo}>
                  Reporting: {targetName}
                </Text>
              )}

              <Text style={styles.sectionTitle}>Select a reason</Text>

              {REPORT_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason.key}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason.value && styles.reasonItemSelected,
                  ]}
                  onPress={() => setSelectedReason(reason.value)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason.value && styles.reasonTextSelected,
                    ]}
                  >
                    {reason.label}
                  </Text>
                  {selectedReason === reason.value && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionTitle}>Additional details (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Describe the issue..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                maxLength={1000}
                value={description}
                onChangeText={setDescription}
              />
              <Text style={styles.charCount}>{description.length}/1000</Text>

              <TouchableOpacity
                style={[styles.submitButton, !selectedReason && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading || !selectedReason}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Report</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                False reports may result in action against your account. Reports are reviewed by our moderation team.
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 34, // Safe area
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  targetInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  reasonItemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  reasonText: {
    fontSize: 15,
    color: '#333',
  },
  reasonTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#F9F9F9',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  successContainer: {
    alignItems: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 24,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportModal;
