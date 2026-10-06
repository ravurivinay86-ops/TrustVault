import React, { useEffect, useRef, useState } from "react";

const demoCertificates = [
  {
    id: 1,
    title: "B.Tech — Artificial Intelligence & Machine Learning",
    issuer: "NRI Institute of Technology",
    category: "Education",
    issued: "21 Sep 2026",
    expiry: "21 Sep 2030",
    credentialId: "TV-DEMO-28491",
    status: "Verified",
  },
  {
    id: 2,
    title: "Python Programming Specialist",
    issuer: "Digital Skills Academy",
    category: "Skills",
    issued: "18 Sep 2026",
    expiry: "No expiry",
    credentialId: "TV-DEMO-73921",
    status: "Verified",
  },
  {
    id: 3,
    title: "Generative AI Foundations",
    issuer: "Future AI Academy",
    category: "Skills",
    issued: "12 Sep 2026",
    expiry: "12 Sep 2028",
    credentialId: "TV-DEMO-58342",
    status: "Verified",
  },
  {
    id: 4,
    title: "Machine Learning Fundamentals",
    issuer: "Tech Learning Network",
    category: "Professional",
    issued: "05 Aug 2026",
    expiry: "05 Aug 2028",
    credentialId: "TV-DEMO-42178",
    status: "Verified",
  },
  {
    id: 5,
    title: "Data Analytics Internship",
    issuer: "DataWorks Technologies",
    category: "Internship",
    issued: "28 Jul 2026",
    expiry: "28 Jul 2027",
    credentialId: "TV-DEMO-91263",
    status: "Verified",
  },
  {
    id: 6,
    title: "AI Project Completion",
    issuer: "Innovation Labs",
    category: "Professional",
    issued: "15 Jun 2026",
    expiry: "15 Jun 2029",
    credentialId: "TV-DEMO-65743",
    status: "Verified",
  },
];

export default function App() {
  const [page, setPage] = useState("login");
  const [certificates, setCertificates] = useState(demoCertificates);
  const [selected, setSelected] = useState(null);

  const [permission, setPermission] = useState(false);
  const [sharing, setSharing] = useState(true);
  const [faceVerified, setFaceVerified] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraMessage, setCameraMessage] = useState(
    "Starting secure camera..."
  );

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [notifications, setNotifications] = useState(2);
  const [aiOpen, setAiOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! I'm TrustVault AI. Ask me about your certificates, security, sharing or identity.",
    },
  ]);

  const [message, setMessage] = useState("");

  const [accessRequest, setAccessRequest] = useState(false);

  /* CAMERA */

  useEffect(() => {
    if (page === "face") {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [page]);

  async function startCamera() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraMessage("Camera is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraReady(true);
      setCameraMessage("Position your face inside the circle.");
    } catch {
      setCameraReady(false);
      setCameraMessage(
        "Camera permission denied. Please allow camera access."
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  function verifyFace() {
    if (!cameraReady) {
      setCameraMessage("Please enable the camera first.");
      return;
    }

    setCameraMessage("Face detected • Identity verified ✓");

    setTimeout(() => {
      stopCamera();
      setFaceVerified(true);
      setPage("dashboard");
    }, 900);
  }

  /* LOGIN */

  function login() {
    setPage("face");
  }

  function logout() {
    stopCamera();
    setFaceVerified(false);
    setPermission(false);
    setPage("login");
  }

  /* CERTIFICATES */

  function openCertificate(cert) {
    setSelected(cert);
    setPage("certificate");
  }

  function deleteCertificate(id) {
    setCertificates((old) =>
      old.filter((certificate) => certificate.id !== id)
    );

    setSelected(null);
    setPage("credentials");
  }

  function uploadCertificate(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const newCertificate = {
      id: Date.now(),
      title: file.name,
      issuer: "Self Uploaded",
      category: "Uploaded",
      issued: new Date().toLocaleDateString("en-IN"),
      expiry: "Pending verification",
      credentialId: "TV-UP-" + Math.floor(Math.random() * 99999),
      status: "Pending",
    };

    setCertificates((old) => [newCertificate, ...old]);
    setPage("credentials");
  }

  function downloadCertificate() {
    if (!selected) return;

    const content = `
TRUSTVAULT DIGITAL CREDENTIAL

Credential
${selected.title}

Issuer
${selected.issuer}

Credential ID
${selected.credentialId}

Category
${selected.category}

Issued
${selected.issued}

Expiry
${selected.expiry}

Status
${selected.status}

DEMO CREDENTIAL
For demonstration purposes only.
`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "TrustVault-Credential.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  /* AI */

  function sendAI() {
    if (!message.trim()) return;

    const question = message.toLowerCase();

    let answer =
      "I can help you with credentials, identity, security, sharing and TrustVault settings.";

    if (
      question.includes("certificate") ||
      question.includes("credential")
    ) {
      answer = `You currently have ${certificates.length} credentials in your TrustVault wallet.`;
    }

    if (question.includes("security")) {
      answer =
        "Your demo TrustVault security score is 98%. Face verification, Consent Shield and activity monitoring are active.";
    }

    if (question.includes("share")) {
      answer = sharing
        ? "Credential sharing is enabled, but external access still requires your consent."
        : "Credential sharing is currently stopped.";
    }

    if (question.includes("permission")) {
      answer = permission
        ? "Credential access permission is currently allowed."
        : "Credential access is currently locked.";
    }

    if (question.includes("face")) {
      answer = faceVerified
        ? "Your identity has been verified for this session."
        : "Face verification is performed immediately after login.";
    }

    if (question.includes("delete")) {
      answer =
        "Open a credential and use Delete Certificate. You control your own wallet.";
    }

    if (question.includes("upload")) {
      answer =
        "Use Upload Document to add a certificate. New uploads appear as Pending until verification.";
    }

    if (question.includes("expiry")) {
      answer =
        "TrustVault displays the expiry date of each credential so users can monitor renewals.";
    }

    setMessages((old) => [
      ...old,
      {
        type: "user",
        text: message,
      },
      {
        type: "ai",
        text: answer,
      },
    ]);

    setMessage("");
  }

  /* FILTER */

  const filteredCertificates = certificates.filter((cert) => {
    const text =
      cert.title.toLowerCase() +
      cert.issuer.toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (filter === "All" || cert.category === filter)
    );
  });

  /* LOGIN */

  if (page === "login") {
    return (
      <>
        <style>{styles}</style>

        <div className="loginPage">
          <div className="orb orb1" />
          <div className="orb orb2" />

          <div className="loginBox">
            <div className="brand">
              🔐 Trust<span>Vault</span>
            </div>

            <div className="eyebrow">
              DIGITAL IDENTITY PLATFORM
            </div>

            <h1>
              Your identity.
              <br />
              Under your control.
            </h1>

            <p>
              Securely store, verify and share your digital
              credentials with consent.
            </p>

            <input
              className="input"
              placeholder="Email or mobile number"
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
            />

            <button className="primary full" onClick={login}>
              Continue securely →
            </button>

            <div className="loginFooter">
              🔒 Encrypted wallet &nbsp; • &nbsp; 🛡 Consent protected
            </div>

            <small className="demoText">
              Demo environment for project presentation
            </small>
          </div>
        </div>
      </>
    );
  }

  /* FACE */

  if (page === "face") {
    return (
      <>
        <style>{styles}</style>

        <div className="facePage">
          <div className="faceBox">
            <div className="brand">
              🔐 Trust<span>Vault</span>
            </div>

            <div className="eyebrow">
              STEP 01 • IDENTITY VERIFICATION
            </div>

            <h1>Verify your identity</h1>

            <p>
              Your wallet is protected by an identity verification
              step before access.
            </p>

            <div className="camera">
              {cameraReady ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <div className="cameraOff">
                  <div>◉</div>
                  <span>Camera unavailable</span>
                </div>
              )}

              <div className="faceCircle">
                <div className="scanLine" />
              </div>

              <div className="cameraStatus">
                {cameraMessage}
              </div>
            </div>

            {!cameraReady && (
              <button
                className="primary full"
                onClick={startCamera}
              >
                Enable camera
              </button>
            )}

            {cameraReady && (
              <button
                className="primary full"
                onClick={verifyFace}
              >
                Verify identity
              </button>
            )}

            <small className="demoText">
              Demo camera verification. Actual biometric identity
              matching requires a secure biometric service.
            </small>
          </div>
        </div>
      </>
    );
  }

  /* MAIN APPLICATION */

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        {/* SIDEBAR */}

        <aside className="sidebar">
          <div className="sideBrand">
            🔐
            <div>
              <strong>
                Trust<span>Vault</span>
              </strong>
              <small>Identity Wallet</small>
            </div>
          </div>

          <div className="sideLabel">
            OVERVIEW
          </div>

          <Nav
            active={page}
            target="dashboard"
            icon="⌂"
            text="Dashboard"
            setPage={setPage}
          />

          <Nav
            active={page}
            target="credentials"
            icon="▣"
            text="Credentials"
            setPage={setPage}
          />

          <Nav
            active={page}
            target="activity"
            icon="◷"
            text="Activity"
            setPage={setPage}
          />

          <div className="sideLabel">
            TOOLS
          </div>

          <Nav
            active={page}
            target="upload"
            icon="↑"
            text="Upload Document"
            setPage={setPage}
          />

          <Nav
            active={page}
            target="security"
            icon="🛡"
            text="Security Centre"
            setPage={setPage}
          />

          <div className="sideLabel">
            ACCOUNT
          </div>

          <Nav
            active={page}
            target="identity"
            icon="●"
            text="My Identity"
            setPage={setPage}
          />

          <Nav
            active={page}
            target="settings"
            icon="⚙"
            text="Settings"
            setPage={setPage}
          />

          <div className="sideBottom">
            <div className="protected">
              <i />
              Wallet protected
            </div>

            <button
              className="logout"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* CONTENT */}

        <main className="content">
          <header className="topbar">
            <div>
              <small>TRUSTVAULT IDENTITY NETWORK</small>
              <h2>Secure identity wallet</h2>
            </div>

            <div className="topRight">
              <button
                className="notification"
                onClick={() => {
                  setNotifications(0);
                  setPage("activity");
                }}
              >
                🔔
                {notifications > 0 && (
                  <b>{notifications}</b>
                )}
              </button>

              <button
                className="profileMini"
                onClick={() => setPage("identity")}
              >
                <span>V</span>
                <div>
                  <strong>Vinay</strong>
                  <small>Verified user</small>
                </div>
              </button>
            </div>
          </header>

          {/* DASHBOARD */}

          {page === "dashboard" && (
            <Dashboard
              certificates={certificates}
              permission={permission}
              sharing={sharing}
              setPage={setPage}
            />
          )}

          {/* CREDENTIALS */}

          {page === "credentials" && (
            <section className="pageContent">
              <div className="heading">
                <div className="eyebrow">
                  DIGITAL CREDENTIALS
                </div>
                <h1>Your credentials</h1>
                <p>
                  Manage your verified certificates and
                  professional records.
                </p>
              </div>

              <div className="toolbar">
                <input
                  className="search"
                  placeholder="Search certificates..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                <div className="filters">
                  {[
                    "All",
                    "Education",
                    "Skills",
                    "Professional",
                    "Internship",
                    "Uploaded",
                  ].map((x) => (
                    <button
                      key={x}
                      className={
                        filter === x
                          ? "filter activeFilter"
                          : "filter"
                      }
                      onClick={() => setFilter(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div className="certificateGrid">
                {filteredCertificates.map((cert) => (
                  <button
                    className="certificateCard"
                    key={cert.id}
                    onClick={() => openCertificate(cert)}
                  >
                    <div className="certificateIcon">
                      ▣
                    </div>

                    <div className="certInfo">
                      <div className="certTop">
                        <span>{cert.category}</span>
                        <b>✓ {cert.status}</b>
                      </div>

                      <h3>{cert.title}</h3>

                      <p>{cert.issuer}</p>

                      <small>
                        {cert.credentialId}
                      </small>
                    </div>

                    <strong className="arrow">
                      →
                    </strong>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATE DETAIL */}

          {page === "certificate" && selected && (
            <section className="pageContent">
              <button
                className="back"
                onClick={() => setPage("credentials")}
              >
                ← Back to credentials
              </button>

              <div className="detailCard">
                <div className="detailHeader">
                  <div className="certificateIcon large">
                    ▣
                  </div>

                  <div>
                    <span className="verified">
                      ✓ VERIFIED
                    </span>

                    <h1>{selected.title}</h1>
                    <p>{selected.issuer}</p>
                  </div>

                  <span className="demoBadge">
                    DEMO CREDENTIAL
                  </span>
                </div>

                <div className="detailGrid">
                  <Info
                    title="Credential ID"
                    value={selected.credentialId}
                  />

                  <Info
                    title="Category"
                    value={selected.category}
                  />

                  <Info
                    title="Issue date"
                    value={selected.issued}
                  />

                  <Info
                    title="Expiry"
                    value={selected.expiry}
                  />

                  <Info
                    title="Issuer"
                    value={selected.issuer}
                  />

                  <Info
                    title="Verification"
                    value="Digitally verified"
                  />
                </div>

                {/* CONSENT SHIELD */}

                <div className="consentBox">
                  <div className="shieldIcon">
                    🛡
                  </div>

                  <div>
                    <div className="eyebrow">
                      CONSENT SHIELD
                    </div>

                    <h2>
                      You control access
                    </h2>

                    <p>
                      No external organization should receive
                      this credential without your permission.
                    </p>
                  </div>

                  <div className="accessStatus">
                    <small>ACCESS</small>
                    <strong>
                      {permission
                        ? "ALLOWED"
                        : "LOCKED"}
                    </strong>
                  </div>
                </div>

                <div className="buttonRow">
                  {!permission ? (
                    <button
                      className="primary"
                      onClick={() =>
                        setPermission(true)
                      }
                    >
                      Allow access
                    </button>
                  ) : (
                    <button
                      className="danger"
                      onClick={() =>
                        setPermission(false)
                      }
                    >
                      Revoke access
                    </button>
                  )}

                  <button
                    className="secondary"
                    onClick={() =>
                      setSharing(!sharing)
                    }
                  >
                    {sharing
                      ? "Stop sharing"
                      : "Enable sharing"}
                  </button>

                  <button
                    className="secondary"
                    onClick={downloadCertificate}
                  >
                    ↓ Download
                  </button>
                </div>

                {/* ACCESS REQUEST */}

                <div className="requestBox">
                  <div>
                    <div className="eyebrow">
                      EXTERNAL ACCESS REQUEST
                    </div>

                    <h3>
                      ABC Technologies
                    </h3>

                    <p>
                      Requested access to verify this
                      qualification.
                    </p>
                  </div>

                  <button
                    className="primary"
                    onClick={() =>
                      setAccessRequest(true)
                    }
                  >
                    Review request
                  </button>
                </div>

                {accessRequest && (
                  <div className="requestPanel">
                    <h2>
                      Credential Access Request
                    </h2>

                    <p>
                      ABC Technologies is requesting
                      temporary access.
                    </p>

                    <div className="requestedData">
                      <span>✓ Credential title</span>
                      <span>✓ Issuer</span>
                      <span>✓ Issue date</span>
                      <span>✓ Verification status</span>
                    </div>

                    <select className="duration">
                      <option>
                        Access for 24 hours
                      </option>
                      <option>
                        Access for 7 days
                      </option>
                      <option>
                        Access for 30 days
                      </option>
                    </select>

                    <div className="buttonRow">
                      <button
                        className="primary"
                        onClick={() =>
                          setAccessRequest(false)
                        }
                      >
                        Allow
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          setAccessRequest(false)
                        }
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )}

                <div className="deleteZone">
                  <div>
                    <strong>
                      Delete certificate
                    </strong>

                    <p>
                      Remove this credential from your
                      TrustVault wallet.
                    </p>
                  </div>

                  <button
                    className="dangerOutline"
                    onClick={() =>
                      deleteCertificate(selected.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* UPLOAD */}

          {page === "upload" && (
            <section className="pageContent">
              <div className="heading">
                <div className="eyebrow">
                  DOCUMENT WALLET
                </div>

                <h1>Upload credential</h1>

                <p>
                  Add your own certificate or document to
                  your TrustVault wallet.
                </p>
              </div>

              <label className="uploadBox">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={uploadCertificate}
                />

                <div className="uploadIcon">
                  ↑
                </div>

                <h2>
                  Drop your certificate here
                </h2>

                <p>
                  or click to browse your device
                </p>

                <small>
                  PDF • JPG • PNG • DOC • DOCX
                </small>
              </label>

              <div className="steps">
                <Step
                  number="01"
                  title="Upload"
                  text="Select your document."
                />

                <Step
                  number="02"
                  title="Review"
                  text="Check certificate information."
                />

                <Step
                  number="03"
                  title="Verify"
                  text="Confirm issuer authenticity."
                />
              </div>
            </section>
          )}

          {/* SECURITY */}

          {page === "security" && (
            <section className="pageContent">
              <div className="heading">
                <div className="eyebrow">
                  SECURITY CENTRE
                </div>

                <h1>
                  Protection centre
                </h1>

                <p>
                  Monitor the security controls protecting
                  your digital identity.
                </p>
              </div>

              <div className="securityHero">
                <div className="score">
                  <strong>98</strong>
                  <span>/100</span>
                </div>

                <div>
                  <span className="verified">
                    EXCELLENT
                  </span>

                  <h2>
                    Your wallet is protected.
                  </h2>

                  <p>
                    Identity verification, Consent Shield
                    and activity monitoring are active.
                  </p>
                </div>
              </div>

              <div className="securityGrid">
                <Security
                  icon="✓"
                  title="Identity verification"
                  text="Verified for current session."
                />

                <Security
                  icon="🛡"
                  title="Consent Shield"
                  text="External access requires approval."
                />

                <Security
                  icon="🔐"
                  title="Wallet protection"
                  text="Secure wallet controls active."
                />

                <Security
                  icon="◷"
                  title="Activity monitoring"
                  text="Credential events are recorded."
                />
              </div>

              <div className="alertBox">
                <strong>
                  Security recommendation
                </strong>

                <p>
                  Review active credential sharing
                  permissions regularly.
                </p>
              </div>
            </section>
          )}

          {/* ACTIVITY */}

          {page === "activity" && (
            <section className="pageContent">
              <div className="heading">
                <div className="eyebrow">
                  AUDIT TRAIL
                </div>

                <h1>
                  Activity history
                </h1>

                <p>
                  Recent identity and credential events.
                </p>
              </div>

              <div className="activityList">
                <Activity
                  time="Today • 14:42"
                  title="Face verification completed"
                  type="Security"
                />

                <Activity
                  time="Today • 14:38"
                  title="Credential wallet opened"
                  type="Login"
                />

                <Activity
                  time="Yesterday • 18:20"
                  title="Python certificate viewed"
                  type="Credential"
                />

                <Activity
                  time="18 Sep • 12:05"
                  title="Sharing permission revoked"
                  type="Privacy"
                />

                <Activity
                  time="16 Sep • 09:31"
                  title="New credential added"
                  type="Upload"
                />
              </div>
            </section>
          )}

          {/* IDENTITY */}

          {page === "identity" && (
            <section className="pageContent">
              <div className="heading">
                <div className="eyebrow">
                  DIGITAL IDENTITY
                </div>

                <h1>
                  My identity
                </h1>

                <p>
                  Your verified TrustVault identity profile.
                </p>
              </div>

              <div className="identityCard">
                <div className="avatar">
                  V
                </div>

                <div>
                  <span className="verified">
                    ✓ VERIFIED IDENTITY
                  </span>

                  <h1>Vinay</h1>

                  <p>
                    Digital Identity ID:
                    TV-ID-92841
                  </p>
                </div>
              </div>

              <div className="identityInfo">
                <Info
                  title="Identity status"
                  value="Verified"
                />

                <Info
                  title="Verification"
                  value="21 Sep 2026"
                />

                <Info
                  title="Credentials"
                  value={`${certificates.length} records`}
                />

                <Info
                  title="Wallet status"
                  value="Protected"
                />
              </div>
            </section>
          )}

          {/* SETTINGS */}

          {page === "settings" && (
            <section className="pageContent">
              <div className="heading">
                <div className="eyebrow">
                  PRIVACY CONTROLS
                </div>

                <h1>
                  Settings
                </h1>

                <p>
                  Manage your identity and credential
                  protection.
                </p>
              </div>

              <div className="settingsList">
                <Setting
                  title="Credential sharing"
                  text="Allow credentials to be shared after consent."
                  control={
                    <button
                      className={
                        sharing
                          ? "toggle activeToggle"
                          : "toggle"
                      }
                      onClick={() =>
                        setSharing(!sharing)
                      }
                    >
                      <i />
                    </button>
                  }
                />

                <Setting
                  title="Consent Shield"
                  text="Ask permission before external credential access."
                  control={
                    <span className="on">
                      ON
                    </span>
                  }
                />

                <Setting
                  title="Face verification"
                  text="Verify identity when opening your wallet."
                  control={
                    <span className="on">
                      ACTIVE
                    </span>
                  }
                />

                <Setting
                  title="Security monitoring"
                  text="Monitor credential and identity activity."
                  control={
                    <span className="on">
                      ACTIVE
                    </span>
                  }
                />
              </div>
            </section>
          )}
        </main>

        {/* AI BUTTON */}

        <button
          className="aiButton"
          onClick={() => setAiOpen(!aiOpen)}
        >
          ✦
        </button>

        {/* AI PANEL */}

        {aiOpen && (
          <div className="aiPanel">
            <div className="aiHeader">
              <div>
                <strong>
                  TrustVault AI
                </strong>

                <small>
                  Identity assistant
                </small>
              </div>

              <button
                onClick={() => setAiOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.type === "user"
                      ? "msg userMsg"
                      : "msg aiMsg"
                  }
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="aiInput">
              <input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendAI();
                  }
                }}
                placeholder="Ask TrustVault AI..."
              />

              <button onClick={sendAI}>
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* COMPONENTS */

function Nav({
  active,
  target,
  icon,
  text,
  setPage,
}) {
  return (
    <button
      className={
        active === target
          ? "nav activeNav"
          : "nav"
      }
      onClick={() => setPage(target)}
    >
      <span>{icon}</span>
      {text}
    </button>
  );
}

function Dashboard({
  certificates,
  permission,
  sharing,
  setPage,
}) {
  return (
    <section className="pageContent">
      <div className="hero">
        <div>
          <div className="eyebrow">
            WELCOME BACK
          </div>

          <h1>
            Your digital identity,
            <br />
            secured.
          </h1>

          <p>
            Everything important about your identity,
            controlled from one place.
          </p>

          <div className="buttonRow">
            <button
              className="primary"
              onClick={() =>
                setPage("credentials")
              }
            >
              View credentials
            </button>

            <button
              className="secondary"
              onClick={() =>
                setPage("security")
              }
            >
              Security Centre
            </button>
          </div>
        </div>

        <div className="securityCircle">
          <strong>98%</strong>
          <span>SECURITY</span>
          <small>Excellent</small>
        </div>
      </div>

      <div className="stats">
        <Stat
          icon="▣"
          title="Credentials"
          value={certificates.length}
        />

        <Stat
          icon="✓"
          title="Verified"
          value="6"
        />

        <Stat
          icon="◉"
          title="Access"
          value={permission ? "Allowed" : "Locked"}
        />

        <Stat
          icon="↗"
          title="Sharing"
          value={sharing ? "Active" : "Stopped"}
        />
      </div>

      <div className="dashboardGrid">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <div className="eyebrow">
                YOUR WALLET
              </div>

              <h2>
                Recent credentials
              </h2>
            </div>

            <button
              className="link"
              onClick={() =>
                setPage("credentials")
              }
            >
              View all →
            </button>
          </div>

          {certificates
            .slice(0, 4)
            .map((cert) => (
              <div
                className="miniCert"
                key={cert.id}
              >
                <div>
                  ▣
                </div>

                <section>
                  <strong>
                    {cert.title}
                  </strong>

                  <span>
                    {cert.issuer}
                  </span>
                </section>

                <b>✓</b>
              </div>
            ))}
        </div>

        <div className="panel">
          <div className="eyebrow">
            PRIVACY
          </div>

          <h2>
            Consent Shield
          </h2>

          <div className="shield">
            🛡
          </div>

          <p>
            External access requires your permission
            before a credential can be shared.
          </p>

          <button
            className="secondary full"
            onClick={() =>
              setPage("settings")
            }
          >
            Manage protection
          </button>
        </div>
      </div>

      <div className="quickGrid">
        <Quick
          icon="↑"
          title="Upload credential"
          text="Add certificate"
          click={() => setPage("upload")}
        />

        <Quick
          icon="●"
          title="My identity"
          text="View identity"
          click={() => setPage("identity")}
        />

        <Quick
          icon="◷"
          title="Activity"
          text="View history"
          click={() => setPage("activity")}
        />

        <Quick
          icon="⚙"
          title="Privacy"
          text="Manage sharing"
          click={() => setPage("settings")}
        />
      </div>
    </section>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div className="stat">
      <div>{icon}</div>

      <section>
        <small>{title}</small>
        <strong>{value}</strong>
      </section>
    </div>
  );
}

function Quick({
  icon,
  title,
  text,
  click,
}) {
  return (
    <button
      className="quick"
      onClick={click}
    >
      <div>{icon}</div>

      <section>
        <strong>{title}</strong>
        <span>{text}</span>
      </section>

      <b>→</b>
    </button>
  );
}

function Info({ title, value }) {
  return (
    <div className="info">
      <small>{title}</small>
      <strong>{value}</strong>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}) {
  return (
    <div className="step">
      <span>{number}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function Security({
  icon,
  title,
  text,
}) {
  return (
    <div className="securityItem">
      <div>{icon}</div>

      <section>
        <small>ACTIVE</small>
        <h3>{title}</h3>
        <p>{text}</p>
      </section>

      <b>✓</b>
    </div>
  );
}

function Activity({
  time,
  title,
  type,
}) {
  return (
    <div className="activity">
      <div className="activityDot" />

      <section>
        <strong>{title}</strong>
        <span>{time}</span>
      </section>

      <b>{type}</b>
    </div>
  );
}

function Setting({
  title,
  text,
  control,
}) {
  return (
    <div className="setting">
      <section>
        <strong>{title}</strong>
        <p>{text}</p>
      </section>

      {control}
    </div>
  );
}

/* COMPLETE DESIGN */

const styles = `
*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Inter,Arial,sans-serif;
  background:#07101d;
  color:#eaf2ff;
}

button,
input,
select{
  font:inherit;
}

button{
  cursor:pointer;
}

.loginPage,
.facePage{
  min-height:100vh;
  background:
    radial-gradient(circle at 20% 20%,rgba(20,126,255,.20),transparent 35%),
    radial-gradient(circle at 80% 80%,rgba(0,220,180,.12),transparent 35%),
    #050b14;
  display:flex;
  justify-content:center;
  align-items:center;
  position:relative;
  overflow:hidden;
}

.orb{
  position:absolute;
  border-radius:50%;
  filter:blur(70px);
}

.orb1{
  width:260px;
  height:260px;
  background:#096cff;
  opacity:.12;
  left:-80px;
  top:-50px;
}

.orb2{
  width:300px;
  height:300px;
  background:#00d5ae;
  opacity:.08;
  right:-100px;
  bottom:-80px;
}

.loginBox,
.faceBox{
  width:460px;
  max-width:92%;
  padding:44px;
  background:rgba(10,21,36,.88);
  border:1px solid rgba(255,255,255,.09);
  border-radius:28px;
  box-shadow:0 30px 100px rgba(0,0,0,.45);
  backdrop-filter:blur(25px);
  z-index:2;
}

.brand{
  font-size:24px;
  font-weight:800;
  margin-bottom:42px;
}

.brand span,
.sideBrand span{
  color:#42a5ff;
}

.eyebrow{
  color:#58aaff;
  font-size:11px;
  font-weight:800;
  letter-spacing:1.8px;
}

.loginBox h1,
.faceBox h1{
  font-size:42px;
  line-height:1.08;
  margin:15px 0;
}

.loginBox p,
.faceBox>p{
  color:#91a5bc;
  line-height:1.7;
}

.input{
  width:100%;
  padding:15px 17px;
  margin-top:12px;
  border-radius:12px;
  border:1px solid #23364e;
  background:#0b1727;
  color:white;
  outline:none;
}

.input:focus,
.search:focus{
  border-color:#318cff;
}

.primary,
.secondary,
.danger{
  border:none;
  border-radius:11px;
  padding:13px 19px;
  font-weight:750;
}

.primary{
  color:white;
  background:linear-gradient(135deg,#167cff,#2859ff);
  box-shadow:0 8px 25px rgba(26,108,255,.2);
}

.secondary{
  color:#dceaff;
  background:#101e30;
  border:1px solid #253b54;
}

.danger{
  color:#fff;
  background:#c43b4c;
}

.full{
  width:100%;
}

.loginBox .primary{
  margin-top:15px;
}

.loginFooter,
.demoText{
  display:block;
  text-align:center;
  color:#72879f;
  font-size:11px;
  margin-top:18px;
}

.faceBox{
  text-align:center;
}

.faceBox .brand{
  text-align:left;
}

.faceCamera{
  margin:25px auto;
}

.camera{
  height:360px;
  margin:25px 0;
  border-radius:22px;
  overflow:hidden;
  position:relative;
  background:#02060c;
  border:1px solid #263d56;
}

.camera video{
  width:100%;
  height:100%;
  object-fit:cover;
  transform:scaleX(-1);
}

.cameraOff{
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  color:#70859b;
}

.cameraOff div{
  font-size:50px;
  margin-bottom:12px;
}

.faceCircle{
  width:210px;
  height:260px;
  border:2px solid #45a8ff;
  border-radius:50%;
  position:absolute;
  left:50%;
  top:42%;
  transform:translate(-50%,-50%);
  box-shadow:0 0 35px rgba(45,150,255,.3);
}

.scanLine{
  position:absolute;
  width:100%;
  height:2px;
  background:#48c6ff;
  box-shadow:0 0 15px #48c6ff;
  top:50%;
  animation:scan 2s infinite;
}

@keyframes scan{
  0%{top:15%}
  50%{top:85%}
  100%{top:15%}
}

.cameraStatus{
  position:absolute;
  bottom:15px;
  left:15px;
  right:15px;
  padding:10px;
  border-radius:8px;
  background:rgba(0,0,0,.6);
  color:#cbe3ff;
  font-size:12px;
}

.app{
  min-height:100vh;
  display:flex;
  background:#07101d;
}

.sidebar{
  width:245px;
  min-height:100vh;
  position:fixed;
  left:0;
  top:0;
  bottom:0;
  padding:25px 15px;
  background:#091523;
  border-right:1px solid #182b41;
  display:flex;
  flex-direction:column;
  z-index:10;
}

.sideBrand{
  display:flex;
  align-items:center;
  gap:12px;
  padding:5px 10px 35px;
}

.sideBrand>span{
  font-size:27px;
}

.sideBrand strong{
  display:block;
  font-size:18px;
}

.sideBrand small{
  color:#71869c;
  font-size:10px;
}

.sideLabel{
  color:#566d84;
  font-size:9px;
  letter-spacing:1.5px;
  margin:17px 10px 7px;
}

.nav{
  width:100%;
  border:0;
  background:transparent;
  color:#8195aa;
  text-align:left;
  padding:12px 13px;
  border-radius:9px;
  display:flex;
  align-items:center;
  gap:12px;
  margin:2px 0;
}

.nav span{
  width:20px;
  text-align:center;
}

.nav:hover{
  color:#fff;
  background:#102238;
}

.activeNav{
  color:#fff;
  background:linear-gradient(90deg,#103258,#10243b);
  box-shadow:inset 3px 0 #3b9bff;
}

.sideBottom{
  margin-top:auto;
}

.protected{
  padding:12px;
  background:#0d1d2c;
  border-radius:10px;
  color:#7891a8;
  font-size:11px;
  margin-bottom:10px;
}

.protected i{
  width:7px;
  height:7px;
  display:inline-block;
  border-radius:50%;
  background:#25d69a;
  margin-right:7px;
}

.logout{
  width:100%;
  border:1px solid #24374d;
  background:transparent;
  color:#8297ac;
  border-radius:9px;
  padding:10px;
}

.content{
  width:calc(100% - 245px);
  margin-left:245px;
}

.topbar{
  height:86px;
  border-bottom:1px solid #172a40;
  padding:0 35px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  background:#08131f;
}

.topbar small{
  color:#55718c;
  font-size:9px;
  letter-spacing:1.5px;
}

.topbar h2{
  margin:4px 0 0;
  font-size:17px;
}

.topRight{
  display:flex;
  gap:14px;
  align-items:center;
}

.notification{
  position:relative;
  border:1px solid #263c54;
  background:#0d1c2d;
  color:white;
  border-radius:10px;
  width:42px;
  height:42px;
}

.notification b{
  position:absolute;
  top:-5px;
  right:-5px;
  background:#ff5268;
  border-radius:20px;
  font-size:9px;
  padding:3px 5px;
}

.profileMini{
  display:flex;
  align-items:center;
  gap:9px;
  border:0;
  background:transparent;
  color:white;
}

.profileMini>span{
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:#164b79;
}

.profileMini strong,
.profileMini small{
  display:block;
  text-align:left;
}

.profileMini small{
  color:#637b94;
  font-size:9px;
}

.pageContent{
  padding:35px;
  max-width:1400px;
}

.heading{
  margin-bottom:28px;
}

.heading h1{
  font-size:34px;
  margin:8px 0;
}

.heading p{
  color:#7890a7;
  margin:0;
}

.hero{
  min-height:310px;
  padding:45px;
  border:1px solid #19334e;
  border-radius:25px;
  background:
    radial-gradient(circle at 90% 50%,rgba(25,113,210,.2),transparent 35%),
    linear-gradient(135deg,#0b1d31,#091625);
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.hero h1{
  font-size:43px;
  line-height:1.08;
  margin:12px 0;
}

.hero p{
  color:#8399ae;
  max-width:560px;
  line-height:1.6;
}

.buttonRow{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-top:22px;
}

.securityCircle{
  width:190px;
  height:190px;
  border-radius:50%;
  border:9px solid #2285ff;
  outline:10px solid rgba(34,133,255,.08);
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
}

.securityCircle strong{
  font-size:40px;
}

.securityCircle span,
.securityCircle small{
  color:#7190ae;
  font-size:10px;
}

.stats{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:15px;
  margin:18px 0;
}

.stat{
  padding:20px;
  border:1px solid #192e45;
  background:#0b1929;
  border-radius:15px;
  display:flex;
  gap:15px;
  align-items:center;
}

.stat>div{
  width:42px;
  height:42px;
  display:grid;
  place-items:center;
  background:#102b48;
  color:#52aaff;
  border-radius:10px;
}

.stat small,
.stat strong{
  display:block;
}

.stat small{
  color:#688198;
  font-size:10px;
}

.stat strong{
  margin-top:4px;
  font-size:18px;
}

.dashboardGrid{
  display:grid;
  grid-template-columns:1.5fr 1fr;
  gap:18px;
}

.panel{
  background:#0b1929;
  border:1px solid #192f47;
  border-radius:17px;
  padding:23px;
}

.panelHeader{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.panel h2{
  font-size:18px;
  margin:7px 0 18px;
}

.link{
  border:0;
  background:transparent;
  color:#53aaff;
}

.miniCert{
  display:flex;
  align-items:center;
  gap:13px;
  padding:13px 0;
  border-top:1px solid #182b40;
}

.miniCert>div{
  width:39px;
  height:39px;
  border-radius:9px;
  display:grid;
  place-items:center;
  color:#50aaff;
  background:#102a44;
}

.miniCert section{
  flex:1;
}

.miniCert strong,
.miniCert span{
  display:block;
}

.miniCert strong{
  font-size:12px;
}

.miniCert span{
  color:#687f96;
  font-size:10px;
  margin-top:4px;
}

.miniCert>b{
  color:#26d69a;
}

.shield{
  font-size:55px;
  text-align:center;
  margin:15px 0;
}

.panel>p{
  color:#71879d;
  font-size:12px;
  line-height:1.7;
}

.quickGrid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:13px;
  margin-top:18px;
}

.quick{
  text-align:left;
  border:1px solid #192f47;
  background:#0b1929;
  color:white;
  border-radius:14px;
  padding:17px;
  display:flex;
  align-items:center;
  gap:12px;
}

.quick>div{
  color:#4ca8ff;
  font-size:20px;
}

.quick section{
  flex:1;
}

.quick strong,
.quick span{
  display:block;
}

.quick strong{
  font-size:12px;
}

.quick span{
  color:#6e849a;
  font-size:9px;
  margin-top:4px;
}

.quick>b{
  color:#4b6b87;
}

.toolbar{
  display:flex;
  gap:14px;
  flex-wrap:wrap;
  margin-bottom:20px;
}

.search{
  flex:1;
  min-width:230px;
  background:#0b1929;
  border:1px solid #20364e;
  border-radius:10px;
  color:white;
  padding:13px 15px;
  outline:none;
}

.filters{
  display:flex;
  gap:6px;
  flex-wrap:wrap;
}

.filter{
  border:1px solid #233a52;
  background:#0b1929;
  color:#7890a8;
  padding:9px 12px;
  border-radius:8px;
}

.activeFilter{
  background:#124d83;
  color:white;
  border-color:#247fc7;
}

.certificateGrid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:14px;
}

.certificateCard{
  text-align:left;
  border:1px solid #1a324a;
  background:#0b1929;
  color:white;
  border-radius:17px;
  padding:20px;
  display:flex;
  gap:15px;
  align-items:center;
  transition:.2s;
}

.certificateCard:hover{
  transform:translateY(-2px);
  border-color:#2d72a8;
}

.certificateIcon{
  flex:none;
  width:52px;
  height:52px;
  display:grid;
  place-items:center;
  border-radius:13px;
  background:linear-gradient(135deg,#12385d,#0f243d);
  color:#53adff;
  font-size:22px;
}

.certificateIcon.large{
  width:72px;
  height:72px;
  font-size:30px;
}

.certInfo{
  flex:1;
}

.certTop{
  display:flex;
  justify-content:space-between;
  font-size:9px;
}

.certTop span{
  color:#60809d;
}

.certTop b{
  color:#29d29a;
}

.certInfo h3{
  font-size:14px;
  margin:8px 0;
}

.certInfo p{
  color:#8096aa;
  font-size:11px;
  margin:0 0 8px;
}

.certInfo small{
  color:#506b84;
  font-size:9px;
}

.arrow{
  color:#4c91c9;
}

.back{
  border:0;
  background:transparent;
  color:#64adf0;
  margin-bottom:20px;
}

.detailCard{
  background:#0b1929;
  border:1px solid #1b344c;
  border-radius:20px;
  padding:30px;
}

.detailHeader{
  display:flex;
  gap:20px;
  align-items:center;
}

.detailHeader h1{
  font-size:27px;
  margin:8px 0;
}

.detailHeader p{
  color:#8096ab;
}

.verified{
  display:inline-block;
  color:#27d69c;
  background:rgba(39,214,156,.09);
  border:1px solid rgba(39,214,156,.2);
  padding:5px 8px;
  border-radius:6px;
  font-size:9px;
  font-weight:bold;
}

.demoBadge{
  margin-left:auto;
  padding:8px 10px;
  border-radius:7px;
  color:#f4bd5d;
  background:#302614;
  font-size:9px;
  font-weight:bold;
}

.detailGrid,
.identityInfo{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1px;
  background:#1a2e43;
  margin:30px 0;
  border:1px solid #1a2e43;
}

.info{
  background:#0c1a2a;
  padding:18px;
}

.info small,
.info strong{
  display:block;
}

.info small{
  color:#5e7891;
  font-size:9px;
}

.info strong{
  margin-top:6px;
  font-size:12px;
}

.consentBox{
  display:flex;
  gap:18px;
  align-items:center;
  padding:20px;
  border:1px solid #21425e;
  background:#0c2032;
  border-radius:15px;
}

.shieldIcon{
  font-size:35px;
}

.consentBox h2{
  margin:5px 0;
}

.consentBox p{
  color:#718ba3;
  font-size:11px;
}

.accessStatus{
  margin-left:auto;
  text-align:right;
}

.accessStatus small,
.accessStatus strong{
  display:block;
}

.accessStatus small{
  color:#627c96;
  font-size:9px;
}

.accessStatus strong{
  color:#32d39d;
  margin-top:4px;
}

.requestBox,
.requestPanel,
.deleteZone{
  margin-top:20px;
  padding:20px;
  border:1px solid #1b334b;
  border-radius:14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:20px;
}

.requestBox h3{
  margin:6px 0;
}

.requestBox p,
.deleteZone p{
  color:#72899f;
  font-size:11px;
}

.requestPanel{
  display:block;
  background:#091725;
}

.requestedData{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  color:#8da4b8;
  font-size:11px;
  margin:15px 0;
}

.duration{
  background:#0d1d2d;
  color:white;
  border:1px solid #263e55;
  border-radius:8px;
  padding:11px;
  margin-bottom:10px;
}

.deleteZone{
  border-color:#442a32;
}

.deleteZone>div{
  flex:1;
}

.dangerOutline{
  color:#ff7182;
  border:1px solid #6b3540;
  background:transparent;
  padding:10px 14px;
  border-radius:8px;
}

.uploadBox{
  min-height:300px;
  border:1px dashed #2b5678;
  border-radius:20px;
  background:#0a1929;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
  cursor:pointer;
}

.uploadBox input{
  display:none;
}

.uploadIcon{
  width:65px;
  height:65px;
  display:grid;
  place-items:center;
  border-radius:15px;
  background:#123250;
  color:#4ea9ff;
  font-size:30px;
}

.uploadBox h2{
  margin:18px 0 7px;
}

.uploadBox p,
.uploadBox small{
  color:#6e8499;
}

.steps{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
  margin-top:20px;
}

.step{
  padding:20px;
  background:#0b1929;
  border:1px solid #1b3147;
  border-radius:13px;
}

.step span{
  color:#4ca8ff;
  font-size:10px;
}

.step strong{
  display:block;
  margin-top:10px;
}

.step p{
  color:#6f869c;
  font-size:11px;
}

.securityHero{
  display:flex;
  align-items:center;
  gap:30px;
  padding:30px;
  border:1px solid #1c405c;
  border-radius:20px;
  background:#0b1d2d;
}

.score{
  width:130px;
  height:130px;
  border-radius:50%;
  border:8px solid #2588ff;
  display:flex;
  align-items:center;
  justify-content:center;
}

.score strong{
  font-size:35px;
}

.score span{
  color:#678099;
  margin-left:2px;
}

.securityHero h2{
  margin:10px 0;
}

.securityHero p{
  color:#718aa2;
}

.securityGrid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
  margin-top:18px;
}

.securityItem{
  display:flex;
  gap:15px;
  align-items:center;
  padding:20px;
  background:#0b1929;
  border:1px solid #1b3147;
  border-radius:14px;
}

.securityItem>div{
  font-size:25px;
  color:#49a8ff;
}

.securityItem section{
  flex:1;
}

.securityItem small{
  color:#28d49b;
  font-size:8px;
}

.securityItem h3{
  margin:5px 0;
  font-size:13px;
}

.securityItem p{
  color:#6d849b;
  font-size:10px;
}

.securityItem>b{
  color:#28d49b;
}

.alertBox{
  margin-top:18px;
  padding:18px;
  background:#211c10;
  border:1px solid #4a3b1d;
  border-radius:13px;
}

.alertBox strong{
  color:#efbd55;
}

.alertBox p{
  color:#9d8a62;
  font-size:11px;
}

.activityList{
  background:#0b1929;
  border:1px solid #1b3147;
  border-radius:15px;
  overflow:hidden;
}

.activity{
  padding:20px;
  display:flex;
  align-items:center;
  gap:15px;
  border-bottom:1px solid #182d42;
}

.activity:last-child{
  border:0;
}

.activityDot{
  width:9px;
  height:9px;
  border-radius:50%;
  background:#35a5ff;
  box-shadow:0 0 12px #258cff;
}

.activity section{
  flex:1;
}

.activity strong,
.activity span{
  display:block;
}

.activity strong{
  font-size:12px;
}

.activity span{
  color:#647d95;
  font-size:9px;
  margin-top:5px;
}

.activity>b{
  color:#658099;
  font-size:9px;
}

.identityCard{
  display:flex;
  align-items:center;
  gap:22px;
  padding:30px;
  background:#0b1929;
  border:1px solid #1b344c;
  border-radius:18px;
}

.avatar{
  width:90px;
  height:90px;
  border-radius:50%;
  display:grid;
  place-items:center;
  font-size:30px;
  font-weight:bold;
  background:linear-gradient(135deg,#14568a,#153a62);
}

.identityCard h1{
  margin:10px 0 5px;
}

.identityCard p{
  color:#70889f;
}

.settingsList{
  background:#0b1929;
  border:1px solid #1b3147;
  border-radius:15px;
  overflow:hidden;
}

.setting{
  display:flex;
  align-items:center;
  gap:20px;
  padding:23px;
  border-bottom:1px solid #192d41;
}

.setting:last-child{
  border:0;
}

.setting section{
  flex:1;
}

.setting strong{
  font-size:13px;
}

.setting p{
  color:#6e859c;
  font-size:10px;
  margin:6px 0 0;
}

.toggle{
  width:48px;
  height:26px;
  border:0;
  border-radius:20px;
  background:#293b4d;
  padding:3px;
}

.toggle i{
  display:block;
  width:20px;
  height:20px;
  border-radius:50%;
  background:#8293a3;
  transition:.2s;
}

.activeToggle{
  background:#1768ad;
}

.activeToggle i{
  background:white;
  transform:translateX(22px);
}

.on{
  color:#29d49b;
  font-size:9px;
  font-weight:bold;
}

.aiButton{
  position:fixed;
  right:28px;
  bottom:28px;
  width:58px;
  height:58px;
  border:1px solid #409cff;
  border-radius:50%;
  color:white;
  background:linear-gradient(135deg,#176fff,#173fa9);
  font-size:24px;
  box-shadow:0 10px 35px rgba(20,105,255,.3);
  z-index:30;
}

.aiPanel{
  position:fixed;
  right:28px;
  bottom:98px;
  width:350px;
  height:470px;
  background:#091522;
  border:1px solid #23415e;
  border-radius:18px;
  overflow:hidden;
  z-index:29;
  box-shadow:0 20px 80px rgba(0,0,0,.5);
  display:flex;
  flex-direction:column;
}

.aiHeader{
  padding:16px;
  display:flex;
  justify-content:space-between;
  border-bottom:1px solid #1a3046;
}

.aiHeader strong,
.aiHeader small{
  display:block;
}

.aiHeader small{
  color:#668098;
  font-size:9px;
  margin-top:4px;
}

.aiHeader button{
  border:0;
  background:transparent;
  color:#8297ad;
  font-size:22px;
}

.messages{
  flex:1;
  padding:15px;
  overflow-y:auto;
}

.msg{
  max-width:85%;
  padding:10px 12px;
  border-radius:10px;
  margin-bottom:10px;
  font-size:11px;
  line-height:1.5;
}

.aiMsg{
  background:#102238;
  color:#bdd1e4;
}

.userMsg{
  margin-left:auto;
  background:#1768b8;
  color:white;
}

.aiInput{
  display:flex;
  gap:5px;
  padding:10px;
  border-top:1px solid #1a3046;
}

.aiInput input{
  flex:1;
  min-width:0;
  background:#0d1d2d;
  border:1px solid #243c54;
  color:white;
  padding:10px;
  border-radius:8px;
  outline:0;
}

.aiInput button{
  width:40px;
  border:0;
  border-radius:8px;
  background:#1678d0;
  color:white;
}

@media(max-width:1000px){
  .sidebar{
    width:190px;
  }

  .content{
    width:calc(100% - 190px);
    margin-left:190px;
  }

  .stats,
  .quickGrid{
    grid-template-columns:1fr 1fr;
  }

  .certificateGrid{
    grid-template-columns:1fr;
  }
}

@media(max-width:750px){
  .sidebar{
    position:relative;
    width:100%;
    min-height:auto;
  }

  .app{
    display:block;
  }

  .content{
    width:100%;
    margin:0;
  }

  .sidebar{
    display:none;
  }

  .topbar{
    padding:0 18px;
  }

  .topbar h2{
    font-size:14px;
  }

  .pageContent{
    padding:20px;
  }

  .hero{
    padding:25px;
    flex-direction:column;
    align-items:flex-start;
    gap:30px;
  }

  .hero h1{
    font-size:32px;
  }

  .stats,
  .dashboardGrid,
  .quickGrid,
  .securityGrid,
  .steps,
  .detailGrid,
  .identityInfo{
    grid-template-columns:1fr;
  }

  .securityCircle{
    align-self:center;
  }

  .detailHeader{
    align-items:flex-start;
    flex-wrap:wrap;
  }

  .demoBadge{
    margin-left:0;
  }

  .consentBox{
    align-items:flex-start;
    flex-wrap:wrap;
  }

  .accessStatus{
    margin-left:0;
  }

  .aiPanel{
    left:15px;
    right:15px;
    width:auto;
  }
}
`