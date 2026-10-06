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
  useEffect(() => {
  console.log("Supabase connected:", !!supabase);
}, []);
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

  const [registeredUser, setRegisteredUser] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("trustvaultAccount")
        ) || null
      );
    } catch {
      return null;
    }
  });

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

  /* ---------------- VAULT PIN ---------------- */

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinExists, setPinExists] = useState(false);
  const [pinMode, setPinMode] = useState("create");

  const [vaultLocked, setVaultLocked] = useState(false);
  const [unlockPin, setUnlockPin] = useState("");

  /* ---------------- CERTIFICATE PINS ---------------- */

  const [certificatePins, setCertificatePins] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "trustvaultCertificatePins"
        ) || "{}"
      );
    } catch {
      return {};
    }
  });

  const [pinSetupDocument, setPinSetupDocument] =
    useState(null);

  const [certificatePin, setCertificatePin] =
    useState("");

  const [
    certificatePinConfirm,
    setCertificatePinConfirm,
  ] = useState("");

  const [pinPromptDocument, setPinPromptDocument] =
    useState(null);

  const [pinPromptValue, setPinPromptValue] =
    useState("");

  /* ---------------- SETTINGS ---------------- */

  const [settings, setSettings] = useState({
    notifications: true,
    aiAlerts: true,
    loginAlerts: true,
    autoLock: true,
    sessionTimeout: "15 minutes",
    theme: "Dark Blue",
  });

  /* ---------------- CAMERA ---------------- */

  const [cameraActive, setCameraActive] =
    useState(false);

  const [faceStatus, setFaceStatus] = useState(
    "Preparing camera..."
  );

  const [faceDetected, setFaceDetected] =
    useState(false);

  /* ---------------- UI ---------------- */

  const [toast, setToast] = useState("");
  const [showThreat, setShowThreat] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* ---------------- TOAST ---------------- */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3200);
  };

  /* ---------------- AI ASSISTANT ---------------- */

  const sendAssistantMessage = (message = chatInput) => {
    const question = message.trim();

    if (!question) return;

    const normalizedQuestion = question.toLowerCase();

    let response;

    if (
      /security|secure|threat|protect/.test(
        normalizedQuestion
      )
    ) {
      const activeControls = Object.values(
        security
      ).filter(Boolean).length;

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
        (permission) =>
          permission.status === "Granted"
      ).length;

      response = {
        text: `You currently have ${activePermissions} active permission${
          activePermissions === 1 ? "" : "s"
        }. You can review or revoke access in Permissions.`,
        action: "permissions",
        actionLabel: "Review Permissions",
      };
    } else if (
      /document|certificate|credential|vault/.test(
        normalizedQuestion
      )
    ) {
      response = {
        text: `There are ${documents.length} document${
          documents.length === 1 ? "" : "s"
        } in your vault. Open Documents to see the records and their details.`,
        action: "documents",
        actionLabel: "Open Documents",
      };
    } else if (/pin/.test(normalizedQuestion)) {
      const protectedCount = Object.values(
        certificatePins
      ).filter(Boolean).length;

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
    if (
      chatOpen &&
      chatMessagesRef.current
    ) {
      chatMessagesRef.current.scrollTop =
        chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, chatOpen]);

  /* ---------------- LOCAL STORAGE ---------------- */

  useEffect(() => {
    if (registeredUser) {
      localStorage.setItem(
        "trustvaultAccount",
        JSON.stringify(registeredUser)
      );
    }
  }, [registeredUser]);

  useEffect(() => {
    localStorage.setItem(
      "trustvaultCertificatePins",
      JSON.stringify(certificatePins)
    );
  }, [certificatePins]);

  /* ---------------- ACCOUNT ---------------- */

  const createAccount = async () => {
  if (!registerName || !registerEmail || !registerPassword) {
    showToast("Please fill all fields");
    return;
  }

  if (registerPassword.length < 6) {
    showToast("Password must be at least 6 characters");
    return;
  }

  try {
    // Create account in Supabase Authentication
    const { data, error } = await supabase.auth.signUp({
      email: registerEmail.trim(),
      password: registerPassword,
    });

    if (error) {
      console.error("Signup error:", error);
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
      .insert({
        id: data.user.id,
        full_name: registerName.trim(),
      });

    if (profileError) {
      console.error("Profile error:", profileError);
      showToast("Account created, but profile setup failed");
      return;
    }

    // Keep your existing app state working
    setRegisteredUser({
      name: registerName.trim(),
      email: registerEmail.trim(),
    });

    showToast("Account created successfully 🎉");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");

    setScreen("login");

  } catch (err) {
    console.error("Unexpected signup error:", err);
    showToast("Something went wrong");
  }
};
  /* ---------------- LOGIN ---------------- */

  const login = () => {
    if (!registeredUser) {
      showToast(
        "🔐 Invalid credentials. Please create an account first."
      );
      return;
    }

    const entered = loginPhone
      .trim()
      .toLowerCase();

    const correctEmail =
      entered === registeredUser.email;

    const correctPassword =
      loginPassword === registeredUser.password;

    if (
      !correctEmail ||
      !correctPassword
    ) {
      showToast(
        "⚠ Invalid credentials. Please check your email and password."
      );
      return;
    }

    showToast(
      "✓ Credentials verified • Secure access granted"
    );

    setTimeout(() => {
      setScreen("face");
    }, 700);
  };

  /* ---------------- CAMERA ---------------- */

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
      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setFaceStatus(
          "Camera not supported."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: "user",
              width: {
                ideal: 720,
              },
              height: {
                ideal: 720,
              },
            },
            audio: false,
          }
        );

      streamRef.current = stream;

      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }

      setFaceStatus(
        "Camera active • Position your face"
      );

      setTimeout(() => {
        setFaceDetected(true);
        setFaceStatus(
          "Face detected • Ready"
        );
      }, 1500);
    } catch {
      setCameraActive(false);

      setFaceStatus(
        "Camera permission required."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      streamRef.current = null;
    }

    setCameraActive(false);
  };

  const verifyFace = () => {
    if (!cameraActive) {
      showToast(
        "Allow camera access first."
      );
      return;
    }

    setFaceStatus("Scanning face...");
    setFaceDetected(true);

    setTimeout(() => {
      setFaceStatus(
        "Verifying identity..."
      );

      setTimeout(() => {
        setFaceStatus(
          "Identity Verified ✓"
        );

        setTimeout(() => {
          stopCamera();

          setActivePage("dashboard");
          setScreen("dashboard");

          showToast(
            "Welcome to TrustVault."
          );
        }, 900);
      }, 1600);
    }, 1000);
  };

  /* ---------------- DOCUMENTS ---------------- */

  const uploadDocument = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const newDocument = {
      id: `TV-UP-${Date.now()}`,
      title: file.name.replace(
        /\.[^/.]+$/,
        ""
      ),
      category: "Uploaded Document",
      issuer: "Uploaded by User",
      holder:
        registeredUser?.name ||
        "TrustVault Demo User",
      issueDate:
        new Date().toLocaleDateString(),
      expiryDate: "Not specified",
      status: "Uploaded",
      number: "USER-UPLOAD",
      hash: `TV-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`,
    };

    setDocuments((current) => [
      newDocument,
      ...current,
    ]);

    showToast(
      "✓ Document uploaded successfully."
    );

    event.target.value = "";
  };

  const deleteDocument = (id) => {
    setDocuments((current) =>
      current.filter(
        (document) =>
          document.id !== id
      )
    );

    setSelectedDocument(null);

    setCertificatePins((current) => {
      const updated = {
        ...current,
      };

      delete updated[id];

      return updated;
    });

    showToast(
      "Document deleted from your vault."
    );
  };

  const openDocument = (document) => {
    const savedPin =
      certificatePins[document.id];

    if (savedPin) {
      setPinPromptDocument(
        document
      );

      setPinPromptValue("");

      return;
    }

    setSelectedDocument(document);
  };

  /* ---------------- CERTIFICATE PIN ---------------- */

  const saveCertificatePin = () => {
    if (!pinSetupDocument) return;

    if (!/^\d{6}$/.test(certificatePin)) {
      showToast(
        "Certificate PIN must contain exactly 6 digits."
      );

      return;
    }

    if (
      certificatePin !==
      certificatePinConfirm
    ) {
      showToast(
        "Certificate PINs do not match."
      );

      return;
    }

    setCertificatePins((current) => ({
      ...current,
      [pinSetupDocument.id]:
        certificatePin,
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
      certificatePins[
        pinPromptDocument.id
      ]
    ) {
      const document =
        pinPromptDocument;

      setPinPromptDocument(null);
      setPinPromptValue("");
      setSelectedDocument(document);

      showToast(
        "✓ Certificate PIN verified."
      );
    } else {
      setPinPromptValue("");

      showToast(
        "❌ Incorrect certificate PIN."
      );
    }
  };

  /* ---------------- PERMISSIONS ---------------- */

  const togglePermission = (index) => {
    setPermissions((current) =>
      current.map(
        (permission, i) =>
          i === index
            ? {
                ...permission,
                status:
                  permission.status ===
                  "Granted"
                    ? "Revoked"
                    : "Granted",
              }
            : permission
      )
    );

    showToast(
      "Permission updated."
    );
  };

  /* ---------------- SECURITY ---------------- */

  const toggleSecurity = (key) => {
    setSecurity((current) => ({
      ...current,
      [key]: !current[key],
    }));

    showToast(
      "Security control updated."
    );
  };

  const secureWholeVault = () => {
    const secured = {};

    Object.keys(defaultSecurity).forEach(
      (key) => {
        secured[key] = true;
      }
    );

    setSecurity(secured);

    showToast(
      "🛡 Whole Vault security activated."
    );
  };

  const simulateThreat = () => {
    setShowThreat(true);

    showToast(
      "🚨 Suspicious access attempt detected."
    );

    setTimeout(() => {
      setShowThreat(false);
    }, 5000);
  };

  /* ---------------- VAULT PIN ---------------- */

  const savePin = () => {
    if (!/^\d{6}$/.test(pin)) {
      showToast(
        "PIN must contain exactly 6 digits."
      );

      return;
    }

    if (pinMode === "create") {
      setPinMode("confirm");

      showToast(
        "Enter your PIN again."
      );

      return;
    }

    if (pin !== confirmPin) {
      showToast(
        "PINs do not match."
      );

      setConfirmPin("");

      return;
    }

    setPinExists(true);
    setPinMode("create");
    setConfirmPin("");

    showToast(
      "✓ Your Vault PIN has been set."
    );
  };

  const lockVault = () => {
    if (!pinExists) {
      showToast(
        "Set your PIN before locking the Vault."
      );

      setActivePage("settings");

      return;
    }

    setVaultLocked(true);

    showToast(
      "TrustVault locked."
    );
  };

  const unlockVault = () => {
    if (unlockPin === pin) {
      setVaultLocked(false);
      setUnlockPin("");

      showToast(
        "✓ Vault unlocked."
      );
    } else {
      showToast(
        "❌ Incorrect PIN."
      );

      setUnlockPin("");
    }
  };

  /* ---------------- SETTINGS ---------------- */

  const changeSetting = (
    key,
    value
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    showToast(
      "Setting updated."
    );
  };

  /* ---------------- NAVIGATION ---------------- */

  const goToPage = (page) => {
    setActivePage(page);
  };

  /* ---------------- INTRO 1 ---------------- */

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

        <h2>
          Your Credentials. Your Control.
        </h2>

        <p>
          A secure digital vault designed
          to keep your identity,
          education and professional
          credentials under your control.
        </p>

        <div className="feature-strip">
          <span>
            🔐 User Controlled
          </span>

          <span>
            🛡 Protected
          </span>

          <span>
            👤 Verified Access
          </span>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setScreen("intro2")
          }
        >
          Get Started →
        </button>
      </div>
    </div>
  );

  /* ---------------- INTRO 2 ---------------- */

  const renderIntro2 = () => (
    <div className="screen intro-screen">
      <div className="security-grid" />

      <div className="intro-card second-intro">
        <div className="brand-kicker">
          TRUSTVAULT SECURITY PLATFORM
        </div>

        <h1>ONE SECURE VAULT</h1>

        <h2>
          Everything under your control.
        </h2>

        <div className="feature-grid">
          <div className="feature-card">
            <span>🪪</span>

            <strong>
              Identity Proofs
            </strong>

            <small>
              Aadhaar, PAN & Voter ID
            </small>
          </div>

          <div className="feature-card">
            <span>🎓</span>

            <strong>
              Education Records
            </strong>

            <small>
              10th & Intermediate Memos
            </small>
          </div>

          <div className="feature-card">
            <span>📜</span>

            <strong>
              Certificates
            </strong>

            <small>
              Professional credentials
            </small>
          </div>

          <div className="feature-card">
            <span>🔐</span>

            <strong>
              Self Control
            </strong>

            <small>
              Grant or revoke access
            </small>
          </div>

          <div className="feature-card">
            <span>🤖</span>

            <strong>
              AI Security
            </strong>

            <small>
              Threat alerts & assistant
            </small>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setScreen("login")
          }
        >
          Continue to Secure Login →
        </button>
      </div>
    </div>
  );

  /* ---------------- LOGIN ---------------- */

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
          Sign in to access your
          protected digital vault.
        </p>

        <label htmlFor="login-email">
          Email Address
        </label>

        <input
          id="login-email"
          type="email"
          autoComplete="username"
          required
          value={loginPhone}
          onChange={(e) =>
            setLoginPhone(
              e.target.value
            )
          }
          placeholder="Enter your registered email address"
        />

        {loginPhone && (
          <div className="typing-status">
            <span className="typing-dot" />

            IDENTITY CHANNEL •{" "}
            {loginPhone.length} CHARACTERS
            DETECTED
          </div>
        )}

        <label htmlFor="login-password">
          Password
        </label>

        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={loginPassword}
          onChange={(e) =>
            setLoginPassword(
              e.target.value
            )
          }
          placeholder="Enter your password"
        />

        {loginPassword && (
          <div className="typing-status">
            <span className="typing-dot" />

            ENCRYPTION LAYER • PASSWORD
            INPUT SECURED
          </div>
        )}

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
          onClick={() =>
            setScreen("register")
          }
        >
          Create Account
        </button>

        <div className="security-note">
          🔒 Protected authentication •
          Face verification enabled
        </div>
      </form>
    </div>
  );

  /* ---------------- REGISTER ---------------- */

  const renderRegister = () => (
    <div className="screen auth-screen">
      <div className="security-grid" />

      <div className="auth-card">
        <div className="auth-logo">
          <Icon name="shield" />
        </div>

        <div className="brand-kicker">
          CREATE SECURE ACCOUNT
        </div>

        <h1>Create Account</h1>

        <p className="muted">
          Create your personal
          TrustVault identity.
        </p>

        <label>
          Full Name
        </label>

        <input
          value={registerName}
          onChange={(e) =>
            setRegisterName(
              e.target.value
            )
          }
          placeholder="Enter your full name"
        />

        <label>
          Email Address
        </label>

        <input
          type="email"
          value={registerEmail}
          onChange={(e) =>
            setRegisterEmail(
              e.target.value
            )
          }
          placeholder="you@example.com"
        />

        <label>
          Set Password
        </label>

        <input
          type="password"
          value={registerPassword}
          onChange={(e) =>
            setRegisterPassword(
              e.target.value
            )
          }
          placeholder="Create a password"
        />

        <label>
          Confirm Your Password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          placeholder="Enter password again"
        />

        <button
          className="primary-button full-width"
          onClick={createAccount}
        >
          Confirm & Create Account →
        </button>

        <button
          className="text-button"
          onClick={() =>
            setScreen("login")
          }
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );

  /* ---------------- FACE VERIFICATION ---------------- */

  const renderFaceVerification = () => (
    <div className="screen face-screen">
      <div className="security-grid" />

      <div className="face-card">
        <div className="brand-kicker">
          BIOMETRIC SECURITY
        </div>

        <h1>
          Live Face Verification
        </h1>

        <p className="muted">
          Verify your identity before
          entering the secure vault.
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
          {faceStatus.includes(
            "Verified"
          )
            ? "Opening Dashboard..."
            : "Start Face Verification"}
        </button>

        <div className="security-note">
          🔒 Camera processing is used
          for the verification step.
        </div>
      </div>
    </div>
  );

  /* ---------------- SIDEBAR ---------------- */

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="small-logo">
          <Icon name="shield" />
        </div>

        <div>
          <strong>
            TRUSTVAULT
          </strong>

          <small>
            SECURE IDENTITY
          </small>
        </div>
      </div>

      <nav>
        <button
          className={
            activePage === "dashboard"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            goToPage("dashboard")
          }
        >
          <Icon name="dashboard" />
          Dashboard
        </button>

        <button
          className={
            activePage === "documents"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            goToPage("documents")
          }
        >
          <Icon name="documents" />
          Documents
        </button>

        <button
          className={
            activePage === "permissions"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            goToPage("permissions")
          }
        >
          <Icon name="permissions" />
          Permissions
        </button>

        <button
          className={
            activePage === "security"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            goToPage("security")
          }
        >
          <Icon name="security" />
          Security Centre
        </button>

        <button
          className={
            activePage === "assistant"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            goToPage("assistant")
          }
        >
          <Icon name="ai" />
          AI Assistant
        </button>

        <button
          className={
            activePage === "settings"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            goToPage("settings")
          }
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

        <button
          onClick={() => {
            stopCamera();
            setScreen("login");
            setActivePage(
              "dashboard"
            );
          }}
        >
          <Icon name="logout" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  /* ---------------- TOPBAR ---------------- */

  const renderTopbar = () => (
    <header className="topbar">
      <div>
        <div className="topbar-title">
          {activePage === "dashboard"
            ? "Security Overview"
            : activePage ===
              "documents"
            ? "Document Vault"
            : activePage ===
              "permissions"
            ? "Access Permissions"
            : activePage ===
              "security"
            ? "Security Centre"
            : activePage ===
              "assistant"
            ? "AI Security Assistant"
            : "Settings"}
        </div>

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
            {(
              registeredUser?.name ||
              "T"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {registeredUser?.name ||
                "TrustVault User"}
            </strong>

            <small>
              Verified User
            </small>
          </div>
        </div>
      </div>
    </header>
  );

  /* ---------------- DASHBOARD ---------------- */

  const renderDashboard = () => (
    <>
      <section className="dashboard-hero">
        <div>
          <div className="brand-kicker">
            TRUSTVAULT SECURITY PLATFORM
          </div>

          <h1>
            Your Digital Identity.
            <br />
            <span>
              Under Your Control.
            </span>
          </h1>

          <p>
            Manage identity proofs,
            education records and
            professional credentials
            from one secure vault.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() =>
                goToPage(
                  "documents"
                )
              }
            >
              Open Document Vault
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                goToPage("security")
              }
            >
              Security Centre
            </button>
          </div>
        </div>

        <div className="hero-shield">
          <div className="hero-shield-inner">
            <Icon name="shield" />

            <span>
              SECURED
            </span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>
            Documents
          </span>

          <strong>
            {documents.length}
          </strong>

          <small>
            Protected records
          </small>
        </div>

        <div className="stat-card">
          <span>
            Permissions
          </span>

          <strong>
            {
              permissions.filter(
                (p) =>
                  p.status ===
                  "Granted"
              ).length
            }
          </strong>

          <small>
            Active permissions
          </small>
        </div>

        <div className="stat-card">
          <span>
            Security
          </span>

          <strong>
            {
              Object.values(
                security
              ).filter(Boolean).length
            }
            /
            {Object.keys(
              security
            ).length}
          </strong>

          <small>
            Controls active
          </small>
        </div>

        <div className="stat-card">
          <span>
            Vault
          </span>

          <strong>
            ACTIVE
          </strong>

          <small>
            Protected session
          </small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel control-panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">
                CONTROL
              </div>

              <h3>
                All Controls in My Hands
              </h3>
            </div>
          </div>

          <p className="control-description">
            Manage every important
            security and credential
            permission yourself.
          </p>

          <div className="control-list">
            <div>
              🔒 Lock / Unlock Vault
            </div>

            <div>
              🔑 Set & Change PIN
            </div>

            <div>
              🔐 Certificate PIN
              Protection
            </div>

            <div>
              🤝 Grant / Revoke Access
            </div>

            <div>
              🪪 Manage Identity
              Documents
            </div>

            <div>
              🚨 Control Threat Alerts
            </div>

            <div>
              👤 Face Verification
            </div>
          </div>

          <button
            className="secondary-button full-width"
            onClick={() =>
              goToPage("security")
            }
          >
            Open Control Centre
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">
                PROTECTION
              </div>

              <h3>
                Vault Security
              </h3>
            </div>
          </div>

          <div className="security-summary">
            <div className="security-summary-icon">
              🔐
            </div>

            <strong>
              {
                Object.values(
                  security
                ).filter(Boolean).length
              }{" "}
              Security Controls Active
            </strong>

            <p>
              Your TrustVault
              protection layer is
              currently active.
            </p>
          </div>

          <button
            className="primary-button full-width dashboard-security-button"
            onClick={() =>
              goToPage("settings")
            }
          >
            Manage Certificate PINs
          </button>
        </div>
      </section>

      <section className="panel video-panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker">
              VIDEO
            </div>

            <h3>
              26 September 2026
            </h3>
          </div>
        </div>

        <div className="dashboard-video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/SHZC7QtPSIY"
            title="26 September 2026 - YouTube"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className="panel activity-panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker">
              ACTIVITY
            </div>

            <h3>
              Recent Security Activity
            </h3>
          </div>
        </div>

        <div className="activity-row">
          <span className="activity-icon success">
            ✓
          </span>

          <div>
            <strong>
              Face verification
              completed
            </strong>

            <small>
              Secure login approved
            </small>
          </div>

          <time>
            Just now
          </time>
        </div>

        <div className="activity-row">
          <span className="activity-icon">
            🔐
          </span>

          <div>
            <strong>
              Certificate PIN
              protection available
            </strong>

            <small>
              Protect certificates
              individually
            </small>
          </div>

          <time>
            Today
          </time>
        </div>

        <div className="activity-row">
          <span className="activity-icon">
            🛡
          </span>

          <div>
            <strong>
              Security controls
              active
            </strong>

            <small>
              TrustVault monitoring
              enabled
            </small>
          </div>

          <time>
            Today
          </time>
        </div>
      </section>
    </>
  );

  /* ---------------- DOCUMENTS ---------------- */

  const renderDocuments = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="brand-kicker">
            PRIVATE CREDENTIAL STORAGE
          </div>

          <h1>
            Document Vault
          </h1>

          <p>
            Identity proofs, education
            records and certificates
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
      </div>

      <div className="category-title">
        🪪 Identity Proofs
      </div>

      <div className="document-grid">
        {documents
          .filter(
            (d) =>
              d.category ===
              "Identity Proof"
          )
          .map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              protectedDocument={Boolean(
                certificatePins[
                  document.id
                ]
              )}
              onClick={() =>
                openDocument(document)
              }
            />
          ))}
      </div>

      <div className="category-title">
        🎓 Education Documents
      </div>

      <div className="document-grid">
        {documents
          .filter(
            (d) =>
              d.category ===
              "Education Document"
          )
          .map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              protectedDocument={Boolean(
                certificatePins[
                  document.id
                ]
              )}
              onClick={() =>
                openDocument(document)
              }
            />
          ))}
      </div>

      <div className="category-title">
        🏆 Certifications &
        Professional Documents
      </div>

      <div className="document-grid">
        {documents
          .filter(
            (d) =>
              d.category ===
                "Certification" ||
              d.category ===
                "Professional Document" ||
              d.category ===
                "Uploaded Document"
          )
          .map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              protectedDocument={Boolean(
                certificatePins[
                  document.id
                ]
              )}
              onClick={() =>
                openDocument(document)
              }
            />
          ))}
      </div>
    </>
  );

  /* ---------------- PERMISSIONS ---------------- */

  const renderPermissions = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="brand-kicker">
            USER CONTROL
          </div>

          <h1>
            Access Permissions
          </h1>

          <p>
            Decide exactly who can
            access your credentials.
          </p>
        </div>
      </div>

      <div className="permission-grid">
        {permissions.map(
          (permission, index) => (
            <div
              className="permission-card"
              key={permission.name}
            >
              <div className="permission-icon">
                <Icon name="shield" />
              </div>

              <div className="permission-content">
                <h3>
                  {permission.name}
                </h3>

                <p>
                  {permission.document}
                </p>

                <span
                  className={
                    permission.status ===
                    "Granted"
                      ? "status-pill granted"
                      : "status-pill revoked"
                  }
                >
                  {permission.status}
                </span>
              </div>

              <button
                className={
                  permission.status ===
                  "Granted"
                    ? "danger-button"
                    : "primary-button"
                }
                onClick={() =>
                  togglePermission(
                    index
                  )
                }
              >
                {permission.status ===
                "Granted"
                  ? "Revoke Access"
                  : "Grant Access"}
              </button>
            </div>
          )
        )}
      </div>

      <div className="control-banner">
        <div>
          <strong>
            🔐 Permission Control
          </strong>

          <p>
            You decide when an
            organization can access
            your credentials.
          </p>
        </div>

        <span>
          FULL USER CONTROL
        </span>
      </div>
    </>
  );

  /* ---------------- SECURITY ---------------- */

  const securityItems = [
    [
      "securityMonitoring",
      "Security Monitoring",
      "Monitor vault activity",
    ],
    [
      "faceVerification",
      "Face Verification",
      "Protect identity access",
    ],
    [
      "aiThreatAlerts",
      "AI Threat Alerts",
      "Detect suspicious activity",
    ],
    [
      "permissionTracking",
      "Permission Tracking",
      "Monitor credential sharing",
    ],
    [
      "autoLock",
      "Automatic Vault Lock",
      "Lock after inactivity",
    ],
    [
      "loginAlerts",
      "Login Alerts",
      "Notify about account access",
    ],
    [
      "certificateIntegrity",
      "Certificate Integrity",
      "Protect document integrity",
    ],
  ];

  const renderSecurity = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="brand-kicker">
            SECURITY CONTROL CENTRE
          </div>

          <h1>
            All Controls in My Hands
          </h1>

          <p>
            Select and control every
            TrustVault protection
            yourself.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={secureWholeVault}
        >
          🛡 Secure Whole Vault
        </button>
      </div>

      <div className="control-status-banner">
        <div className="big-security-icon">
          <Icon name="shield" />
        </div>

        <div>
          <strong>
            Your Vault • Your Control
          </strong>

          <p>
            {
              Object.values(
                security
              ).filter(Boolean).length
            }{" "}
            of{" "}
            {Object.keys(
              security
            ).length}{" "}
            security controls are
            active.
          </p>
        </div>

        <span className="secure-label">
          PROTECTED
        </span>
      </div>

      <div className="security-grid-cards">
        {securityItems.map(
          ([
            key,
            title,
            description,
          ]) => (
            <div
              className="security-control-card"
              key={key}
            >
              <div className="security-control-top">
                <div className="security-control-icon">
                  <Icon name="shield" />
                </div>

                <button
                  className={
                    security[key]
                      ? "toggle active"
                      : "toggle"
                  }
                  onClick={() =>
                    toggleSecurity(
                      key
                    )
                  }
                >
                  <span />
                </button>
              </div>

              <h3>{title}</h3>

              <p>
                {description}
              </p>

              <span className="control-state">
                {security[key]
                  ? "ACTIVE"
                  : "OFF"}
              </span>
            </div>
          )
        )}
      </div>

      <div className="danger-zone">
        <div>
          <strong>
            🚨 Security Test
          </strong>

          <p>
            Simulate a suspicious
            access attempt for your
            hackathon demonstration.
          </p>
        </div>

        <button
          className="danger-button"
          onClick={simulateThreat}
        >
          Simulate Threat
        </button>
      </div>
    </>
  );

  /* ---------------- SETTINGS ---------------- */

  const renderSettings = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="brand-kicker">
            ACCOUNT CONTROL
          </div>

          <h1>Settings</h1>

          <p>
            Control your TrustVault
            experience.
          </p>
        </div>
      </div>

      <div className="settings-grid">

        {/* PROFILE */}

        <div className="settings-card">
          <div className="settings-card-title">
            <span>👤</span>

            <div>
              <h3>
                Profile
              </h3>

              <p>
                Your TrustVault identity
              </p>
            </div>
          </div>

          <div className="profile-setting">
            <strong>
              {registeredUser?.name ||
                "TrustVault User"}
            </strong>

            <span>
              {registeredUser?.email ||
                "demo@trustvault.local"}
            </span>
          </div>
        </div>

        {/* VAULT SECURITY */}

        <div className="settings-card">
          <div className="settings-card-title">
            <span>🔐</span>

            <div>
              <h3>
                Vault Security
              </h3>

              <p>
                Protect your vault
              </p>
            </div>
          </div>

          <button
            className="setting-action"
            onClick={() => {
              setPinMode("create");
              setPin("");
              setConfirmPin("");
            }}
          >
            <span>🔑</span>

            <div>
              <strong>
                {pinExists
                  ? "Change Your PIN"
                  : "Set Your PIN"}
              </strong>

              <small>
                {pinExists
                  ? "PIN protection is active"
                  : "Create a 6-digit Vault PIN"}
              </small>
            </div>
          </button>

          <button
            className="setting-action lock-action"
            onClick={lockVault}
          >
            <span>🔒</span>

            <div>
              <strong>
                Lock Your Vault
              </strong>

              <small>
                Require PIN to unlock
              </small>
            </div>
          </button>
        </div>

        {/* CERTIFICATE PIN */}

        <div className="settings-card certificate-pin-card">
          <div className="settings-card-title">
            <span>🛡️</span>

            <div>
              <h3>
                Certificate PIN Access
              </h3>

              <p>
                Protect every certificate
                individually
              </p>
            </div>
          </div>

          <div className="certificate-pin-list">
            {documents.map(
              (document) => {
                const protectedDocument =
                  Boolean(
                    certificatePins[
                      document.id
                    ]
                  );

                return (
                  <div
                    className="certificate-pin-row"
                    key={document.id}
                  >
                    <div className="certificate-pin-info">
                      <span className="certificate-mini-icon">
                        {document.category ===
                        "Identity Proof"
                          ? "🪪"
                          : document.category ===
                            "Education Document"
                          ? "🎓"
                          : "📜"}
                      </span>

                      <div>
                        <strong>
                          {
                            document.title
                          }
                        </strong>

                        <small>
                          {protectedDocument
                            ? "🔒 PIN protection enabled"
                            : "🔓 No certificate PIN"}
                        </small>
                      </div>
                    </div>

                    <button
                      className={
                        protectedDocument
                          ? "certificate-pin-change"
                          : "certificate-pin-set"
                      }
                      onClick={() => {
                        setPinSetupDocument(
                          document
                        );

                        setCertificatePin(
                          ""
                        );

                        setCertificatePinConfirm(
                          ""
                        );
                      }}
                    >
                      {protectedDocument
                        ? "Change PIN"
                        : "Set PIN"}
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* NOTIFICATIONS */}

        <div className="settings-card">
          <div className="settings-card-title">
            <span>🔔</span>

            <div>
              <h3>
                Notifications
              </h3>

              <p>
                Control security
                notifications
              </p>
            </div>
          </div>

          <SettingToggle
            label="Security Notifications"
            value={
              settings.notifications
            }
            onChange={(value) =>
              changeSetting(
                "notifications",
                value
              )
            }
          />

          <SettingToggle
            label="AI Threat Alerts"
            value={
              settings.aiAlerts
            }
            onChange={(value) =>
              changeSetting(
                "aiAlerts",
                value
              )
            }
          />

          <SettingToggle
            label="Login Alerts"
            value={
              settings.loginAlerts
            }
            onChange={(value) =>
              changeSetting(
                "loginAlerts",
                value
              )
            }
          />
        </div>

        {/* SECURITY CONTROLS */}

        <div className="settings-card">
          <div className="settings-card-title">
            <span>⚙️</span>

            <div>
              <h3>
                Security Controls
              </h3>

              <p>
                Choose your protection
                level
              </p>
            </div>
          </div>

          <SettingToggle
            label="Automatic Vault Lock"
            value={
              settings.autoLock
            }
            onChange={(value) =>
              changeSetting(
                "autoLock",
                value
              )
            }
          />

          <label className="select-setting">
            <span>
              Session Timeout
            </span>

            <select
              value={
                settings.sessionTimeout
              }
              onChange={(e) =>
                changeSetting(
                  "sessionTimeout",
                  e.target.value
                )
              }
            >
              <option>
                5 minutes
              </option>

              <option>
                15 minutes
              </option>

              <option>
                30 minutes
              </option>

              <option>
                60 minutes
              </option>
            </select>
          </label>
        </div>

        {/* APPEARANCE */}

        <div className="settings-card">
          <div className="settings-card-title">
            <span>🎨</span>

            <div>
              <h3>
                Appearance
              </h3>

              <p>
                Customize the interface
              </p>
            </div>
          </div>

          <label className="select-setting">
            <span>
              Theme
            </span>

            <select
              value={settings.theme}
              onChange={(e) =>
                changeSetting(
                  "theme",
                  e.target.value
                )
              }
            >
              <option>
                Dark Blue
              </option>

              <option>
                Light Blue
              </option>
            </select>
          </label>
        </div>

        {/* PRIVACY */}

        <div className="settings-card danger-settings">
          <div className="settings-card-title">
            <span>🔏</span>

            <div>
              <h3>
                Privacy & Data Control
              </h3>

              <p>
                Your data decisions
              </p>
            </div>
          </div>

          <button
            className="setting-action"
            onClick={() =>
              showToast(
                "Vault data export prepared for demo."
              )
            }
          >
            📤 Export Vault Data
          </button>

          <button
            className="setting-action danger-text"
            onClick={() =>
              showToast(
                "Demo: user-controlled data deletion."
              )
            }
          >
            🗑 Delete Your Data
          </button>
        </div>
      </div>

      {/* VAULT PIN HELPER */}

      {pinMode === "create" &&
        !pinExists && (
          <div className="pin-create-helper">
            <strong>
              🔑 Set Your PIN
            </strong>

            <p>
              Use the Vault Security
              section above to create
              your 6-digit Vault PIN.
            </p>

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) =>
                setPin(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="Enter 6-digit PIN"
            />

            <button
              className="primary-button"
              onClick={savePin}
            >
              Continue
            </button>
          </div>
        )}

      {pinMode === "confirm" && (
        <div className="pin-modal-overlay">
          <div className="pin-modal">
            <div className="auth-logo">
              <Icon name="lock" />
            </div>

            <div className="brand-kicker">
              VAULT SECURITY
            </div>

            <h2>
              Confirm Your PIN
            </h2>

            <p>
              Enter your 6-digit PIN
              again to protect your
              Vault.
            </p>

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={confirmPin}
              onChange={(e) =>
                setConfirmPin(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="••••••"
            />

            <button
              className="primary-button full-width"
              onClick={savePin}
            >
              Confirm PIN
            </button>

            <button
              className="text-button"
              onClick={() => {
                setPinMode("create");
                setConfirmPin("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );

  /* ---------------- AI ASSISTANT ---------------- */

  const renderAssistant = () => (
    <div className="assistant-page">
      <div className="assistant-header">
        <div className="ai-orb">
          ✦
        </div>

        <div>
          <div className="brand-kicker">
            TRUSTVAULT AI
          </div>

          <h1>
            Security Assistant
          </h1>

          <p>
            Your intelligent guide to
            TrustVault security.
          </p>
        </div>
      </div>

      <div className="assistant-grid">
        <div className="assistant-message">
          <div className="ai-avatar">
            ✦
          </div>

          <div>
            <strong>
              TrustVault AI
            </strong>

            <p>
              Your vault currently has{" "}
              <b>
                {
                  Object.values(
                    security
                  ).filter(Boolean)
                    .length
                }
              </b>{" "}
              active security
              controls.
            </p>

            <p>
              You can manage documents,
              permissions, security
              settings and certificate
              PINs from your dashboard.
            </p>
          </div>
        </div>

        <button
          className="assistant-action"
          onClick={() =>
            goToPage("security")
          }
        >
          🛡 Review Security
          Controls
        </button>

        <button
          className="assistant-action"
          onClick={() =>
            goToPage("permissions")
          }
        >
          🤝 Review Permissions
        </button>

        <button
          className="assistant-action"
          onClick={() =>
            goToPage("documents")
          }
        >
          📜 Review Documents
        </button>

        <button
          className="assistant-action"
          onClick={() =>
            goToPage("settings")
          }
        >
          🔐 Manage Certificate
          PINs
        </button>
      </div>
    </div>
  );

  /* ---------------- ACTIVE PAGE ---------------- */

  const renderActivePage = () => {
    if (
      activePage === "documents"
    ) {
      return renderDocuments();
    }

    if (
      activePage === "permissions"
    ) {
      return renderPermissions();
    }

    if (
      activePage === "security"
    ) {
      return renderSecurity();
    }

    if (
      activePage === "assistant"
    ) {
      return renderAssistant();
    }

    if (
      activePage === "settings"
    ) {
      return renderSettings();
    }

    return renderDashboard();
  };

  /* ---------------- VAULT LOCK ---------------- */

  if (vaultLocked) {
    return (
      <div className="screen locked-screen">
        <div className="security-grid" />

        <div className="locked-card">
          <div className="locked-logo">
            🔒
          </div>

          <div className="brand-kicker">
            TRUSTVAULT SECURITY
          </div>

          <h1>
            Vault Locked
          </h1>

          <p>
            Your credentials are
            protected. Enter your
            Vault PIN to continue.
          </p>

          <input
            className="pin-input"
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={unlockPin}
            onChange={(e) =>
              setUnlockPin(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="••••••"
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
            🔓 Unlock Vault
          </button>

          <div className="security-note">
            All controls remain in
            your hands.
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- SCREENS ---------------- */

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

  return (
    <div className="app-shell">
      {renderSidebar()}

      <main className="main-area">
        {renderTopbar()}

        <div className="content-area">
          {renderActivePage()}
        </div>
      </main>

      {/* CERTIFICATE DETAILS */}

      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          protectedDocument={BoBoolean(
            certificatePins[
              selectedDocument.id
            ]
          )}
          onClose={() =>
            setSelectedDocument(null)
          }
          onDelete={() =>
            deleteDocument(
              selectedDocument.id
            )
          }
        />
      )}

      {/* AI ASSISTANT */}

      {chatOpen && (
        <section
          className="chat-panel"
          role="dialog"
          aria-labelledby="chat-title"
          aria-modal="false"
        >
          <header className="chat-panel-header">
            <div>
              <strong id="chat-title">
                TrustVault Assistant
              </strong>

              <small>
                Vault-aware demo
                assistant
              </small>
            </div>

            <button
              type="button"
              className="chat-close-button"
              aria-label="Close assistant"
              onClick={() =>
                setChatOpen(false)
              }
            >
              ×
            </button>
          </header>

          <div
            className="chat-messages"
            ref={chatMessagesRef}
            role="log"
            aria-live="polite"
          >
            {chatMessages.map(
              (
                chatMessage,
                index
              ) => (
                <div
                  className={`chat-message ${
                    chatMessage.role ===
                    "user"
                      ? "user-chat-message"
                      : "assistant-chat-message"
                  }`}
                  key={`${index}-${chatMessage.role}`}
                >
                  <p>
                    {chatMessage.text}
                  </p>

                  {chatMessage.action && (
                    <button
                      type="button"
                      className="chat-action-button"
                      onClick={() => {
                        goToPage(
                          chatMessage.action
                        );

                        setChatOpen(
                          false
                        );
                      }}
                    >
                      {
                        chatMessage.actionLabel
                      }
                    </button>
                  )}
                </div>
              )
            )}
          </div>

          <div className="chat-suggestions">
            {[
              "Security status",
              "My documents",
              "Sharing access",
            ].map(
              (suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() =>
                    sendAssistantMessage(
                      suggestion
                    )
                  }
                >
                  {suggestion}
                </button>
              )
            )}
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
                setChatInput(
                  event.target.value
                )
              }
            />

            <button
              type="submit"
              disabled={
                !chatInput.trim()
              }
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
        aria-expanded={chatOpen}
        onClick={() =>
          setChatOpen(
            (open) => !open
          )
        }
      >
        {chatOpen ? "×" : "✦"}
      </button>

      {/* THREAT ALERT */}

      {showThreat && (
        <div className="threat-overlay">
          <div className="threat-card">
            <div className="threat-icon">
              !
            </div>

            <div className="brand-kicker">
              TRUSTVAULT SECURITY
              ALERT
            </div>

            <h2>
              Suspicious Access Attempt
            </h2>

            <p>
              TrustVault detected
              unusual access activity.
              Security monitoring has
              been triggered.
            </p>

            <div className="threat-actions">
              <span>
                ✓ Activity monitored
              </span>

              <span>
                ✓ Permissions protected
              </span>

              <span>
                ✓ Vault security active
              </span>
            </div>

            <button
              className="primary-button full-width"
              onClick={() =>
                setShowThreat(false)
              }
            >
              Secure & Continue
            </button>
          </div>
        </div>
      )}

      {/* SET CERTIFICATE PIN */}

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
              Protect{" "}
              {
                pinSetupDocument.title
              }
            </h2>

            <p>
              Create a unique 6-digit
              PIN for this certificate.
            </p>

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={certificatePin}
              onChange={(e) =>
                setCertificatePin(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="Enter 6-digit PIN"
            />

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={
                certificatePinConfirm
              }
              onChange={(e) =>
                setCertificatePinConfirm(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="Confirm 6-digit PIN"
            />

            <button
              className="primary-button full-width"
              onClick={
                saveCertificatePin
              }
            >
              🔐 Protect Certificate
            </button>

            <button
              className="text-button"
              onClick={() => {
                setPinSetupDocument(
                  null
                );

                setCertificatePin(
                  ""
                );

                setCertificatePinConfirm(
                  ""
                );
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ENTER CERTIFICATE PIN */}

      {pinPromptDocument && (
        <div className="pin-modal-overlay">
          <div className="pin-modal certificate-unlock-modal">
            <div className="secure-lock-animation">
              🔒
            </div>

            <div className="brand-kicker">
              CERTIFICATE LOCKED
            </div>

            <h2>
              {pinPromptDocument.title}
            </h2>

            <p>
              This certificate is
              protected. Enter the PIN
              you previously set for
              this certificate.
            </p>

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={pinPromptValue}
              onChange={(e) =>
                setPinPromptValue(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  verifyCertificatePin();
                }
              }}
              placeholder="••••••"
            />

            <button
              className="primary-button full-width"
              onClick={
                verifyCertificatePin
              }
            >
              🔓 Unlock Certificate
            </button>

            <button
              className="text-button"
              onClick={() => {
                setPinPromptDocument(
                  null
                );

                setPinPromptValue(
                  ""
                );
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------- DOCUMENT CARD ---------------- */

function DocumentCard({
  document,
  onClick,
  protectedDocument,
}) {
  return (
    <button
      className="document-card"
      onClick={onClick}
    >
      <div className="document-icon">
        {document.category ===
        "Identity Proof"
          ? "🪪"
          : document.category ===
            "Education Document"
          ? "🎓"
          : document.category ===
            "Professional Document"
          ? "💼"
          : "📜"}
      </div>

      <div className="document-info">
        <span>
          {document.category}
        </span>

        <h3>
          {document.title}
        </h3>

        <p>
          {document.issuer}
        </p>

        {protectedDocument && (
          <small className="document-lock-label">
            🔒 PIN Protected
          </small>
        )}
      </div>

      <div className="verified-mark">
        {protectedDocument
          ? "🔐"
          : "✓"}
      </div>
    </button>
  );
}

/* ---------------- DOCUMENT MODAL ---------------- */

function DocumentModal({
  document,
  onClose,
  onDelete,
  protectedDocument,
}) {
  return (
    <div className="modal-overlay">
      <div className="document-modal">
        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="document-modal-icon">
          {document.category ===
          "Identity Proof"
            ? "🪪"
            : document.category ===
              "Education Document"
            ? "🎓"
            : "📜"}
        </div>

        <div className="brand-kicker">
          {document.category}
        </div>

        <h2>
          {document.title}
        </h2>

        {protectedDocument && (
          <span className="status-pill protected-pill">
            🔐 PIN Protected
          </span>
        )}

        <span className="status-pill granted">
          ✓ {document.status}
        </span>

        <div className="detail-grid">
          <div>
            <small>
              Holder
            </small>

            <strong>
              {document.holder}
            </strong>
          </div>

          <div>
            <small>
              Issuer
            </small>

            <strong>
              {document.issuer}
            </strong>
          </div>

          <div>
            <small>
              Document ID
            </small>

            <strong>
              {document.id}
            </strong>
          </div>

          <div>
            <small>
              Reference Number
            </small>

            <strong>
              {document.number}
            </strong>
          </div>

          <div>
            <small>
              Issue Date
            </small>

            <strong>
              {document.issueDate}
            </strong>
          </div>

          <div>
            <small>
              Expiry
            </small>

            <strong>
              {document.expiryDate}
            </strong>
          </div>

          <div className="hash-field">
            <small>
              Verification Hash
            </small>

            <strong>
              {document.hash}
            </strong>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={() =>
              alert(
                "Demo: AI document analysis completed."
              )
            }
          >
            ✦ AI Analyze
          </button>

          <button
            className="danger-button"
            onClick={onDelete}
          >
            Delete Document
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SETTING TOGGLE ---------------- */

function SettingToggle({
  label,
  value,
  onChange,
}) {
  return (
    <div className="setting-toggle">
      <span>
        {label}
      </span>

      <button
        className={
          value
            ? "toggle active"
            : "toggle"
        }
        onClick={() =>
          onChange(!value)
        }
      >
        <span />
      </button>
    </div>
  );
}

export default App;