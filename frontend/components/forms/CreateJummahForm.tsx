import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createJummah } from '@/api/jummah';
import { JummahCreateRequest } from '@/types/jummah';

interface Props {
  coords: { latitude: number; longitude: number } | null;
  onClose: () => void;
}

const PRAYER_TIMES = ['FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA'];

export default function CreateJummahForm({ coords, onClose }: Props) {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const [date, setDate] = useState(now);
  const [time, setTime] = useState(oneHourLater);
  const [activePicker, setActivePicker] = useState<'date' | 'time' | null>(null);

  const [notes, setNotes] = useState('');
  const [prayerTime, setPrayerTime] = useState<'FAJR' | 'DHUHR' | 'ASR' | 'MAGHRIB' | 'ISHA'>('FAJR');

  const handleSubmit = async () => {
    if (!coords) {
      Alert.alert('Error', 'Missing coordinates');
      return;
    }

    const payload: JummahCreateRequest = {
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().split(' ')[0],
      latitude: coords.latitude,
      longitude: coords.longitude,
      notes,
      prayerTime,
    };

    try {
      await createJummah(payload);
      Alert.alert('Success', 'Jummah created successfully');
      onClose();
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e.message || 'Something went wrong');
    }
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.form}>
          {/* Date & Time Row */}
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setActivePicker('date')}>
                <Text style={styles.selectorText}>{date.toDateString()}</Text>
              </TouchableOpacity>
              {activePicker === 'date' && (
                  <DateTimePicker
                      value={date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      minimumDate={new Date()}
                      maximumDate={new Date(Date.now() + 86400000)}
                      onChange={(_, selectedDate) => {
                        if (selectedDate) setDate(selectedDate);
                        if (Platform.OS === 'android') setActivePicker(null);
                      }}
                  />
              )}
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setActivePicker('time')}>
                <Text style={styles.selectorText}>
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
              {activePicker === 'time' && (
                  <DateTimePicker
                      value={time}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(_, selectedTime) => {
                        if (selectedTime) setTime(selectedTime);
                        if (Platform.OS === 'android') setActivePicker(null);
                      }}
                  />
              )}
            </View>
          </View>

          {Platform.OS === 'ios' && activePicker && (
              <TouchableOpacity onPress={() => setActivePicker(null)} style={styles.dismissButton}>
                <Text style={styles.dismissText}>Done</Text>
              </TouchableOpacity>
          )}

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={styles.notesInput}
                placeholder="Add any relevant notes..."
                placeholderTextColor="#6b7280"
                multiline
                value={notes}
                onChangeText={setNotes}
            />
          </View>

          {/* Prayer Time Carousel */}
          <View style={styles.section}>
            <Text style={styles.label}>Prayer Time</Text>
            <FlatList
                data={PRAYER_TIMES}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setPrayerTime(item as typeof prayerTime)}
                        style={[styles.carouselItem, prayerTime === item && styles.carouselItemSelected]}
                    >
                      <Text
                          style={[styles.carouselText, prayerTime === item && styles.carouselTextSelected]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                )}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Jummah</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    gap: 20,
    width: '100%',
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d1d5db',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  half: {
    flex: 1,
  },
  selector: {
    backgroundColor: '#1f2937',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  selectorText: {
    color: '#f9fafb',
    fontSize: 15,
  },
  notesInput: {
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    borderRadius: 6,
    padding: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  carousel: {
    gap: 10,
    marginTop: 8,
  },
  carouselItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: 10,
  },
  carouselItemSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  carouselText: {
    color: '#f3f4f6',
    fontWeight: '500',
  },
  carouselTextSelected: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: -10,
    paddingHorizontal: 16,
  },
  dismissText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 14,
  },
});
