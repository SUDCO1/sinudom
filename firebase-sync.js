// firebase-sync.js - Firestore sync for sinudom
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4sL59SW_QoKaOc7RoEa2ASraMkjw_O3E",
    authDomain: "sinudom-6dd49.firebaseapp.com",
      projectId: "sinudom-6dd49",
        storageBucket: "sinudom-6dd49.firebasestorage.app",
          messagingSenderId: "1007921673061",
            appId: "1:1007921673061:web:06cfb24b6ddf804eeba78c"
            };

            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            const NOTES_REF = doc(db, "sinudom", "calendarNotes");
            const FLOW_REF = doc(db, "sinudom", "calendarFlow");

            async function loadFromFirestore() {
              if (sessionStorage.getItem("fb_synced")) return;
                let changed = false;
                  try {
                      const snap = await getDoc(NOTES_REF);
                          if (snap.exists()) { localStorage.setItem("calendarNotes", JSON.stringify(snap.data())); changed = true; }
                            } catch(e) {}
                              try {
                                  const snap = await getDoc(FLOW_REF);
                                      if (snap.exists()) { localStorage.setItem("calendarFlow", JSON.stringify(snap.data())); changed = true; }
                                        } catch(e) {}
                                          sessionStorage.setItem("fb_synced", "1");
                                            if (changed) location.reload();
                                            }

                                            function patchSaveFunctions() {
                                              const origNotes = window.saveToStorage;
                                                if (typeof origNotes === "function") {
                                                    window.saveToStorage = function() {
                                                          origNotes();
                                                                const raw = localStorage.getItem("calendarNotes");
                                                                      if (raw) setDoc(NOTES_REF, JSON.parse(raw)).catch(console.warn);
                                                                          };
                                                                            }
                                                                              const origFlow = window.saveFlowData;
                                                                                if (typeof origFlow === "function") {
                                                                                    window.saveFlowData = function() {
                                                                                          origFlow();
                                                                                                const raw = localStorage.getItem("calendarFlow");
                                                                                                      if (raw) setDoc(FLOW_REF, JSON.parse(raw)).catch(console.warn);
                                                                                                          };
                                                                                                            }
                                                                                                            }
                                                                                                            
                                                                                                            (async () => {
                                                                                                              await loadFromFirestore();
                                                                                                                patchSaveFunctions();
                                                                                                                  console.log("[firebase-sync] ready");
                                                                                                                  })();
