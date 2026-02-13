import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {

    const handleAppleSignIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            console.log('Apple credential:', credential);

            // Save user name & email on first sign-in (Apple only sends these ONCE)
            if (credential.fullName?.givenName) {
                const firstName = credential.fullName.givenName || '';
                const lastName = credential.fullName.familyName || '';
                const fullName = `${firstName} ${lastName}`.trim();
                await AsyncStorage.setItem('userName', fullName);
            }
            if (credential.email) {
                await AsyncStorage.setItem('userEmail', credential.email);
            }

            // If login succeeds → navigate to Subscription
            if (credential.identityToken) {
                const savedName = await AsyncStorage.getItem('userName');
                navigation.navigate('Subscription', { userName: savedName || 'User' });
            }
        } catch (error) {
            if (error.code === 'ERR_REQUEST_CANCELED') {
                // User cancelled the sign-in flow
                console.log('User cancelled Apple Sign In');
            } else {
                // Handle other errors (like 1001, invalid client, etc.)
                console.error('Apple Sign In error:', error);
                Alert.alert(
                    'Apple Sign-In Failed',
                    `Error: ${error.message || error.code || 'Unknown Error'}. \n\nIf you are in Simulator, try Device -> Erase All Content and Settings, or ensure you are signed into iCloud.`
                );
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* App Logo/Icon */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoSquare}>
                        <Ionicons name="folder-open" size={40} color="white" />
                        <View style={styles.miniPlayCircle}>
                            <Ionicons name="play" size={10} color="black" />
                        </View>
                    </View>
                </View>

                {/* Welcome Text */}
                <Text style={styles.title}>Welcome to Subscriptly</Text>
                <Text style={styles.subtitle}>
                    Sign in to continue. Use your Apple ID to securely access the app.
                </Text>

                {/* Apple Sign In Button — iOS only */}
                {Platform.OS === 'ios' ? (
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={12}
                        style={styles.appleAuthButton}
                        onPress={handleAppleSignIn}
                    />
                ) : (
                    <View style={styles.androidNotice}>
                        <Ionicons name="information-circle-outline" size={20} color="#8E8E93" />
                        <Text style={styles.androidNoticeText}>
                            Apple Sign In is only available on iOS devices.
                        </Text>
                    </View>
                )}

                {/* Privacy Note */}
                <View style={styles.privacyContainer}>
                    <View style={styles.privacyHeader}>
                        <Ionicons name="shield-checkmark" size={18} color="#007AFF" />
                        <Text style={styles.privacyTitle}>Privacy First</Text>
                    </View>
                    <Text style={styles.privacyText}>
                        We don't track you. Your data stays private.
                    </Text>
                </View>

                {/* Footer Links */}
                <View style={styles.footer}>
                    <View style={styles.linkRow}>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>PRIVACY POLICY</Text>
                        </TouchableOpacity>
                        <View style={styles.dot} />
                        <TouchableOpacity>
                            <Text style={styles.linkText}>TERMS OF SERVICE</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.copyright}>© 2024 Subscriptly Inc.</Text>
                </View>

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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    logoContainer: {
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    logoSquare: {
        width: 100,
        height: 100,
        backgroundColor: '#0F1217',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    miniPlayCircle: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: 'white',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        color: '#4FA5F2',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 60,
        paddingHorizontal: 10,
    },
    appleAuthButton: {
        width: '100%',
        height: 60,
        marginBottom: 30,
    },
    androidNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 30,
        width: '100%',
    },
    androidNoticeText: {
        color: '#8E8E93',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },
    privacyContainer: {
        alignItems: 'center',
        marginBottom: 100,
    },
    privacyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    privacyTitle: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 6,
    },
    privacyText: {
        color: '#71717A',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: '80%',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    linkText: {
        color: '#007AFF',
        fontSize: 13,
        fontWeight: '600',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#D1D1D6',
        marginHorizontal: 15,
    },
    copyright: {
        color: '#A1A1AA',
        fontSize: 12,
    },
});

export default LoginScreen;
