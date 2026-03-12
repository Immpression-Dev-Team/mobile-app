import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const TermsOfService = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#1E2A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By creating an account and using the Immpression app, you agree to be
          bound by these Terms of Service. If you do not agree to these terms,
          please do not use our service.
        </Text>

        <Text style={styles.sectionTitle}>2. User-Generated Content Policy</Text>
        <Text style={styles.paragraph}>
          Immpression is a platform for sharing and discovering artwork. As a
          user, you may upload, share, and interact with content created by
          yourself and others.
        </Text>
        <Text style={styles.subSectionTitle}>
          2.1 Zero Tolerance for Objectionable Content
        </Text>
        <Text style={styles.paragraph}>
          Immpression has a strict zero-tolerance policy for objectionable
          content. The following types of content are strictly prohibited:
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Pornographic, sexually explicit, or obscene material
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Content that promotes violence, terrorism, or hate speech
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Content that is discriminatory based on race, ethnicity,
          religion, gender, sexual orientation, disability, or national origin
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Content depicting or promoting illegal activities
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Content that exploits or endangers minors
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Intellectual property infringement or stolen artwork
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Spam, scams, or misleading content
        </Text>

        <Text style={styles.subSectionTitle}>
          2.2 Zero Tolerance for Abusive Users
        </Text>
        <Text style={styles.paragraph}>
          Immpression has a strict zero-tolerance policy for abusive behavior.
          The following behaviors are strictly prohibited:
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Harassment, bullying, or intimidation of other users
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Threats of violence or harm
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Stalking or unwanted contact
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Impersonation of other users or public figures
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Doxing or sharing private information without consent
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Creating multiple accounts to evade bans or restrictions
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Any behavior intended to manipulate or deceive other users
        </Text>

        <Text style={styles.sectionTitle}>3. Content Moderation</Text>
        <Text style={styles.paragraph}>
          All content uploaded to Immpression is subject to review. We reserve
          the right to remove any content that violates these terms without
          prior notice. Users may report objectionable content or abusive
          behavior through our in-app reporting feature.
        </Text>

        <Text style={styles.sectionTitle}>4. Account Termination</Text>
        <Text style={styles.paragraph}>
          Violation of these terms may result in immediate action including but
          not limited to:
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Removal of offending content
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Temporary suspension of account
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Permanent termination of account
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Reporting to law enforcement where applicable
        </Text>

        <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          By using Immpression, you agree to:
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Only upload content you have the right to share
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Treat all users with respect and dignity
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Report any violations of these terms you encounter
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Keep your account credentials secure
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} Provide accurate information during registration
        </Text>

        <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          You retain ownership of any artwork you upload to Immpression. By
          uploading content, you grant Immpression a non-exclusive license to
          display, distribute, and promote your artwork within the platform.
        </Text>

        <Text style={styles.sectionTitle}>7. Purchases and Transactions</Text>
        <Text style={styles.paragraph}>
          Immpression facilitates transactions between artists and buyers. All
          sales are final unless otherwise stated by the artist. Immpression is
          not responsible for disputes between buyers and sellers but may assist
          in resolution.
        </Text>

        <Text style={styles.sectionTitle}>8. Privacy</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Please review our Privacy Policy for
          information on how we collect, use, and protect your personal data.
        </Text>

        <Text style={styles.sectionTitle}>9. Modifications to Terms</Text>
        <Text style={styles.paragraph}>
          Immpression reserves the right to modify these terms at any time. We
          will notify users of significant changes via email or in-app
          notification. Continued use of the service after changes constitutes
          acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact</Text>
        <Text style={styles.paragraph}>
          If you have questions about these terms or need to report a violation,
          please contact us at support@immpression.com.
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2A3A",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 20,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2A3A",
    marginTop: 20,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
    marginLeft: 16,
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default TermsOfService;
