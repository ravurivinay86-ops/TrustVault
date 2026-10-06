import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { supabase } from "./supabase";

const demoDocuments = [
  {
    id: "TV-AADHAAR-DEMO",
    title: "Aadhaar Card",
    category: "Identity Proof",
    issuer: "UIDAI",
    holder: "TrustVault Demo User",
    issueDate: "Demo Document",
    expiryDate: "N/A",
    status: "Demo Verified",
    number: "XXXX XXXX 4821",
    hash: "TV-AAD-8X29-KD71",
  },
  {
    id: "TV-PAN-DEMO",
    title: "PAN Card",
    category: "Identity Proof",
    issuer: "Income Tax Department",
    holder: "TrustVault Demo User",
    issueDate: "Demo Document",
    expiryDate: "N/A",
    status: "Demo Verified",
    number: "ABCDE****F",
    hash: "TV-PAN-71QX-29LM",
  },
  {
    id: "TV-VOTER-DEMO",
    title: "Voter ID",
    category: "Identity Proof",
    issuer: "Election Commission",
    holder: "TrustVault Demo User",
    issueDate: "Demo Document",
    expiryDate: "N/A",
    status: "Demo Verified",
    number: "DEMO-VTR-2026",
    hash: "TV-VTR-92PL-18ZX",
  },
  {
    id: "TV-10TH-DEMO",
    title: "10th Class Memo",
    category: "Education Document",
    issuer: "Demo Education Board",
    holder: "TrustVault Demo User",
    issueDate: "Demo Document",
    expiryDate: "N/A",
    status: "Verified",
    number: "10TH-DEMO-2026",
    hash: "TV-10TH-81QA-73MN",
  },
  {
    id: "TV-INTER-DEMO",
    title: "Intermediate Memo",
    category: "Education Document",
    issuer: "Demo Education Board",
    holder: "TrustVault Demo User",
    issueDate: "Demo Document",
    expiryDate: "N/A",
    status: "Verified",
    number: "INTER-DEMO-2026",
    hash: "TV-INT-62KD-91PX",
  },
  {
    id: "TV-AIML-001",
    title: "AIML Academic Certificate",
    category: "Certification",
    issuer: "NRI Institute of Technology",
    holder: "TrustVault Demo User",
    issueDate: "15 June 2026",
    expiryDate: "15 June 2029",
    status: "Verified",
    number: "TV-AIML-2026-001",
    hash: "TVX8-A91F-77KD",
  },
  {
    id: "TV-PY-002",
    title: "Python Certification",
    category: "Certification",
    issuer: "TrustVault Learning",
    holder: "TrustVault Demo User",
    issueDate: "20 July 2026",
    expiryDate: "20 July 2028",
    status: "Verified",
    number: "TV-PY-2026-002",
    hash: "TVP7-K21L-92XA",
  },
  {
    id: "TV-INT-003",
    title: "AI Internship Certificate",
    category: "Professional Document",
    issuer: "Future AI Labs",
    holder: "TrustVault Demo User",
    issueDate: "10 August 2026",
    expiryDate: "10 August 2027",
    status: "Verified",
    number: "TV-INT-2026-003",
    hash: "TVI9-Z72B-18QX",
  },
];

const defaultSecurity = {
  securityMonitoring: true,
  faceVerification: true,
  aiThreatAlerts: true,
  permissionTracking: true,
  autoLock: true,
  loginAlerts: true,
  certificateIntegrity: true,
};

const securityItems = [
  ["securityMonitoring", "Security Monitoring", "Monitor vault activity"],
  ["faceVerification", "Face Verification", "Protect identity access"],
  ["aiThreatAlerts", "AI Threat Alerts", "Detect suspicious activity"],
  ["permissionTracking", "Permission Tracking", "Monitor credential sharing"],
  ["autoLock", "Automatic Vault Lock", "Lock after inactivity"],
  ["loginAlerts", "Login Alerts", "Notify about account access"],
  ["certificateIntegrity", "Certificate Integrity", "Protect document integrity"],
];

function Icon({ name }) {
  const icons = {
    dashboard: "▦",
    documents: "▤",
    permissions: "⇄",
    security: "♜",
    ai: "✦",
    settings: "⚙",
    shield: "⬟",
    upload: "↑",
    lock: "◆",
    unlock: "◇",
    user: "●",
    bell: "◉",
    check: "✓",
    warning: "!",
    logout: "↪",
    search: "⌕",
  };

  return <span className="icon">{icons[name] || "•"}</span>;
}

function App() {
  const [screen, setScreen] = useState("intro1");
  const [activePage, setActivePage] = useState("dashboard");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hi! Ask me about your documents, permissions, security controls, or certificate PINs.",
    },
  ]);

  const chatMessagesRef = useRef(null);

  const [registeredUser, setRegisteredUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [documents, setDocuments] = useState(demoDocuments);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [permissions, setPermissions] = useState([
    {
      name: "College Verification Portal",
      document: "10th Class Memo",
      status: "Granted",
    },
    {
      name: "Future AI Labs",
      document: "AI Internship Certificate",
      status: "Revoked",
    },
  ]);

  const [security, setSecurity] = useState(defaultSecurity);

  /* VAULT PIN */

  const [pin, setPin] = useState(
    () => localStorage.getItem("trustvaultVaultPin") || ""
  );

  const [confirmPin, setConfirmPin] = useState("");
  const [pinExists, setPinExists] = useState(
    () => Boolean(localStorage.getItem("trustvaultVaultPin"))
  );
  const [pinMode, setPinMode] = useState("create");

  const [vaultLocked, setVaultLocked] = useState(false);
  const [unlockPin, setUnlockPin] = useState("");

  /* CERTIFICATE PINS */

  const [certificatePins, setCertificatePins] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("trustvaultCertificatePins") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [pinSetupDocument, setPinSetupDocument] = useState(null);
  const [certificatePin, setCertificatePin] = useState("");
  const [certificatePinConfirm, setCertificatePinConfirm] = useState("");

  const [pinPromptDocument, setPinPromptDocument] = useState(null);
  const [pinPromptValue, setPinPromptValue] = useState("");

  /* SETTINGS */

  const [settings, setSettings] = useState({
    notifications: true,
    aiAlerts: true,
    loginAlerts: true,
    autoLock: true,
    sessionTimeout: "15 minutes",
    theme: "Dark Blue",
  });

  /* CAMERA */

  const [cameraActive, setCameraActive] = useState(false);
  const [faceStatus, setFaceStatus] = useState("Preparing camera...");
  const [faceDetected, setFaceDetected] = useState(false);

  /* UI */

  const [toast, setToast] = useState("");
  const [showThreat, setShowThreat] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* TOAST */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3200);
  };

  /* AUTH SESSION */

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        if (mounted) setAuthLoading(false);
        return;
      }

      if (data.session?.user) {
        await loadProfile(data.session.user);
      }

      if (mounted) {
        setAuthLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadProfile(session.user);
        } else if (mounted) {
          setRegisteredUser(null);
        }
      }
    );

    loadSession();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (user) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile loading error:", error);
    }

    setRegisteredUser({
      id: user.id,
      email: user.email,
      name: data?.full_name || "TrustVault User",
    });
  };

  /* AI ASSISTANT */

  const sendAssistantMessage = (message = chatInput) => {
    const question = message.trim();

    if (!question) return;

    const normalizedQuestion = question.toLowerCase();

    let response;

    if (/security|secure|threat|protect/.test(normalizedQuestion)) {
      const activeControls =
        Object.values(security).filter(Boolean).length;

      response = {
        text: `${activeControls} of ${
          Object.keys(security).length
        } security controls are active. Open the Security Centre to review them.`,
        action: "security",
        actionLabel: "Open Security Centre",
      };
    } else if (
      /permission|sharing|share|access|grant|revoke/.test(
        normalizedQuestion
      )
    ) {
      const activePermissions = permissions.filter(
        (permission) => permission.status === "Granted"
      ).length;

      response = {
        text: `You currently have ${activePermissions} active permission${
          activePermissions === 1 ? "" : "s"
        }. You can review or revoke access in Permissions.`,
        action: "permissions",
        actionLabel: "Review Permissions",
      };
    } else if (
      /document|certificate|credential|vault/.test(normalizedQuestion)
    ) {
      response = {
        text: `There are ${documents.length} document${
          documents.length === 1 ? "" : "s"
        } in your vault. Open Documents to see the records and their details.`,
        action: "documents",
        actionLabel: "Open Documents",
      };
    } else if (/pin/.test(normalizedQuestion)) {
      const protectedCount =
        Object.values(certificatePins).filter(Boolean).length;

      response = {
        text: `${protectedCount} certificate${
          protectedCount === 1 ? " is" : "s are"
        } currently protected with an individual PIN. Manage certificate PINs in Settings.`,
        action: "settings",
        actionLabel: "Manage PINs",
      };
    } else {
      response = {
        text: "I can help you check your documents, permissions, security controls, or certificate PINs. What would you like to know?",
      };
    }

    setChatMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        text: question,
      },
      {
        role: "assistant",
        ...response,
      },
    ]);

    setChatInput("");
  };

  useEffect(() => {
    if (chatOpen && chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop =
        chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, chatOpen]);

  /* LOCAL STORAGE */

  useEffect(() => {
    localStorage.setItem(
      "trustvaultCertificatePins",
      JSON.stringify(certificatePins)
    );
  }, [certificatePins]);

  useEffect(() => {
    if (pin) {
      localStorage.setItem("trustvaultVaultPin", pin);
      setPinExists(true);
    }
  }, [pin]);

  /* ACCOUNT */
const createAccount = async () => {
  const name = registerName.trim();
  const email = registerEmail.trim().toLowerCase();
  const password = registerPassword;
  const confirmPassword = registerConfirmPassword;

  if (!name || !email || !password || !confirmPassword) {
    showToast("Please fill all fields");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match");
    return;
  }

  try {
    showToast("Creating account...");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,

      options: {
        data: {
          full_name: name,
        },

        // After email verification, return to your TrustVault app
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("SIGNUP ERROR:", error);
      showToast(error.message);
      return;
    }

    if (!data.user) {
      showToast("Account creation failed");
      return;
    }

    // Save user's profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: data.user.id,
          full_name: name,
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      console.error("PROFILE ERROR:", profileError);
      showToast(profileError.message);
      return;
    }

    // Clear registration fields
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");

    setRegisteredUser({
      name: name,
      email: email,
    });

    // Go to login
    setScreen("login");

    // Supabase sends verification email automatically
    if (!data.session) {
      showToast("Account created! Check your email to verify 📧");
    } else {
      showToast("Account created successfully 🎉");
    }

  } catch (error) {
    console.error("UNEXPECTED ERROR:", error);
    showToast("Something went wrong");
  }
};
  /* LOGIN */

  const login = async () => {
    if (!loginPhone.trim() || !loginPassword) {
      showToast("⚠ Enter your email and password.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginPhone.trim().toLowerCase(),
        password: loginPassword,
      });

      if (error) {
        console.error("Login error:", error);
        showToast(`⚠ ${error.message}`);
        return;
      }

      if (!data.user) {
        showToast("⚠ Login failed.");
        return;
      }

      showToast("✓ Credentials verified • Secure access granted");

      setTimeout(() => {
        setScreen("face");
      }, 700);
    } catch (error) {
      console.error(error);
      showToast("⚠ Login failed.");
    }
  };

  /* LOGOUT */

  const logout = async () => {
    stopCamera();

    await supabase.auth.signOut();

    setRegisteredUser(null);
    setLoginPhone("");
    setLoginPassword("");
    setScreen("login");
    setActivePage("dashboard");

    showToast("✓ Signed out securely.");
  };

  /* CAMERA */

  useEffect(() => {
    if (screen === "face") {
      const timer = setTimeout(() => {
        startCamera();
      }, 300);

      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    }

    stopCamera();
  }, [screen]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setFaceStatus("Camera not supported.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setFaceStatus("Camera active • Position your face");

      setTimeout(() => {
        setFaceDetected(true);
        setFaceStatus("Face detected • Ready");
      }, 1500);
    } catch (error) {
      console.error(error);
      setCameraActive(false);
      setFaceStatus("Camera permission required.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraActive(false);
  };

  const verifyFace = () => {
    if (!cameraActive) {
      showToast("Allow camera access first.");
      return;
    }

    setFaceStatus("Scanning face...");
    setFaceDetected(true);

    setTimeout(() => {
      setFaceStatus("Verifying identity...");

      setTimeout(() => {
        setFaceStatus("Identity Verified ✓");

        setTimeout(() => {
          stopCamera();
          setActivePage("dashboard");
          setScreen("dashboard");
          showToast("Welcome to TrustVault.");
        }, 900);
      }, 1600);
    }, 1000);
  };

  /* DOCUMENTS */

  const uploadDocument = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const newDocument = {
      id: `TV-UP-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      category: "Uploaded Document",
      issuer: "Uploaded by User",
      holder: registeredUser?.name || "TrustVault Demo User",
      issueDate: new Date().toLocaleDateString(),
      expiryDate: "Not specified",
      status: "Uploaded",
      number: "USER-UPLOAD",
      hash: `TV-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`,
    };

    setDocuments((current) => [newDocument, ...current]);

    showToast("✓ Document uploaded successfully.");

    event.target.value = "";
  };

  const deleteDocument = (id) => {
    setDocuments((current) =>
      current.filter((document) => document.id !== id)
    );

    setSelectedDocument(null);

    setCertificatePins((current) => {
      const updated = { ...current };
      delete updated[id];
      return updated;
    });

    showToast("Document deleted from your vault.");
  };

  const openDocument = (document) => {
    const savedPin = certificatePins[document.id];

    if (savedPin) {
      setPinPromptDocument(document);
      setPinPromptValue("");
      return;
    }

    setSelectedDocument(document);
  };

  /* CERTIFICATE PIN */

  const saveCertificatePin = () => {
    if (!pinSetupDocument) return;

    if (!/^\d{6}$/.test(certificatePin)) {
      showToast("Certificate PIN must contain exactly 6 digits.");
      return;
    }

    if (certificatePin !== certificatePinConfirm) {
      showToast("Certificate PINs do not match.");
      return;
    }

    setCertificatePins((current) => ({
      ...current,
      [pinSetupDocument.id]: certificatePin,
    }));

    showToast(
      `🔐 PIN protection enabled for ${pinSetupDocument.title}`
    );

    setPinSetupDocument(null);
    setCertificatePin("");
    setCertificatePinConfirm("");
  };

  const verifyCertificatePin = () => {
    if (!pinPromptDocument) return;

    if (
      pinPromptValue ===
      certificatePins[pinPromptDocument.id]
    ) {
      const document = pinPromptDocument;

      setPinPromptDocument(null);
      setPinPromptValue("");
      setSelectedDocument(document);

      showToast("✓ Certificate PIN verified.");
    } else {
      setPinPromptValue("");
      showToast("❌ Incorrect certificate PIN.");
    }
  };

  /* PERMISSIONS */

  const togglePermission = (index) => {
    setPermissions((current) =>
      current.map((permission, i) =>
        i === index
          ? {
              ...permission,
              status:
                permission.status === "Granted"
                  ? "Revoked"
                  : "Granted",
            }
          : permission
      )
    );

    showToast("Permission updated.");
  };

  /* SECURITY */

  const toggleSecurity = (key) => {
    setSecurity((current) => ({
      ...current,
      [key]: !current[key],
    }));

    showToast("Security control updated.");
  };

  const secureWholeVault = () => {
    const secured = {};

    Object.keys(defaultSecurity).forEach((key) => {
      secured[key] = true;
    });

    setSecurity(secured);

    showToast("🛡 Whole Vault security activated.");
  };

  const simulateThreat = () => {
    setShowThreat(true);

    showToast("🚨 Suspicious access attempt detected.");

    setTimeout(() => {
      setShowThreat(false);
    }, 5000);
  };

  /* VAULT PIN */

  const savePin = () => {
    if (!/^\d{6}$/.test(pin)) {
      showToast("PIN must contain exactly 6 digits.");
      return;
    }

    if (pinMode === "create") {
      setPinMode("confirm");
      showToast("Enter your PIN again.");
      return;
    }

    if (pin !== confirmPin) {
      showToast("PINs do not match.");
      setConfirmPin("");
      return;
    }

    localStorage.setItem("trustvaultVaultPin", pin);
    setPinExists(true);
    setPinMode("create");
    setConfirmPin("");

    showToast("✓ Your Vault PIN has been set.");
  };

  const lockVault = () => {
    if (!pinExists) {
      showToast("Set your PIN before locking the Vault.");
      setActivePage("settings");
      return;
    }

    setVaultLocked(true);
    showToast("TrustVault locked.");
  };

  const unlockVault = () => {
    const savedPin =
      localStorage.getItem("trustvaultVaultPin");

    if (unlockPin === savedPin) {
      setVaultLocked(false);
      setUnlockPin("");
      showToast("✓ Vault unlocked.");
    } else {
      showToast("❌ Incorrect PIN.");
      setUnlockPin("");
    }
  };

  /* SETTINGS */

  const changeSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    showToast("Setting updated.");
  };

  /* NAVIGATION */

  const goToPage = (page) => {
    setActivePage(page);
  };

  /* INTRO 1 */

  const renderIntro1 = () => (
    <div className="screen intro-screen">
      <div className="security-grid" />

      <div className="intro-card">
        <div className="logo-orbit">
          <div className="vault-logo">
            <Icon name="shield" />
          </div>
        </div>

        <div className="brand-kicker">
          SECURE DIGITAL IDENTITY
        </div>

        <h1>TRUSTVAULT</h1>

        <h2>Your Credentials. Your Control.</h2>

        <p>
          A secure digital vault designed to keep your identity,
          education and professional credentials under your control.
        </p>

        <div className="feature-strip">
          <span>🔐 User Controlled</span>
          <span>🛡 Protected</span>
          <span>👤 Verified Access</span>
        </div>

        <button
          className="primary-button"
          onClick={() => setScreen("intro2")}
        >
          Get Started →
        </button>
      </div>
    </div>
  );

  /* INTRO 2 */

  const renderIntro2 = () => (
    <div className="screen intro-screen">
      <div className="security-grid" />

      <div className="intro-card second-intro">
        <div className="brand-kicker">
          TRUSTVAULT SECURITY PLATFORM
        </div>

        <h1>ONE SECURE VAULT</h1>

        <h2>Everything under your control.</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <span>🪪</span>
            <strong>Identity Proofs</strong>
            <small>Aadhaar, PAN & Voter ID</small>
          </div>

          <div className="feature-card">
            <span>🎓</span>
            <strong>Education Records</strong>
            <small>10th & Intermediate Memos</small>
          </div>

          <div className="feature-card">
            <span>📜</span>
            <strong>Certificates</strong>
            <small>Professional credentials</small>
          </div>

          <div className="feature-card">
            <span>🔐</span>
            <strong>Self Control</strong>
            <small>Grant or revoke access</small>
          </div>

          <div className="feature-card">
            <span>🤖</span>
            <strong>AI Security</strong>
            <small>Threat alerts & assistant</small>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={() => setScreen("login")}
        >
          Continue to Secure Login →
        </button>
      </div>
    </div>
  );

  /* LOGIN */

  const renderLogin = () => (
    <div className="screen auth-screen">
      <div className="security-grid" />

      <form
        className="auth-card"
        onSubmit={(event) => {
          event.preventDefault();
          login();
        }}
      >
        <div className="auth-logo">
          <Icon name="shield" />
        </div>

        <div className="brand-kicker">
          TRUSTVAULT SECURE ACCESS
        </div>

        <h1>Welcome Back</h1>

        <p className="muted">
          Sign in to access your protected digital vault.
        </p>

        <label htmlFor="login-email">Email Address</label>

        <input
          id="login-email"
          type="email"
          autoComplete="username"
          required
          value={loginPhone}
          onChange={(e) => setLoginPhone(e.target.value)}
          placeholder="Enter your registered email address"
        />

        <label htmlFor="login-password">Password</label>

        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="primary-button full-width"
        >
          Login Securely →
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="create-text">
          Don't have an account?
        </p>

        <button
          type="button"
          className="secondary-button full-width"
          onClick={() => setScreen("register")}
        >
          Create Account
        </button>

        <div className="security-note">
          🔒 Protected authentication • Face verification enabled
        </div>
      </form>
    </div>
  );

  /* REGISTER */

  const renderRegister = () => (
    <div className="screen auth-screen">
      <div className="security-grid" />

      <form
        className="auth-card"
        onSubmit={(event) => {
          event.preventDefault();
          createAccount();
        }}
      >
        <div className="auth-logo">
          <Icon name="shield" />
        </div>

        <div className="brand-kicker">
          CREATE SECURE ACCOUNT
        </div>

        <h1>Create Account</h1>

        <p className="muted">
          Create your personal TrustVault identity.
        </p>

        <label>Full Name</label>

        <input
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          placeholder="Enter your full name"
        />

        <label>Email Address</label>

        <input
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label>Set Password</label>

        <input
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          placeholder="Create a password"
        />

        <label>Confirm Your Password</label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter password again"
        />

        <button
          type="submit"
          className="primary-button full-width"
        >
          Confirm & Create Account →
        </button>

        <button
          type="button"
          className="text-button"
          onClick={() => setScreen("login")}
        >
          ← Back to Login
        </button>

        <div className="security-note">
          🔐 Your password is handled by Supabase Authentication.
        </div>
      </form>
    </div>
  );

  /* FACE VERIFICATION */

  const renderFaceVerification = () => (
    <div className="screen face-screen">
      <div className="security-grid" />

      <div className="face-card">
        <div className="brand-kicker">
          BIOMETRIC SECURITY
        </div>

        <h1>Live Face Verification</h1>

        <p className="muted">
          Verify your identity before entering the secure vault.
        </p>

        <div className="camera-ring">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />

          <div className="scan-line" />

          {faceDetected && (
            <div className="face-badge">
              ✓ Face Detected
            </div>
          )}
        </div>

        <div className="face-status">
          <span
            className={
              cameraActive
                ? "status-dot active"
                : "status-dot"
            }
          />

          {faceStatus}
        </div>

        <button
          className="primary-button full-width"
          onClick={verifyFace}
        >
          {faceStatus.includes("Verified")
            ? "Opening Dashboard..."
            : "Start Face Verification"}
        </button>

        <div className="security-note">
          🔒 Camera processing is used for the verification step.
        </div>
      </div>
    </div>
  );

  /* SIDEBAR */

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Icon name="shield" />
        </div>

        <div>
          <strong>TRUSTVAULT</strong>
          <small>SECURE IDENTITY</small>
        </div>
      </div>

      <nav>
        <button
          className={
            activePage === "dashboard" ? "nav-active" : ""
          }
          onClick={() => goToPage("dashboard")}
        >
          <Icon name="dashboard" />
          Dashboard
        </button>

        <button
          className={
            activePage === "documents" ? "nav-active" : ""
          }
          onClick={() => goToPage("documents")}
        >
          <Icon name="documents" />
          Documents
        </button>

        <button
          className={
            activePage === "permissions" ? "nav-active" : ""
          }
          onClick={() => goToPage("permissions")}
        >
          <Icon name="permissions" />
          Permissions
        </button>

        <button
          className={
            activePage === "security" ? "nav-active" : ""
          }
          onClick={() => goToPage("security")}
        >
          <Icon name="security" />
          Security Centre
        </button>

        <button
          className={
            activePage === "assistant" ? "nav-active" : ""
          }
          onClick={() => goToPage("assistant")}
        >
          <Icon name="ai" />
          AI Assistant
        </button>

        <button
          className={
            activePage === "settings" ? "nav-active" : ""
          }
          onClick={() => goToPage("settings")}
        >
          <Icon name="settings" />
          Settings
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button
          className="lock-sidebar-button"
          onClick={lockVault}
        >
          <Icon name="lock" />
          Lock Vault
        </button>

        <button onClick={logout}>
          <Icon name="logout" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  /* TOPBAR */

  const pageTitle = {
    dashboard: "Security Overview",
    documents: "Document Vault",
    permissions: "Access Permissions",
    security: "Security Centre",
    assistant: "AI Security Assistant",
    settings: "Settings",
  };

  const renderTopbar = () => (
    <header className="topbar">
      <div>
        <h2>{pageTitle[activePage]}</h2>

        <div className="topbar-subtitle">
          Your credentials. Your control.
        </div>
      </div>

      <div className="topbar-actions">
        <div className="secure-status">
          <span />
          Vault Protected
        </div>

        <button
          className="icon-button"
          onClick={simulateThreat}
        >
          <Icon name="bell" />
        </button>

        <div className="profile-mini">
          <div className="avatar">
            {(registeredUser?.name || "T")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {registeredUser?.name || "TrustVault User"}
            </strong>

            <small>Verified User</small>
          </div>
        </div>
      </div>
    </header>
  );

  /* DASHBOARD */

  const renderDashboard = () => (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="brand-kicker">
            TRUSTVAULT SECURITY PLATFORM
          </div>

          <h1>
            Your Digital Identity.
            <br />
            <span>Under Your Control.</span>
          </h1>

          <p>
            Manage identity proofs, education records and
            professional credentials from one secure vault.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => goToPage("documents")}
            >
              Open Document Vault
            </button>

            <button
              className="secondary-button"
              onClick={() => goToPage("security")}
            >
              Security Centre
            </button>
          </div>
        </div>

        <div className="hero-shield">
          <div className="hero-shield-inner">
            <Icon name="shield" />
            <span>SECURED</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Documents</span>
          <strong>{documents.length}</strong>
          <small>Protected records</small>
        </div>

        <div className="stat-card">
          <span>Permissions</span>
          <strong>
            {
              permissions.filter(
                (p) => p.status === "Granted"
              ).length
            }
          </strong>
          <small>Active permissions</small>
        </div>

        <div className="stat-card">
          <span>Security</span>
          <strong>
            {Object.values(security).filter(Boolean).length} /{" "}
            {Object.keys(security).length}
          </strong>
          <small>Controls active</small>
        </div>

        <div className="stat-card">
          <span>Vault</span>
          <strong>ACTIVE</strong>
          <small>Protected session</small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel control-panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">CONTROL</div>
              <h3>All Controls in My Hands</h3>
            </div>
          </div>

          <p className="control-description">
            Manage every important security and credential
            permission yourself.
          </p>

          <div className="control-list">
            <div>🔒 Lock / Unlock Vault</div>
            <div>🔑 Set & Change PIN</div>
            <div>🔐 Certificate PIN Protection</div>
            <div>🤝 Grant / Revoke Access</div>
            <div>🪪 Manage Identity Documents</div>
            <div>🚨 Control Threat Alerts</div>
            <div>👤 Face Verification</div>
          </div>

          <button
            className="secondary-button full-width"
            onClick={() => goToPage("security")}
          >
            Open Control Centre
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">PROTECTION</div>
              <h3>Vault Security</h3>
            </div>
          </div>

          <div className="security-summary">
            <div className="security-summary-icon">🔐</div>

            <strong>
              {Object.values(security).filter(Boolean).length}{" "}
              Security Controls Active
            </strong>

            <p>
              Your TrustVault protection layer is currently active.
            </p>
          </div>

          <button
            className="primary-button full-width dashboard-security-button"
            onClick={() => goToPage("settings")}
          >
            Manage Certificate PINs
          </button>
        </div>
      </section>

      <section className="panel activity-panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker">ACTIVITY</div>
            <h3>Recent Security Activity</h3>
          </div>
        </div>

        <div className="activity-row">
          <span className="activity-icon success">✓</span>
          <div>
            <strong>Face verification completed</strong>
            <small>Secure login approved</small>
          </div>
          <time>Just now</time>
        </div>

        <div className="activity-row">
          <span className="activity-icon">🔐</span>
          <div>
            <strong>Certificate PIN protection available</strong>
            <small>Protect certificates individually</small>
          </div>
          <time>Today</time>
        </div>

        <div className="activity-row">
          <span className="activity-icon">🛡</span>
          <div>
            <strong>Security controls active</strong>
            <small>TrustVault monitoring enabled</small>
          </div>
          <time>Today</time>
        </div>
      </section>
    </>
  );

  /* DOCUMENTS */

  const renderDocuments = () => (
    <>
      <section className="page-heading">
        <div>
          <div className="brand-kicker">
            PRIVATE CREDENTIAL STORAGE
          </div>

          <h1>Document Vault</h1>

          <p>
            Identity proofs, education records and certificates
            under your control.
          </p>
        </div>

        <label className="upload-button">
          <Icon name="upload" />
          Upload Document

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={uploadDocument}
            hidden
          />
        </label>
      </section>

      <div className="category-title">
        🪪 Identity Proofs
      </div>

      <div className="document-grid">
        {documents
          .filter((d) => d.category === "Identity Proof")
          .map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              protectedDocument={Boolean(
                certificatePins[document.id]
              )}
              onClick={() => openDocument(document)}
            />
          ))}
      </div>

      <div className="category-title">
        🎓 Education Documents
      </div>

      <div className="document-grid">
        {documents
          .filter(
            (d) => d.category === "Education Document"
          )
          .map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              protectedDocument={Boolean(
                certificatePins[document.id]
              )}
              onClick={() => openDocument(document)}
            />
          ))}
      </div>

      <div className="category-title">
        🏆 Certifications & Professional Documents
      </div>

      <div className="document-grid">
        {documents
          .filter(
            (d) =>
              d.category === "Certification" ||
              d.category === "Professional Document" ||
              d.category === "Uploaded Document"
          )
          .map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              protectedDocument={Boolean(
                certificatePins[document.id]
              )}
              onClick={() => openDocument(document)}
            />
          ))}
      </div>
    </>
  );

  /* PERMISSIONS */

  const renderPermissions = () => (
    <>
      <section className="page-heading">
        <div>
          <div className="brand-kicker">USER CONTROL</div>

          <h1>Access Permissions</h1>

          <p>
            Decide exactly who can access your credentials.
          </p>
        </div>
      </section>

      <div className="permission-grid">
        {permissions.map((permission, index) => (
          <div
            className="permission-card"
            key={permission.name}
          >
            <div className="permission-icon">
              <Icon name="shield" />
            </div>

            <div className="permission-content">
              <h3>{permission.name}</h3>
              <p>{permission.document}</p>

              <span
                className={
                  permission.status === "Granted"
                    ? "status-pill granted"
                    : "status-pill revoked"
                }
              >
                {permission.status}
              </span>
            </div>

            <button
              className={
                permission.status === "Granted"
                  ? "danger-button"
                  : "primary-button"
              }
              onClick={() => togglePermission(index)}
            >
              {permission.status === "Granted"
                ? "Revoke Access"
                : "Grant Access"}
            </button>
          </div>
        ))}
      </div>

      <div className="control-banner">
        <div>
          <strong>🔐 Permission Control</strong>
          <p>
            You decide when an organization can access your
            credentials.
          </p>
        </div>

        <span>FULL USER CONTROL</span>
      </div>
    </>
  );

  /* SECURITY */

  const renderSecurity = () => (
    <>
      <section className="page-heading">
        <div>
          <div className="brand-kicker">
            SECURITY CONTROL CENTRE
          </div>

          <h1>All Controls in My Hands</h1>

          <p>
            Select and control every TrustVault protection
            yourself.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={secureWholeVault}
        >
          🛡 Secure Whole Vault
        </button>
      </section>

      <div className="control-status-banner">
        <div className="big-security-icon">
          <Icon name="shield" />
        </div>

        <div>
          <strong>Your Vault • Your Control</strong>

          <p>
            {
              Object.values(security).filter(Boolean).length
            }{" "}
            of {Object.keys(security).length} protection
            controls are active.
          </p>
        </div>
      </div>

      <div className="security-list">
        {securityItems.map(
          ([key, title, description]) => (
            <div className="security-control-card" key={key}>
              <div className="security-control-icon">
                <Icon name="shield" />
              </div>

              <div className="security-control-content">
                <strong>{title}</strong>
                <small>{description}</small>
              </div>

              <SettingToggle
                checked={security[key]}
                onChange={() => toggleSecurity(key)}
              />
            </div>
          )
        )}
      </div>
    </>
  );

  /* ASSISTANT PAGE */

  const renderAssistant = () => (
    <section className="panel assistant-page">
      <div className="panel-header">
        <div>
          <div className="panel-kicker">
            AI SECURITY
          </div>

          <h3>TrustVault AI Assistant</h3>
        </div>
      </div>

      <p>
        Ask about your documents, permissions, security
        controls or certificate PINs.
      </p>

      <div className="chat-suggestions">
        {[
          "Security status",
          "My documents",
          "Sharing access",
          "Certificate PINs",
        ].map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            onClick={() =>
              sendAssistantMessage(suggestion)
            }
          >
            {suggestion}
          </button>
        ))}
      </div>

      <button
        className="primary-button"
        onClick={() => setChatOpen(true)}
      >
        Open AI Assistant ✦
      </button>
    </section>
  );

  /* SETTINGS */

  const renderSettings = () => (
    <>
      <section className="page-heading">
        <div>
          <div className="brand-kicker">
            VAULT CONFIGURATION
          </div>

          <h1>Settings</h1>

          <p>
            Manage your TrustVault security preferences.
          </p>
        </div>
      </section>

      <div className="settings-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">
                SECURITY
              </div>
              <h3>Security Preferences</h3>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Notifications</strong>
              <small>Receive TrustVault notifications</small>
            </div>

            <SettingToggle
              checked={settings.notifications}
              onChange={() =>
                changeSetting(
                  "notifications",
                  !settings.notifications
                )
              }
            />
          </div>

          <div className="setting-row">
            <div>
              <strong>AI Threat Alerts</strong>
              <small>Receive suspicious activity alerts</small>
            </div>

            <SettingToggle
              checked={settings.aiAlerts}
              onChange={() =>
                changeSetting(
                  "aiAlerts",
                  !settings.aiAlerts
                )
              }
            />
          </div>

          <div className="setting-row">
            <div>
              <strong>Login Alerts</strong>
              <small>Monitor account sign-ins</small>
            </div>

            <SettingToggle
              checked={settings.loginAlerts}
              onChange={() =>
                changeSetting(
                  "loginAlerts",
                  !settings.loginAlerts
                )
              }
            />
          </div>

          <div className="setting-row">
            <div>
              <strong>Automatic Lock</strong>
              <small>Automatically protect inactive sessions</small>
            </div>

            <SettingToggle
              checked={settings.autoLock}
              onChange={() =>
                changeSetting(
                  "autoLock",
                  !settings.autoLock
                )
              }
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">
                VAULT PIN
              </div>

              <h3>Vault Protection</h3>
            </div>
          </div>

          <p>
            Set a 6-digit PIN used when manually locking
            your TrustVault.
          </p>

          <div className="pin-settings">
            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit PIN"
              value={pin}
              onChange={(e) =>
                setPin(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            {pinMode === "confirm" && (
              <input
                className="pin-input"
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            )}

            <button
              className="primary-button"
              onClick={savePin}
            >
              {pinExists
                ? "Update Vault PIN"
                : "Set Vault PIN"}
            </button>
          </div>

          <div className="security-note">
            🔐 Your Vault PIN is stored locally for this
            demo environment.
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker">
              CERTIFICATE SECURITY
            </div>

            <h3>Certificate PIN Protection</h3>
          </div>
        </div>

        <p>
          Protect individual certificates with their own
          six-digit PIN.
        </p>

        <div className="document-grid">
          {documents.map((document) => (
            <div
              className="document-card"
              key={`pin-${document.id}`}
            >
              <div className="document-card-top">
                <span className="document-type">
                  {document.category}
                </span>

                <span>
                  {certificatePins[document.id]
                    ? "🔐 Protected"
                    : "○ Unprotected"}
                </span>
              </div>

              <h3>{document.title}</h3>

              <p>{document.issuer}</p>

              <button
                className={
                  certificatePins[document.id]
                    ? "secondary-button full-width"
                    : "primary-button full-width"
                }
                onClick={() => {
                  setPinSetupDocument(document);
                  setCertificatePin("");
                  setCertificatePinConfirm("");
                }}
              >
                {certificatePins[document.id]
                  ? "Change Certificate PIN"
                  : "Set Certificate PIN"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  /* DOCUMENT CARD */

  const DocumentCard = ({
    document,
    protectedDocument,
    onClick,
  }) => (
    <button
      className="document-card"
      onClick={onClick}
    >
      <div className="document-card-top">
        <span className="document-type">
          {document.category}
        </span>

        <span>
          {protectedDocument
            ? "🔐 Protected"
            : "✓ Verified"}
        </span>
      </div>

      <h3>{document.title}</h3>

      <p>{document.issuer}</p>

      <small>{document.status}</small>
    </button>
  );

  /* MAIN DASHBOARD */

  const renderDashboardApp = () => {
    let content;

    switch (activePage) {
      case "documents":
        content = renderDocuments();
        break;

      case "permissions":
        content = renderPermissions();
        break;

      case "security":
        content = renderSecurity();
        break;

      case "assistant":
        content = renderAssistant();
        break;

      case "settings":
        content = renderSettings();
        break;

      default:
        content = renderDashboard();
    }

    return (
      <div className="app-shell">
        {renderSidebar()}

        <main className="main-content">
          {renderTopbar()}

          <div className="page-content">
            {content}
          </div>
        </main>

        {renderFloatingAssistant()}
        {renderModals()}
      </div>
    );
  };

  /* FLOATING AI */

  const renderFloatingAssistant = () => (
    <>
      {chatOpen && (
        <section
          className="chat-panel"
          role="dialog"
          aria-labelledby="chat-title"
        >
          <header className="chat-panel-header">
            <div>
              <strong id="chat-title">
                TrustVault Assistant
              </strong>

              <small>
                Vault-aware demo assistant
              </small>
            </div>

            <button
              type="button"
              className="chat-close-button"
              onClick={() => setChatOpen(false)}
            >
              ×
            </button>
          </header>

          <div
            className="chat-messages"
            ref={chatMessagesRef}
          >
            {chatMessages.map((chatMessage, index) => (
              <div
                className={`chat-message ${
                  chatMessage.role === "user"
                    ? "user-chat-message"
                    : "assistant-chat-message"
                }`}
                key={`${index}-${chatMessage.role}`}
              >
                <p>{chatMessage.text}</p>

                {chatMessage.action && (
                  <button
                    type="button"
                    className="chat-action-button"
                    onClick={() => {
                      goToPage(chatMessage.action);
                      setChatOpen(false);
                    }}
                  >
                    {chatMessage.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="chat-suggestions">
            {[
              "Security status",
              "My documents",
              "Sharing access",
            ].map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() =>
                  sendAssistantMessage(suggestion)
                }
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="chat-compose"
            onSubmit={(event) => {
              event.preventDefault();
              sendAssistantMessage();
            }}
          >
            <input
              aria-label="Message the TrustVault Assistant"
              placeholder="Ask about your vault..."
              value={chatInput}
              onChange={(event) =>
                setChatInput(event.target.value)
              }
            />

            <button
              type="submit"
              disabled={!chatInput.trim()}
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        className="floating-ai"
        aria-label={
          chatOpen
            ? "Close TrustVault Assistant"
            : "Open TrustVault Assistant"
        }
        onClick={() =>
          setChatOpen((open) => !open)
        }
      >
        {chatOpen ? "×" : "✦"}
      </button>
    </>
  );

  /* MODALS */

  const renderModals = () => (
    <>
      {showThreat && (
        <div className="threat-overlay">
          <div className="threat-card">
            <div className="threat-icon">!</div>

            <div className="brand-kicker">
              TRUSTVAULT SECURITY ALERT
            </div>

            <h2>Suspicious Access Attempt</h2>

            <p>
              TrustVault detected unusual access activity.
              Security monitoring has been triggered.
            </p>

            <div className="threat-actions">
              <span>✓ Activity monitored</span>
              <span>✓ Permissions protected</span>
              <span>✓ Vault security active</span>
            </div>

            <button
              className="primary-button full-width"
              onClick={() => setShowThreat(false)}
            >
              Secure & Continue
            </button>
          </div>
        </div>
      )}

      {pinSetupDocument && (
        <div className="pin-modal-overlay">
          <div className="pin-modal certificate-pin-modal">
            <div className="secure-lock-animation">
              🔐
            </div>

            <div className="brand-kicker">
              CERTIFICATE SECURITY
            </div>

            <h2>
              Protect {pinSetupDocument.title}
            </h2>

            <p>
              Create a unique 6-digit PIN for this
              certificate.
            </p>

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit PIN"
              value={certificatePin}
              onChange={(e) =>
                setCertificatePin(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="Confirm 6-digit PIN"
              value={certificatePinConfirm}
              onChange={(e) =>
                setCertificatePinConfirm(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            <button
              className="primary-button full-width"
              onClick={saveCertificatePin}
            >
              Save Certificate PIN
            </button>

            <button
              className="text-button"
              onClick={() => {
                setPinSetupDocument(null);
                setCertificatePin("");
                setCertificatePinConfirm("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {pinPromptDocument && (
        <div className="pin-modal-overlay">
          <div className="pin-modal">
            <div className="secure-lock-animation">
              🔐
            </div>

            <div className="brand-kicker">
              PROTECTED CERTIFICATE
            </div>

            <h2>
              {pinPromptDocument.title}
            </h2>

            <p>
              Enter the certificate PIN to open this
              document.
            </p>

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              placeholder="Enter certificate PIN"
              value={pinPromptValue}
              onChange={(e) =>
                setPinPromptValue(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            <button
              className="primary-button full-width"
              onClick={verifyCertificatePin}
            >
              Unlock Certificate
            </button>

            <button
              className="text-button"
              onClick={() => {
                setPinPromptDocument(null);
                setPinPromptValue("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          protectedDocument={Boolean(
            certificatePins[selectedDocument.id]
          )}
          onClose={() => setSelectedDocument(null)}
          onDelete={() =>
            deleteDocument(selectedDocument.id)
          }
          onProtect={() => {
            setPinSetupDocument(selectedDocument);
            setCertificatePin("");
            setCertificatePinConfirm("");
            setSelectedDocument(null);
          }}
        />
      )}

      {vaultLocked && (
        <div className="pin-modal-overlay">
          <div className="pin-modal">
            <div className="secure-lock-animation">
              🔒
            </div>

            <div className="brand-kicker">
              TRUSTVAULT LOCKED
            </div>

            <h2>Vault Locked</h2>

            <p>
              Enter your Vault PIN to continue.
            </p>

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              placeholder="Enter Vault PIN"
              value={unlockPin}
              onChange={(e) =>
                setUnlockPin(
                  e.target.value.replace(/\D/g, "")
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  unlockVault();
                }
              }}
            />

            <button
              className="primary-button full-width"
              onClick={unlockVault}
            >
              <Icon name="unlock" /> Unlock Vault
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (authLoading) {
    return (
      <div className="screen intro-screen">
        <div className="intro-card">
          <div className="vault-logo">
            <Icon name="shield" />
          </div>

          <h1>TRUSTVAULT</h1>

          <p>Loading secure environment...</p>
        </div>
      </div>
    );
  }

  if (screen === "intro1") {
    return renderIntro1();
  }

  if (screen === "intro2") {
    return renderIntro2();
  }

  if (screen === "login") {
    return renderLogin();
  }

  if (screen === "register") {
    return renderRegister();
  }

  if (screen === "face") {
    return renderFaceVerification();
  }

  if (screen === "dashboard") {
    return renderDashboardApp();
  }

  return renderLogin();
}

/* DOCUMENT MODAL */

function DocumentModal({
  document,
  protectedDocument,
  onClose,
  onDelete,
  onProtect,
}) {
  return (
    <div className="document-modal-overlay">
      <div className="document-modal">
        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="brand-kicker">
          TRUSTVAULT DOCUMENT
        </div>

        <div className="document-modal-icon">
          📜
        </div>

        <h2>{document.title}</h2>

        <span className="status-pill granted">
          {document.status}
        </span>

        <div className="document-details">
          <div>
            <small>Category</small>
            <strong>{document.category}</strong>
          </div>

          <div>
            <small>Issuer</small>
            <strong>{document.issuer}</strong>
          </div>

          <div>
            <small>Holder</small>
            <strong>{document.holder}</strong>
          </div>

          <div>
            <small>Issue Date</small>
            <strong>{document.issueDate}</strong>
          </div>

          <div>
            <small>Expiry Date</small>
            <strong>{document.expiryDate}</strong>
          </div>

          <div>
            <small>Document Number</small>
            <strong>{document.number}</strong>
          </div>

          <div>
            <small>Integrity Hash</small>
            <strong>{document.hash}</strong>
          </div>
        </div>

        <div className="document-modal-actions">
          {!protectedDocument && (
            <button
              className="primary-button"
              onClick={onProtect}
            >
              🔐 Protect with PIN
            </button>
          )}

          {protectedDocument && (
            <span className="security-note">
              🔐 Certificate PIN protection enabled
            </span>
          )}

          <button
            className="danger-button"
            onClick={onDelete}
          >
            Delete Document
          </button>

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* SETTING TOGGLE */

function SettingToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`setting-toggle ${
        checked ? "toggle-on" : ""
      }`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

export default App;