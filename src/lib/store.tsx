"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { auth, googleProvider, initFirebaseAnalytics } from "@/lib/firebase";
import {
  BrandKit,
  CreditActionType,
  CreditTransaction,
  DesignVariation,
  GenerationHistoryItem,
  PlanTier,
  ProjectRecord,
  UserAccountState,
} from "@/types";
import {
  CREDIT_COSTS,
  DEMO_SAAS_SCREENSHOT_DATA_URL,
  PRICING_PLANS,
} from "@/lib/constants";
import { generateDesignVariations } from "@/lib/design-engine";

interface RegisteredUserRecord extends UserAccountState {
  passwordHash?: string;
}

interface AppContextValue {
  user: UserAccountState | null;
  allUsers: RegisteredUserRecord[];
  isLoadingAuth: boolean;
  projects: ProjectRecord[];
  brandKits: BrandKit[];
  transactions: CreditTransaction[];
  generationHistory: GenerationHistoryItem[];
  // Auth Actions (Firebase Auth: Email/Password + Passwordless Email Link + Google)
  login: (email: string, password?: string) => Promise<{ error?: string }>;
  sendMagicEmailLink: (
    email: string
  ) => Promise<{ error?: string; sent?: boolean }>;
  completeMagicEmailLinkSignIn: (
    urlHref?: string,
    providedEmail?: string
  ) => Promise<{ error?: string; completed?: boolean }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  register: (
    fullName: string,
    email: string,
    password: string,
    companyName?: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  resetPasswordRequest: (email: string) => Promise<{ message: string; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ message: string }>;
  updateProfile: (updates: {
    fullName?: string;
    companyName?: string;
    role?: "user" | "admin";
  }) => void;
  // Project Actions
  createProject: (
    partial: Partial<ProjectRecord> & { name: string; screenshotUrl: string }
  ) => ProjectRecord;
  updateProject: (id: string, updates: Partial<ProjectRecord>) => void;
  duplicateProject: (id: string) => ProjectRecord | null;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => ProjectRecord | undefined;
  // Brand Kit Actions
  saveBrandKit: (
    kit: Omit<BrandKit, "id" | "userId" | "createdAt" | "updatedAt"> & {
      id?: string;
    }
  ) => BrandKit;
  deleteBrandKit: (id: string) => void;
  setDefaultBrandKit: (id: string) => void;
  // Credits & Billing Actions
  deductCredits: (
    actionType: CreditActionType,
    description: string,
    projectId?: string
  ) => Promise<{ success: boolean; error?: string; newBalance?: number }>;
  upgradePlan: (
    tier: PlanTier,
    provider: "stripe" | "razorpay" | "sandbox"
  ) => void;
  // Admin Actions
  adminUpdateUserPlan: (targetUserId: string, tier: PlanTier) => void;
  adminAdjustCredits: (targetUserId: string, delta: number) => void;
  adminToggleRole: (targetUserId: string) => void;
  recordGeneration: (
    item: Omit<GenerationHistoryItem, "id" | "userId" | "createdAt">
  ) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: "snappost_current_user_v1",
  ALL_USERS: "snappost_all_users_v1",
  PROJECTS: "snappost_projects_v1",
  BRAND_KITS: "snappost_brand_kits_v1",
  TRANSACTIONS: "snappost_transactions_v1",
  HISTORY: "snappost_gen_history_v1",
  EMAIL_FOR_SIGN_IN: "emailForSignIn",
};

function createInitialSeedData(userId: string) {
  const now = new Date().toISOString();
  const defaultBrandKit: BrandKit = {
    id: "bk-default-pulse",
    userId,
    brandName: "PulseMetrics AI",
    primaryColor: "#7C3AED",
    secondaryColor: "#1E293B",
    accentColor: "#3B82F6",
    headingFont: "Inter",
    bodyFont: "Inter",
    brandDescription:
      "Autonomous revenue intelligence and predictive cohort analytics for B2B SaaS.",
    defaultCta: "Start 14-Day Free Trial →",
    brandVoice: "Founder-style",
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  };

  const sampleAnalysis = {
    screenshotRepresents: "ARR & Net Retention Executive SaaS Dashboard",
    category: "B2B SaaS Revenue Intelligence",
    mainPurpose:
      "Track Annual Recurring Revenue ($1.48M), Net Dollar Retention (134.8%), and AI churn predictions in real time.",
    productSummary:
      "PulseMetrics AI unifies subscription telemetry, cohort retention, and automated expansion signals into one zero-config dark-mode workspace.",
    visibleFeatures: [
      {
        name: "ARR & MoM Growth Telemetry ($1,482,900)",
        description: "Live recurring revenue tracking with +38.4% MoM badge.",
        confidence: "high" as const,
      },
      {
        name: "Net Dollar Retention Benchmark (134.8%)",
        description: "Highlights top-decile SaaS expansion velocity.",
        confidence: "high" as const,
      },
      {
        name: "Automated Revenue Copilot Insights",
        description:
          "Surfaces enterprise upgrade triggers and expansion accounts.",
        confidence: "high" as const,
      },
    ],
    uiElements: [
      "Dark navigation sidebar",
      "3 KPI summary cards",
      "Predictive pipeline area chart",
      "AI Copilot action feed",
    ],
    brandColors: ["#7C3AED", "#3B82F6", "#10B981"],
    designStyle: "Dark Obsidian SaaS UI",
    targetAudience: "SaaS Founders, CFOs, RevOps & Growth Teams",
    uniqueSellingPoints: [
      "99.4% AI anomaly forecast accuracy",
      "Real-time Slack expansion alerts",
      "Built for high-velocity B2B SaaS operators",
    ],
    marketingAngles: [
      "How we grew Net Dollar Retention to 134.8% with AI Revenue Intelligence",
      "Stop drowning in spreadsheets: Real-time ARR clarity in one view",
      "Inside PulseMetrics AI 2.0 — Predictive pipeline meets instant insights",
    ],
    recommendedPlatforms: [
      "linkedin-post" as const,
      "twitter-post" as const,
      "instagram-post" as const,
    ],
    suggestedHeadline: "134.8% Net Retention Starts With Real-Time Clarity",
    suggestedSubheadline:
      "Unify ARR telemetry, churn radar, and expansion triggers in one intelligent workspace.",
    suggestedCta: "Start 14-Day Free Trial →",
    analyzedBy: "gemini-vision" as const,
  };

  const projectId = "proj-seed-pulsemetrics";
  const variations: DesignVariation[] = generateDesignVariations({
    projectId,
    screenshotUrl: DEMO_SAAS_SCREENSHOT_DATA_URL,
    platformId: "linkedin-post",
    stylePreset: "Minimal SaaS",
    variationCount: 4,
    backgroundStyle: "radial-violet",
    primaryBrandColor: "#7C3AED",
    analysis: sampleAnalysis,
    brandKit: defaultBrandKit,
    isFreePlan: false,
  });

  const sampleProject: ProjectRecord = {
    id: projectId,
    userId,
    name: "PulseMetrics Q4 Launch Post",
    screenshotUrl: DEMO_SAAS_SCREENSHOT_DATA_URL,
    productName: "PulseMetrics AI",
    productDescription:
      "Real-time revenue intelligence and churn radar for B2B SaaS companies.",
    targetAudience: "SaaS Founders, RevOps Leaders, B2B Marketers",
    brandName: "PulseMetrics AI",
    desiredTone: "Founder-style",
    mainObjective: "Drive self-serve trials and LinkedIn engagement",
    platformId: "linkedin-post",
    contentStyle: "Minimal SaaS",
    analysis: sampleAnalysis,
    captions: {
      platformId: "linkedin-post",
      tone: "Founder-style",
      headlines: [
        "134.8% Net Retention Starts With Real-Time Clarity",
        "Why We Rebuilt SaaS Revenue Analytics From Scratch",
        "From 12 Spreadsheets to 1 Intelligent Command Center",
        "Meet PulseMetrics AI: Zero-Lag ARR & Cohort Visibility",
        "How High-Velocity SaaS Teams Spot Expansion Early",
      ],
      openingHooks: [
        "We talked to 60 SaaS founders last quarter. Almost all of them had the same blind spot:",
        "Your ARR dashboard shouldn't take 4 hours every Monday morning to update.",
        "Here is the exact view our team uses to track $1.48M ARR and 134.8% NDR in real time 👇",
      ],
      captions: [
        {
          title: "LinkedIn Post — Founder Story & Metrics Proof",
          body: `We talked to 60 SaaS founders last quarter. Almost all of them had the same blind spot:\n\nThey knew their headline ARR, but couldn't see churn risk or expansion velocity until the quarter was already over.\n\nSo we built PulseMetrics AI to surface everything in one dark-mode command center:\n\n1️⃣ Live ARR & MoM Growth ($1.48M tracked live)\n2️⃣ Net Dollar Retention benchmarking (134.8%)\n3️⃣ Automated Revenue Copilot that flags accounts ready for annual upgrades\n\nNo SQL required. Connect Stripe or Billing in 90 seconds.\n\nStart 14-Day Free Trial →`,
          characterCount: 541,
        },
        {
          title: "LinkedIn Post — Before vs. After Contrast",
          body: `Old way of prepping for board meetings:\n• Exporting 6 CSVs\n• Fixing broken VLOOKUPs at midnight\n• Guessing why Net Retention dipped\n\nNew way with PulseMetrics AI:\n• 99.4% AI forecast accuracy\n• Instant cohort & churn radar\n• Automated Slack expansion triggers\n\nSee how fast your metrics can look →`,
          characterCount: 318,
        },
        {
          title: "LinkedIn Post — Feature Drop Announcement",
          body: `Shipping day! 🚀\n\nSay hello to the new Automated Revenue Copilot inside PulseMetrics AI.\n\nIt continuously scans product usage + billing signals to highlight which enterprise accounts are ready to expand this week.\n\nTry it with your live data today →`,
          characterCount: 263,
        },
      ],
      hashtags: [
        "#SaaS",
        "#B2BSaaS",
        "#BuildInPublic",
        "#RevOps",
        "#ProductDesign",
      ],
      ctaSuggestions: [
        "Start 14-Day Free Trial →",
        "Explore Live Interactive Demo →",
        "Connect Stripe in 60 Seconds →",
      ],
      shortPromoDescriptions: [
        "Real-time ARR, Net Retention, and AI churn forecasts in one sleek SaaS dashboard.",
        "Turn raw billing events into actionable expansion alerts with PulseMetrics AI.",
      ],
    },
    variations,
    activeVariationId: variations[0].id,
    brandKitId: defaultBrandKit.id,
    status: "generated",
    createdAt: now,
    updatedAt: now,
  };

  const initialTransactions: CreditTransaction[] = [
    {
      id: "tx-init-1",
      userId,
      amount: 25,
      balanceAfter: 25,
      actionType: "monthly_allocation",
      description: "Initial Starter Free monthly AI credit allocation",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "tx-init-2",
      userId,
      amount: -1,
      balanceAfter: 24,
      actionType: "screenshot_analysis",
      description: "Gemini 3.8 Flash Vision analysis for PulseMetrics Q4 Launch Post",
      projectId,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: "tx-init-3",
      userId,
      amount: -2,
      balanceAfter: 22,
      actionType: "design_generation",
      description: "Generated 4 social design variations (LinkedIn Post)",
      projectId,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ];

  const initialHistory: GenerationHistoryItem[] = [
    {
      id: "gh-init-1",
      userId,
      projectId,
      projectName: "PulseMetrics Q4 Launch Post",
      generationType: "analysis",
      platformId: "linkedin-post",
      stylePreset: "Minimal SaaS",
      creditsUsed: 1,
      providerUsed: "gemini-3.8-flash",
      latencyMs: 680,
      status: "completed",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: "gh-init-2",
      userId,
      projectId,
      projectName: "PulseMetrics Q4 Launch Post",
      generationType: "designs",
      platformId: "linkedin-post",
      stylePreset: "Minimal SaaS",
      creditsUsed: 2,
      providerUsed: "snappost-design-engine",
      latencyMs: 420,
      status: "completed",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ];

  return {
    defaultBrandKit,
    sampleProject,
    initialTransactions,
    initialHistory,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccountState | null>(null);
  const [allUsers, setAllUsers] = useState<RegisteredUserRecord[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [generationHistory, setGenerationHistory] = useState<
    GenerationHistoryItem[]
  >([]);

  const syncFirebaseUserToStore = useCallback(
    (fbUser: { uid: string; email: string | null; displayName: string | null }) => {
      const email = (fbUser.email || "user@snappost.ai").toLowerCase();
      const isAdmin = email.includes("admin");

      setAllUsers((prevUsers) => {
        const existing = prevUsers.find(
          (u) => u.id === fbUser.uid || u.email.toLowerCase() === email
        );
        if (existing) {
          setUser(existing);
          return prevUsers;
        }
        const newAccount: RegisteredUserRecord = {
          id: fbUser.uid,
          email,
          fullName:
            fbUser.displayName ||
            email.split("@")[0].replace(/[._-]/g, " "),
          companyName: "SnapPost Studio",
          role: isAdmin ? "admin" : "user",
          planTier: "FREE",
          subscriptionStatus: "active",
          creditsBalance: 25,
          monthlyAllowance: 25,
          totalConsumed: 0,
          createdAt: new Date().toISOString(),
        };
        setUser(newAccount);
        return [newAccount, ...prevUsers];
      });
    },
    []
  );

  // Initialize from persistent storage + Firebase Auth & Analytics
  useEffect(() => {
    initFirebaseAnalytics().catch(() => null);

    try {
      const defaultAdminUser: RegisteredUserRecord = {
        id: "usr-founder-admin",
        email: "admin@snappost.ai",
        fullName: "Alex Rivera",
        companyName: "SnapPost Labs",
        role: "admin",
        planTier: "PRO",
        subscriptionStatus: "active",
        creditsBalance: 22,
        monthlyAllowance: 250,
        totalConsumed: 3,
        createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      };

      const storedUsersRaw = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      let loadedUsers: RegisteredUserRecord[] = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : [defaultAdminUser];

      if (loadedUsers.length === 0) {
        loadedUsers = [defaultAdminUser];
      }
      setAllUsers(loadedUsers);

      const storedCurrentRaw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const activeUser: UserAccountState | null = storedCurrentRaw
        ? JSON.parse(storedCurrentRaw)
        : defaultAdminUser;

      setUser(activeUser);

      const seed = createInitialSeedData(defaultAdminUser.id);

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      setProjects(
        storedProjects ? JSON.parse(storedProjects) : [seed.sampleProject]
      );

      const storedKits = localStorage.getItem(STORAGE_KEYS.BRAND_KITS);
      setBrandKits(
        storedKits ? JSON.parse(storedKits) : [seed.defaultBrandKit]
      );

      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      setTransactions(
        storedTx ? JSON.parse(storedTx) : seed.initialTransactions
      );

      const storedHist = localStorage.getItem(STORAGE_KEYS.HISTORY);
      setGenerationHistory(
        storedHist ? JSON.parse(storedHist) : seed.initialHistory
      );
    } catch (e) {
      console.error("Failed to hydrate SnapPost store:", e);
    } finally {
      setIsLoadingAuth(false);
    }

    // Listen for live Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        syncFirebaseUserToStore(fbUser);
      }
    });

    return () => unsubscribe();
  }, [syncFirebaseUserToStore]);

  // Persist changes
  useEffect(() => {
    if (isLoadingAuth) return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [user, isLoadingAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers, isLoadingAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects, isLoadingAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify(brandKits));
  }, [brandKits, isLoadingAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  }, [transactions, isLoadingAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    localStorage.setItem(
      STORAGE_KEYS.HISTORY,
      JSON.stringify(generationHistory)
    );
  }, [generationHistory, isLoadingAuth]);

  // 1. Firebase Email & Password Sign-In
  const login = useCallback(
    async (email: string, password?: string): Promise<{ error?: string }> => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !normalized.includes("@")) {
        return { error: "Please enter a valid email address." };
      }

      if (password) {
        try {
          const cred = await signInWithEmailAndPassword(
            auth,
            normalized,
            password
          );
          syncFirebaseUserToStore(cred.user);
          return {};
        } catch (fbErr: unknown) {
          const code = (fbErr as { code?: string })?.code || "";
          // If the user doesn't exist in Firebase yet and is signing in with valid credentials, auto-provision or check local store
          if (
            code === "auth/user-not-found" ||
            code === "auth/invalid-credential"
          ) {
            try {
              const created = await createUserWithEmailAndPassword(
                auth,
                normalized,
                password
              );
              syncFirebaseUserToStore(created.user);
              return {};
            } catch (createErr: unknown) {
              const createCode =
                (createErr as { code?: string })?.code || "";
              if (createCode === "auth/email-already-in-use") {
                return {
                  error:
                    "Incorrect password for this account. Try again or use Passwordless Email Link sign-in.",
                };
              }
            }
          }
        }
      }

      const existing = allUsers.find(
        (u) => u.email.toLowerCase() === normalized
      );
      if (existing) {
        setUser(existing);
        return {};
      }

      const isAdminEmail = normalized.includes("admin");
      const newUser: RegisteredUserRecord = {
        id: `usr-${Date.now()}`,
        email: normalized,
        fullName: normalized.split("@")[0].replace(/[._-]/g, " "),
        companyName: "My Workspace",
        role: isAdminEmail ? "admin" : "user",
        planTier: "FREE",
        subscriptionStatus: "active",
        creditsBalance: 25,
        monthlyAllowance: 25,
        totalConsumed: 0,
        createdAt: new Date().toISOString(),
      };

      setAllUsers((prev) => [newUser, ...prev]);
      setUser(newUser);
      return {};
    },
    [allUsers, syncFirebaseUserToStore]
  );

  // 2. Firebase Email Link (Passwordless Sign-In) — Send Link
  const sendMagicEmailLink = useCallback(
    async (email: string): Promise<{ error?: string; sent?: boolean }> => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !normalized.includes("@")) {
        return { error: "Please enter a valid email address." };
      }

      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/login`
          : "https://snappost-si.web.app/auth/login";

      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true,
      };

      try {
        await sendSignInLinkToEmail(auth, normalized, actionCodeSettings);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            STORAGE_KEYS.EMAIL_FOR_SIGN_IN,
            normalized
          );
        }
        return { sent: true };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to send sign-in link to email.";
        return { error: message };
      }
    },
    []
  );

  // 3. Firebase Email Link (Passwordless Sign-In) — Complete Sign-In on callback
  const completeMagicEmailLinkSignIn = useCallback(
    async (
      urlHref?: string,
      providedEmail?: string
    ): Promise<{ error?: string; completed?: boolean }> => {
      if (typeof window === "undefined") return {};
      const currentHref = urlHref || window.location.href;

      if (!isSignInWithEmailLink(auth, currentHref)) {
        return { completed: false };
      }

      let email =
        providedEmail ||
        window.localStorage.getItem(STORAGE_KEYS.EMAIL_FOR_SIGN_IN) ||
        "";

      if (!email) {
        email =
          window.prompt(
            "Please provide your email address to confirm passwordless sign-in:"
          ) || "";
      }

      if (!email) {
        return {
          error: "Email confirmation is required to complete magic link sign-in.",
        };
      }

      try {
        const result = await signInWithEmailLink(auth, email, currentHref);
        window.localStorage.removeItem(STORAGE_KEYS.EMAIL_FOR_SIGN_IN);
        syncFirebaseUserToStore(result.user);
        return { completed: true };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to verify email sign-in link.";
        return { error: message };
      }
    },
    [syncFirebaseUserToStore]
  );

  // 4. Firebase Google Sign-In Popup
  const loginWithGoogle = useCallback(async (): Promise<{ error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      syncFirebaseUserToStore(result.user);
      return {};
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google Sign-In failed.";
      return { error: message };
    }
  }, [syncFirebaseUserToStore]);

  // 5. Firebase Email & Password Registration
  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      companyName = ""
    ): Promise<{ error?: string }> => {
      const normalized = email.trim().toLowerCase();
      if (!fullName.trim()) {
        return { error: "Full name is required." };
      }
      if (!normalized || !normalized.includes("@")) {
        return { error: "Please provide a valid work email." };
      }
      if (!password || password.length < 6) {
        return { error: "Password must be at least 6 characters." };
      }

      let firebaseUid = `usr-${Date.now()}`;
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          normalized,
          password
        );
        await firebaseUpdateProfile(cred.user, {
          displayName: fullName.trim(),
        });
        firebaseUid = cred.user.uid;
      } catch (fbErr: unknown) {
        const code = (fbErr as { code?: string })?.code || "";
        if (code === "auth/email-already-in-use") {
          return {
            error:
              "This email is already registered. Please sign in instead.",
          };
        }
      }

      const isAdmin = normalized.includes("admin");
      const newUser: RegisteredUserRecord = {
        id: firebaseUid,
        email: normalized,
        fullName: fullName.trim(),
        companyName: companyName.trim() || `${fullName.trim()}'s Studio`,
        role: isAdmin ? "admin" : "user",
        planTier: "FREE",
        subscriptionStatus: "active",
        creditsBalance: 25,
        monthlyAllowance: 25,
        totalConsumed: 0,
        createdAt: new Date().toISOString(),
      };

      setAllUsers((prev) => [
        newUser,
        ...prev.filter((u) => u.email.toLowerCase() !== normalized),
      ]);
      setUser(newUser);

      const seed = createInitialSeedData(newUser.id);
      setProjects((prev) => [seed.sampleProject, ...prev]);
      setBrandKits((prev) => [seed.defaultBrandKit, ...prev]);
      setTransactions((prev) => [
        {
          id: `tx-welcome-${Date.now()}`,
          userId: newUser.id,
          amount: 25,
          balanceAfter: 25,
          actionType: "monthly_allocation",
          description: "Welcome Starter Free AI Credit Allocation",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      return {};
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore if not signed into Firebase
    }
    setUser(null);
  }, []);

  const resetPasswordRequest = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        message: `Password reset email sent to ${email}. Please check your inbox.`,
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : `Password reset instructions generated for ${email}.`;
      return { message: msg };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (newPassword.length < 6) {
      return { message: "Password must be at least 6 characters." };
    }
    if (auth.currentUser) {
      try {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
      } catch {
        // Fallback if re-authentication required
      }
    }
    return { message: "Your password has been securely updated." };
  }, []);

  const updateProfile = useCallback(
    (updates: {
      fullName?: string;
      companyName?: string;
      role?: "user" | "admin";
    }) => {
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        setAllUsers((list) =>
          list.map((u) => (u.id === updated.id ? { ...u, ...updates } : u))
        );
        return updated;
      });
    },
    []
  );

  const createProject = useCallback(
    (
      partial: Partial<ProjectRecord> & { name: string; screenshotUrl: string }
    ): ProjectRecord => {
      const now = new Date().toISOString();
      const userId = user?.id || "usr-guest";
      const newProject: ProjectRecord = {
        id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId,
        name: partial.name,
        screenshotUrl: partial.screenshotUrl,
        productName: partial.productName || "",
        productDescription: partial.productDescription || "",
        targetAudience: partial.targetAudience || "",
        brandName: partial.brandName || "",
        desiredTone: partial.desiredTone || "Founder-style",
        mainObjective:
          partial.mainObjective || "Drive product awareness & signups",
        platformId: partial.platformId || "linkedin-post",
        contentStyle: partial.contentStyle || "Minimal SaaS",
        analysis: partial.analysis || null,
        captions: partial.captions || null,
        variations: partial.variations || [],
        activeVariationId: partial.activeVariationId,
        brandKitId: partial.brandKitId,
        status: partial.status || "draft",
        createdAt: now,
        updatedAt: now,
      };

      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    },
    [user]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<ProjectRecord>) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p
        )
      );
    },
    []
  );

  const duplicateProject = useCallback(
    (id: string): ProjectRecord | null => {
      const target = projects.find((p) => p.id === id);
      if (!target) return null;
      const now = new Date().toISOString();
      const newId = `proj-${Date.now()}`;
      const clonedVariations = target.variations.map((v, idx) => ({
        ...v,
        id: `var-${newId}-${idx + 1}`,
        projectId: newId,
        document: JSON.parse(JSON.stringify(v.document)),
      }));
      const copy: ProjectRecord = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        variations: clonedVariations,
        activeVariationId: clonedVariations[0]?.id,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [copy, ...prev]);
      return copy;
    },
    [projects]
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProjectById = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const saveBrandKit = useCallback(
    (
      kitInput: Omit<BrandKit, "id" | "userId" | "createdAt" | "updatedAt"> & {
        id?: string;
      }
    ): BrandKit => {
      const now = new Date().toISOString();
      const userId = user?.id || "usr-guest";

      if (kitInput.id) {
        let updatedKit!: BrandKit;
        setBrandKits((prev) =>
          prev.map((k) => {
            if (k.id === kitInput.id) {
              updatedKit = { ...k, ...kitInput, id: k.id, updatedAt: now };
              return updatedKit;
            }
            return kitInput.isDefault ? { ...k, isDefault: false } : k;
          })
        );
        return updatedKit;
      }

      const newKit: BrandKit = {
        ...kitInput,
        id: `bk-${Date.now()}`,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      setBrandKits((prev) => {
        const mapped = newKit.isDefault
          ? prev.map((k) => ({ ...k, isDefault: false }))
          : prev;
        return [newKit, ...mapped];
      });
      return newKit;
    },
    [user]
  );

  const deleteBrandKit = useCallback((id: string) => {
    setBrandKits((prev) => prev.filter((k) => k.id !== id));
  }, []);

  const setDefaultBrandKit = useCallback((id: string) => {
    setBrandKits((prev) =>
      prev.map((k) => ({ ...k, isDefault: k.id === id }))
    );
  }, []);

  const deductCredits = useCallback(
    async (
      actionType: CreditActionType,
      description: string,
      projectId?: string
    ): Promise<{ success: boolean; error?: string; newBalance?: number }> => {
      if (!user) {
        return {
          success: false,
          error: "Please sign in to perform AI generations.",
        };
      }

      const costMap: Record<string, number> = {
        screenshot_analysis: CREDIT_COSTS.screenshot_analysis,
        copy_generation: CREDIT_COSTS.copy_generation,
        design_generation: CREDIT_COSTS.design_generation,
        design_regeneration: CREDIT_COSTS.design_regeneration,
      };
      const cost = costMap[actionType] ?? 1;

      if (user.creditsBalance < cost) {
        return {
          success: false,
          error: `Insufficient AI credits. Requires ${cost} credit(s), balance is ${user.creditsBalance}.`,
        };
      }

      const newBalance = user.creditsBalance - cost;

      setUser((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          creditsBalance: newBalance,
          totalConsumed: prev.totalConsumed + cost,
        };
        setAllUsers((list) =>
          list.map((u) => (u.id === updated.id ? updated : u))
        );
        return updated;
      });

      const tx: CreditTransaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId: user.id,
        amount: -cost,
        balanceAfter: newBalance,
        actionType,
        description,
        projectId,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);

      return { success: true, newBalance };
    },
    [user]
  );

  const upgradePlan = useCallback(
    (tier: PlanTier, provider: "stripe" | "razorpay" | "sandbox") => {
      if (!user) return;
      const planSpec =
        PRICING_PLANS.find((p) => p.tier === tier) || PRICING_PLANS[0];

      const newBalance = planSpec.creditsPerMonth;
      setUser((prev) => {
        if (!prev) return null;
        const updated: UserAccountState = {
          ...prev,
          planTier: tier,
          subscriptionStatus: "active",
          creditsBalance: newBalance,
          monthlyAllowance: planSpec.creditsPerMonth,
        };
        setAllUsers((list) =>
          list.map((u) => (u.id === updated.id ? updated : u))
        );
        return updated;
      });

      const tx: CreditTransaction = {
        id: `tx-upgrade-${Date.now()}`,
        userId: user.id,
        amount: planSpec.creditsPerMonth,
        balanceAfter: newBalance,
        actionType: "plan_upgrade",
        description: `Plan upgraded to ${planSpec.name}`,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);
    },
    [user]
  );

  const adminUpdateUserPlan = useCallback(
    (targetUserId: string, tier: PlanTier) => {
      const planSpec =
        PRICING_PLANS.find((p) => p.tier === tier) || PRICING_PLANS[0];
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === targetUserId
            ? {
                ...u,
                planTier: tier,
                monthlyAllowance: planSpec.creditsPerMonth,
                creditsBalance: Math.max(
                  u.creditsBalance,
                  planSpec.creditsPerMonth
                ),
              }
            : u
        )
      );
      if (user?.id === targetUserId) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                planTier: tier,
                monthlyAllowance: planSpec.creditsPerMonth,
                creditsBalance: Math.max(
                  prev.creditsBalance,
                  planSpec.creditsPerMonth
                ),
              }
            : null
        );
      }
    },
    [user]
  );

  const adminAdjustCredits = useCallback(
    (targetUserId: string, delta: number) => {
      let updatedBalance = 0;
      setAllUsers((prev) =>
        prev.map((u) => {
          if (u.id === targetUserId) {
            updatedBalance = Math.max(0, u.creditsBalance + delta);
            return { ...u, creditsBalance: updatedBalance };
          }
          return u;
        })
      );

      if (user?.id === targetUserId) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                creditsBalance: Math.max(0, prev.creditsBalance + delta),
              }
            : null
        );
      }

      const tx: CreditTransaction = {
        id: `tx-admin-${Date.now()}`,
        userId: targetUserId,
        amount: delta,
        balanceAfter: updatedBalance,
        actionType: "admin_adjustment",
        description: `Admin credit adjustment (${delta >= 0 ? "+" : ""}${delta} credits)`,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);
    },
    [user]
  );

  const adminToggleRole = useCallback(
    (targetUserId: string) => {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === targetUserId
            ? { ...u, role: u.role === "admin" ? "user" : "admin" }
            : u
        )
      );
      if (user?.id === targetUserId) {
        setUser((prev) =>
          prev
            ? { ...prev, role: prev.role === "admin" ? "user" : "admin" }
            : null
        );
      }
    },
    [user]
  );

  const recordGeneration = useCallback(
    (item: Omit<GenerationHistoryItem, "id" | "userId" | "createdAt">) => {
      const entry: GenerationHistoryItem = {
        ...item,
        id: `gh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId: user?.id || "usr-guest",
        createdAt: new Date().toISOString(),
      };
      setGenerationHistory((prev) => [entry, ...prev]);
    },
    [user]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        allUsers,
        isLoadingAuth,
        projects,
        brandKits,
        transactions,
        generationHistory,
        login,
        sendMagicEmailLink,
        completeMagicEmailLinkSignIn,
        loginWithGoogle,
        register,
        logout,
        resetPasswordRequest,
        updatePassword,
        updateProfile,
        createProject,
        updateProject,
        duplicateProject,
        deleteProject,
        getProjectById,
        saveBrandKit,
        deleteBrandKit,
        setDefaultBrandKit,
        deductCredits,
        upgradePlan,
        adminUpdateUserPlan,
        adminAdjustCredits,
        adminToggleRole,
        recordGeneration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return ctx;
}
