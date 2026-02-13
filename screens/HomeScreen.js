import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRevenueCat } from '../providers/RevenueCatProvider';

const HomeScreen = ({ route }) => {
    const userName = route?.params?.userName || 'User';
    const { isSubscribed, customerInfo } = useRevenueCat();

    const premiumEntitlement = customerInfo?.entitlements?.active?.['premium'];
    const expirationDate = premiumEntitlement?.expirationDate
        ? new Date(premiumEntitlement.expirationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    const handleManageSubscription = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('https://apps.apple.com/account/subscriptions');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Status Badge */}
                <View style={styles.badge}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.badgeText}>PREMIUM</Text>
                </View>

                {/* Welcome Section */}
                <Text style={styles.title}>Welcome, {userName}! 🎉</Text>
                <Text style={styles.subtitle}>
                    You have full access to all premium features.
                </Text>

                {/* Subscription Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="checkmark-circle" size={22} color="#34C759" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <Text style={styles.infoValue}>
                                {isSubscribed ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                    </View>

                    {expirationDate && (
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={22} color="#007AFF" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Renews On</Text>
                                <Text style={styles.infoValue}>{expirationDate}</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.infoRow}>
                        <Ionicons name="infinite-outline" size={22} color="#AF52DE" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Plan</Text>
                            <Text style={styles.infoValue}>Monthly Premium</Text>
                        </View>
                    </View>
                </View>

                {/* Premium Features */}
                <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>YOUR PREMIUM FEATURES</Text>
                    {[
                        { icon: 'lock-open', label: 'Unlimited access to all content' },
                        { icon: 'ban-outline', label: 'Ad-free experience' },
                        { icon: 'refresh-circle', label: 'Auto-renewable subscription' },
                        { icon: 'notifications-outline', label: 'Exclusive daily updates' },
                    ].map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={styles.featureIconContainer}>
                                <Ionicons name={feature.icon} size={20} color="#007AFF" />
                            </View>
                            <Text style={styles.featureText}>{feature.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Manage Subscription */}
                <TouchableOpacity
                    style={styles.manageButton}
                    onPress={handleManageSubscription}
                >
                    <Ionicons name="settings-outline" size={20} color="#007AFF" />
                    <Text style={styles.manageButtonText}>Manage Subscription</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 24,
    },
    badgeText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '800',
        marginLeft: 6,
        letterSpacing: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        lineHeight: 24,
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 30,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoTextContainer: {
        marginLeft: 14,
    },
    infoLabel: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        color: '#1C1C1E',
        fontWeight: '600',
        marginTop: 2,
    },
    featuresSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8E8E93',
        letterSpacing: 1.2,
        marginBottom: 18,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    featureIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 16,
        color: '#1C1C1E',
        marginLeft: 14,
        fontWeight: '500',
    },
    manageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#007AFF',
    },
    manageButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default HomeScreen;
