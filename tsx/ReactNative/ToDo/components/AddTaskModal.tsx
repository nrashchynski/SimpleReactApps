import { useRef, useState, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Modal, 
  TextInput, 
  Platform, 
  Keyboard,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useTheme } from '../context/ThemeContext';
import type { ThemeColors } from '../theme/colors';

type AddTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskText: string, formattedDate: string) => void;
  /** Заголовок модалки. */
  title?: string;
  /** Текст, которым предзаполняется поле ввода. */
  initialText?: string;
  /** День, который подставляется по умолчанию при открытии, в формате YYYY-MM-DD. */
  initialDate?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const parseDateString = (value: string): Date => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export default function AddtaskModal({
    visible,
    onClose,
    onSubmit,
    title = 'Новая задача',
    initialText = '',
    initialDate,
}: AddTaskModalProps) {

    const { colors, isDarkMode } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [newTaskText, setNewTaskText] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            setNewTaskText(initialText);
            setSelectedDate(initialDate ? parseDateString(initialDate) : new Date());
        }
    }, [visible, initialText, initialDate]);

    const formatDate = (date: Date): string => {
        const today = new Date();
        if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
        ) {
        return 'Сегодня';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}.${month}`;
    };

    const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === 'set' || Platform.OS === 'android') {
        setShowDatePicker(false);
        }
        if (date) {
        setSelectedDate(date);
        }
    };

    const handleAddTask = () => {
        if (!newTaskText.trim()) return;

        onSubmit(newTaskText.trim(), formatDate(selectedDate));
        handleClose();
    };

    const handleClose = () => {
        setNewTaskText('');
        setShowDatePicker(false);
        onClose();
    };

    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(opacityAnim, {
        toValue: 0.5,
        useNativeDriver: true,
      }).start();
    }

    const handlePressOut = () => {
      Animated.spring(opacityAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    const confirmOpacityAnim = useRef(new Animated.Value(1)).current;

    const handleConfirmPressIn = () => {
      Animated.spring(confirmOpacityAnim, {
        toValue: 0.5,
        useNativeDriver: true,
      }).start();
    }

    const handleConfirmPressOut = () => {
      Animated.spring(confirmOpacityAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    return(
        <Modal 
        visible={visible} 
        animationType='slide' 
        transparent={true} 
        onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalContent}>

                        <Text style={styles.modalTitle}>{title}</Text>

                        <TextInput 
                            style={styles.newTaskInput}
                            placeholder="Что бы хотели сегодня сделать..."
                            placeholderTextColor={colors.placeholder}
                            value={newTaskText}
                            onChangeText={setNewTaskText}
                            returnKeyType="done"
                            onSubmitEditing={handleAddTask}
                        />

                        <View style={{flexDirection: "row", justifyContent:"space-between", alignItems: "center", marginBottom: 10,}}>

                          <Pressable 
                            style={({ pressed }) => [
                                styles.pressableSelectDate,
                                { opacity: pressed ? 0.5 : 1 } 
                            ]}
                            onPress={() => {
                              Keyboard.dismiss();
                              setShowDatePicker(prev => !prev)
                            }}
                          >
                            <Text style={styles.dateChipText}>{formatDate(selectedDate)}</Text>
                          </Pressable>

                          {
                            newTaskText.trim().length > 0 && 
                            <AnimatedPressable 
                              style={[styles.pressableConfirmTask, { opacity: confirmOpacityAnim }]}
                              onPress={handleAddTask} 
                              onPressIn={handleConfirmPressIn}
                              onPressOut={handleConfirmPressOut}
                            >
                              <Text style={styles.confirmTaskText}>{'↑'}</Text>
                            </AnimatedPressable>
                          }

                        </View> 

                        {showDatePicker &&
                            <View style={styles.datePickerContainer}>
                            <DateTimePicker 
                                value={selectedDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={onDateChange}
                                textColor={colors.text} 
                                accentColor={colors.accent}
                                themeVariant={isDarkMode ? 'dark' : 'light'}
                            />
                            </View>
                        }

                        <View style={styles.closeModalButtonContainer}>
                            <AnimatedPressable 
                              onPress={handleClose} 
                              onPressIn={handlePressIn}
                              onPressOut={handlePressOut}
                              style={[styles.closeModalButton, {opacity: opacityAnim}]}
                            >
                              <Text style={styles.closeModalButtonText}>
                                  Закрыть
                              </Text>
                            </AnimatedPressable>
                        </View>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.text,
  },
  newTaskInput: {
    paddingBottom: 15,
    color: colors.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pressableSelectDate: {
    padding: 8,
    borderColor: colors.border,
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
  },
  dateChipText: {
    fontSize: 15,
    color: colors.accentContrast,
  },
  pressableConfirmTask: {
    width: 36,
    height: 36,
    borderColor: colors.border,
    borderWidth: 0.5,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  confirmTaskText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: -2,
    color: colors.accentContrast,
  },
  datePickerContainer: {
    marginHorizontal: -10,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  closeModalButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    width: '70%',
    alignSelf: 'stretch',
    paddingVertical: 10,
    backgroundColor: colors.secondaryButton,
  },
  closeModalButtonText: {
    alignSelf: 'center',
    color: colors.secondaryButtonText,
  },
});