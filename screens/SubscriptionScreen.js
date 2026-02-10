import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionScreen = () => {
    const features = [
        "Unlimited access to all content",
        "Ad-free experience",
        "Auto-renewable convenience",
        "Exclusive daily updates"
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hi, User 👋</Text>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/40' }}
                        style={styles.avatar}
                    />
                </View>

                {/* Premium Card */}
                <View style={styles.card}>
                    <Image
                        source={{ uri: 'https://your-wavy-abstract-image-url.com' }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
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
                            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                            <Text style={styles.featureText}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Footer Info */}
                <Text style={styles.disclaimer}>
                    Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                </Text>

                {/* Action Button */}
                <TouchableOpacity style={styles.subscribeButton}>
                    <Ionicons name="logo-apple" size={24} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.subscribeButtonText}>Subscribe with Apple</Text>
                </TouchableOpacity>

                {/* Footer Links */}
                <View style={styles.footerLinks}>
                    <TouchableOpacity><Text style={styles.linkText}>Restore Purchases</Text></TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity><Text style={styles.linkText}>Manage Subscription</Text></TouchableOpacity>
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
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#F0F0F0',
    },
    card: {
        backgroundColor: '#F2F8FF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E1E9F5',
    },
    cardImage: {
        width: '100%',
        height: 200,
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
        marginBottom: 20,
    },
    featureText: {
        fontSize: 17,
        color: '#1C1C1E',
        marginLeft: 15,
    },
    disclaimer: {
        fontSize: 11,
        color: '#8E8E93',
        textAlign: 'center',
        marginVertical: 20,
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
    subscribeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
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
