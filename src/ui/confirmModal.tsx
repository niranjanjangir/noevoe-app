import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, typography } from './theme';
import { Button } from './Button';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: 'default' | 'danger';
    singleButton?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'default',
    singleButton = false
}) => {
    const dismiss = onCancel ?? onConfirm;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={dismiss}
            accessibilityViewIsModal
        >
            <Pressable style={styles.overlay} onPress={dismiss}>
                <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
                    <Text style={[typography.heading, type === 'danger' && styles.dangerTitle]}>{title}</Text>
                    <Text style={typography.body}>{message}</Text>
                    <View style={styles.actions}>
                        {!singleButton && (
                            <Button label={cancelText} kind="secondary" onPress={onCancel ?? (() => undefined)} />
                        )}
                        <Button label={confirmText} kind={type === 'danger' ? 'danger' : 'primary'} onPress={onConfirm} />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.xl,
        backgroundColor: colors.faintBackground,
    },
    card: {
        gap: spacing.md,
        padding: spacing.xl,
        borderRadius: radius.lg,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dangerTitle: { color: colors.danger },
    actions: { gap: spacing.sm, marginTop: spacing.sm },
});
