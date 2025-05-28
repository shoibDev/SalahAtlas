// Updated CreateJummahForm.tsx with 12-hour time picker and fixed wheel scroll

import React, { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  FlatList,
  Modal,
} from 'react-native';

import { useForm, Controller, Resolver } from 'react-hook-form';

import { useTheme } from '@/context/ThemeContext';
import { createJummah } from '@/api/jummahApi';
import { JummahCreateRequest } from '@/types/jummah';

import Picker from '@gregfrench/react-native-wheel-picker';
import {ScrollWheel} from "@/components/ScrollWheel";
const PickerItem = Picker.Item;

const { width } = Dimensions.get("window");
const PRAYER_TIMES: JummahCreateRequest['prayerTime'][] = ['FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA'];

const resolver: Resolver<JummahCreateRequest> = async (values) => {
  const errors: any = {};
  if (!values.notes || values.notes.trim() === '') {
    errors.notes = { type: 'required', message: 'Notes are required' };
  }
  if (!values.prayerTime) {
    errors.prayerTime = { type: 'required', message: 'Select a prayer time' };
  }
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

interface Props {
  coords: { latitude: number; longitude: number } | null;
  onClose: () => void;
}

export default function CreateJummahForm({ coords, onClose }: Props) {
  const theme = useTheme();
  const [showTimeModal, setShowTimeModal] = useState(false);

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const amPmOptions = ['AM', 'PM'];

  const now = new Date();
  let hour = now.getHours();
  const initialAmPm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  const [selectedHour, setSelectedHour] = useState(hour.toString().padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(now.getMinutes().toString().padStart(2, '0'));
  const [selectedAmPm, setSelectedAmPm] = useState(initialAmPm);

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<JummahCreateRequest>({
    defaultValues: { notes: '', prayerTime: 'FAJR' },
    resolver,
  });
  const prayerTime = watch('prayerTime');

  const onSubmit = async (data: JummahCreateRequest) => {
    if (!coords) return Alert.alert('Error', 'Missing coordinates');

    const finalHour = parseInt(selectedHour);
    const adjustedHour = selectedAmPm === 'PM' ? (finalHour === 12 ? 12 : finalHour + 12) : (finalHour === 12 ? 0 : finalHour);

    await createJummah({
      ...data,
      date: new Date().toISOString().split('T')[0],
      time: `${adjustedHour.toString().padStart(2, '0')}:${selectedMinute}:00`,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    Alert.alert('Success', 'Jummah created successfully');
    onClose();
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
          {/* Date & Time */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Date</Text>
              <View style={[styles.picker, { backgroundColor: theme.surface }]}>
                <Text style={{ color: theme.textPrimary }}>{new Date().toDateString()}</Text>
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Time</Text>
              <TouchableOpacity
                  style={[styles.picker, { backgroundColor: theme.surface }]}
                  onPress={() => setShowTimeModal(true)}
              >
                <Text style={{ color: theme.textPrimary }}>{`${selectedHour}:${selectedMinute} ${selectedAmPm}`}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Modal */}
          <Modal transparent visible={showTimeModal} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={[styles.fullscreenModal, { backgroundColor: theme.surface }]}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Select Time</Text>
                <View style={styles.pickerRow}>
                  <ScrollWheel data={hourOptions} selectedValue={selectedHour} onSelect={setSelectedHour} />
                  <ScrollWheel data={minuteOptions} selectedValue={selectedMinute} onSelect={setSelectedMinute} />
                  <ScrollWheel data={amPmOptions} selectedValue={selectedAmPm} onSelect={setSelectedAmPm} />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setShowTimeModal(false)} style={[styles.modalBtn, { backgroundColor: theme.surface, borderColor: theme.accent }]}>
                    <Text style={{ color: theme.accent }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowTimeModal(false)} style={[styles.modalBtn, { backgroundColor: theme.accent }]}>
                    <Text style={{ color: theme.buttonText }}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Notes */}
          <Text style={[styles.label, { color: theme.textPrimary }]}>Notes</Text>
          <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                  <TextInput
                      style={[styles.notesInput, { backgroundColor: theme.surface, color: theme.textPrimary }]}
                      multiline
                      placeholder="Add any relevant notes..."
                      placeholderTextColor={theme.placeholder}
                      onChangeText={onChange}
                      value={value}
                  />
              )}
          />
          {errors.notes && <Text style={{ color: 'red' }}>{errors.notes.message}</Text>}

          {/* Prayer Time */}
          <Text style={[styles.label, { color: theme.textPrimary }]}>Prayer Time</Text>
          <FlatList
              data={PRAYER_TIMES}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                  <TouchableOpacity
                      style={[styles.timeButton, { backgroundColor: prayerTime === item ? theme.accent : theme.surface }]}
                      onPress={() => setValue('prayerTime', item)}
                  >
                    <Text style={{ color: prayerTime === item ? '#fff' : theme.textSecondary }}>{item}</Text>
                  </TouchableOpacity>
              )}
          />
          {errors.prayerTime && <Text style={{ color: 'red' }}>{errors.prayerTime.message}</Text>}

          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: theme.accent }]} onPress={handleSubmit(onSubmit)}>
            <Text style={{ color: theme.buttonText, fontWeight: '600' }}>Create Jummah</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    width: width * 0.9,
    alignSelf: 'center',
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  picker: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  notesInput: {
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  carousel: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenModal: {
    width: width * 0.9,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  wheel: {
    width: 80,
    height: 180,
  },
});
