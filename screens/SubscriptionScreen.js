import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Linking,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRevenueCat } from '../providers/RevenueCatProvider';

const SubscriptionScreen = ({ route, navigation }) => {
    const userName = route?.params?.userName || 'User';
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const {
        isReady,
        isSubscribed,
        currentOffering,
        error,
        purchasePackage,
        restorePurchases,
    } = useRevenueCat();

    const features = [
        'Unlimited access to all content',
        'Ad-free experience',
        'Auto-renewable convenience',
        'Exclusive daily updates',
    ];

    // Get the monthly package from the current offering
    const monthlyPackage = currentOffering?.monthly || currentOffering?.availablePackages?.[0];
    const priceString = monthlyPackage?.product?.priceString || '$1.99/mo';
    const productTitle = monthlyPackage?.product?.title || 'Monthly Premium';

    const handlePurchase = async () => {
        if (!monthlyPackage) return;
        setIsPurchasing(true);
        const result = await purchasePackage(monthlyPackage);
        setIsPurchasing(false);
        if (result.success) {
            navigation.replace('Home', { userName });
        }
    };

    const handleRestore = async () => {
        setIsRestoring(true);
        const result = await restorePurchases();
        setIsRestoring(false);
        if (result.success) {
            navigation.replace('Home', { userName });
        }
    };

    const handleManageSubscription = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('https://apps.apple.com/account/subscriptions');
        }
    };

    // If already subscribed, go straight to Home
    if (isSubscribed) {
        navigation.replace('Home', { userName });
        return null;
    }

    // Loading state while RevenueCat initializes
    if (!isReady) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading subscription info...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hi, {userName} 👋</Text>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person-circle-outline" size={40} color="#C7C7CC" />
                    </View>
                </View>

                {/* Premium Card */}
                <View style={styles.card}>
                    <View style={styles.cardGradient}>
                        <Ionicons name="diamond-outline" size={48} color="#007AFF" />
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Premium Access</Text>
                        <Text style={styles.cardSubtitle}>
                            Unlock all features and enhance your experience with exclusive tools and daily updates.
                        </Text>
                    </View>
                </View>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    <Text style={styles.sectionTitle}>WHAT'S INCLUDED</Text>
                    {features.map((item, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={styles.checkCircle}>
                                <Ionicons name="checkmark" size={16} color="white" />
                            </View>
                            <Text style={styles.featureText}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Price Section */}
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>{productTitle}</Text>
                    <Text style={styles.price}>{priceString}</Text>
                    <Text style={styles.pricePeriod}>per month</Text>
                </View>

                {/* Error message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={18} color="#FF3B30" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* Footer Info */}
                <Text style={styles.disclaimer}>
                    Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                </Text>

                {/* Action Button */}
                <TouchableOpacity
                    style={[styles.subscribeButton, isPurchasing && styles.subscribeButtonDisabled]}
                    onPress={handlePurchase}
                    disabled={isPurchasing || !monthlyPackage}
                >
                    {isPurchasing ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Ionicons name="logo-apple" size={24} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.subscribeButtonText}>
                                Subscribe with Apple — {priceString}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Footer Links */}
                <View style={styles.footerLinks}>
                    <TouchableOpacity onPress={handleRestore} disabled={isRestoring}>
                        {isRestoring ? (
                            <ActivityIndicator size="small" color="#007AFF" />
                        ) : (
                            <Text style={styles.linkText}>Restore Purchases</Text>
                        )}
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={handleManageSubscription}>
                        <Text style={styles.linkText}>Manage Subscription</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8E8E93',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    avatarPlaceholder: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#F2F8FF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E1E9F5',
    },
    cardGradient: {
        width: '100%',
        height: 160,
        backgroundColor: '#E8F2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTextContainer: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    featuresContainer: {
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8E8E93',
        letterSpacing: 1.2,
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 17,
        color: '#1C1C1E',
        marginLeft: 15,
    },
    priceSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    priceLabel: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    price: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1C1C1E',
    },
    pricePeriod: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginVertical: 10,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    disclaimer: {
        fontSize: 11,
        color: '#8E8E93',
        textAlign: 'center',
        marginVertical: 16,
        paddingHorizontal: 10,
    },
    subscribeButton: {
        backgroundColor: '#000000',
        flexDirection: 'row',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    subscribeButtonDisabled: {
        opacity: 0.6,
    },
    subscribeButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 14,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#E5E5EA',
        marginHorizontal: 20,
    },
});

export default SubscriptionScreen;
