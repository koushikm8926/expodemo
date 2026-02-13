import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// API Keys
const IOS_API_KEY = 'appl_WHmDaKGwzVlnbtbKEmInEMsraTo';
const ANDROID_API_KEY = 'test_lXjXSiEskQNlkSpUDRwzLYVJrWZ';

const RevenueCatContext = createContext(null);

export const useRevenueCat = () => {
    const context = useContext(RevenueCatContext);
    if (!context) {
        throw new Error('useRevenueCat must be used within a RevenueCatProvider');
    }
    return context;
};

export const RevenueCatProvider = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [currentOffering, setCurrentOffering] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

                if (Platform.OS === 'ios') {
                    await Purchases.configure({ apiKey: IOS_API_KEY });
                } else if (Platform.OS === 'android') {
                    await Purchases.configure({ apiKey: ANDROID_API_KEY });
                }

                // Listen for customer info updates
                Purchases.addCustomerInfoUpdateListener((info) => {
                    setCustomerInfo(info);
                    updateSubscriptionStatus(info);
                });

                // Fetch initial customer info
                const info = await Purchases.getCustomerInfo();
                setCustomerInfo(info);
                updateSubscriptionStatus(info);

                // Fetch offerings
                await fetchOfferings();

                setIsReady(true);
            } catch (e) {
                console.error('RevenueCat init error:', e);
                setError(e.message);
                setIsReady(true);
            }
        };

        init();
    }, []);

    const updateSubscriptionStatus = (info) => {
        const isPremium = info?.entitlements?.active?.['premium'] !== undefined;
        setIsSubscribed(isPremium);
    };

    const fetchOfferings = async () => {
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current) {
                setCurrentOffering(offerings.current);
            }
        } catch (e) {
            console.error('Error fetching offerings:', e);
            setError(e.message);
        }
    };

    const purchasePackage = async (pkg) => {
        try {
            setError(null);
            const { customerInfo: updatedInfo } = await Purchases.purchasePackage(pkg);
            setCustomerInfo(updatedInfo);
            updateSubscriptionStatus(updatedInfo);
            return { success: true, customerInfo: updatedInfo };
        } catch (e) {
            if (!e.userCancelled) {
                console.error('Purchase error:', e);
                setError(e.message);
                Alert.alert(
                    'Purchase Failed',
                    e.message || 'An error occurred during the purchase. Please try again.',
                    [{ text: 'OK' }]
                );
            }
            return { success: false, error: e };
        }
    };

    const restorePurchases = async () => {
        try {
            setError(null);
            const info = await Purchases.restorePurchases();
            setCustomerInfo(info);
            updateSubscriptionStatus(info);

            const isPremium = info?.entitlements?.active?.['premium'] !== undefined;
            if (isPremium) {
                Alert.alert('Success', 'Your subscription has been restored!', [{ text: 'OK' }]);
            } else {
                Alert.alert(
                    'No Subscription Found',
                    'We could not find an active subscription for your account.',
                    [{ text: 'OK' }]
                );
            }
            return { success: isPremium, customerInfo: info };
        } catch (e) {
            console.error('Restore error:', e);
            setError(e.message);
            Alert.alert(
                'Restore Failed',
                e.message || 'An error occurred while restoring purchases. Please try again.',
                [{ text: 'OK' }]
            );
            return { success: false, error: e };
        }
    };

    const checkSubscription = async () => {
        try {
            const info = await Purchases.getCustomerInfo();
            setCustomerInfo(info);
            updateSubscriptionStatus(info);
            return info?.entitlements?.active?.['premium'] !== undefined;
        } catch (e) {
            console.error('Check subscription error:', e);
            return false;
        }
    };

    return (
        <RevenueCatContext.Provider
            value={{
                isReady,
                isSubscribed,
                customerInfo,
                currentOffering,
                error,
                purchasePackage,
                restorePurchases,
                checkSubscription,
                fetchOfferings,
            }}
        >
            {children}
        </RevenueCatContext.Provider>
    );
};

export default RevenueCatProvider;
