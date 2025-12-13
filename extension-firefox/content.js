// Content Script - SPViewer Backup UI direkt in der Seite
(function() {
    'use strict';

    console.log('🚀 SPViewer Backup Extension geladen');

    const DB_NAME = 'SCSPVDatabase';
    const STORE_NAME = 'vehiclesLoadout';

    let panel = null;
    let backdrop = null;
    let isOpen = false;

    // Backdrop erstellen
    function createBackdrop() {
        if (backdrop) return;

        backdrop = document.createElement('div');
        backdrop.id = 'spviewer-backup-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            z-index: 999999;
            display: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        backdrop.addEventListener('click', closePanel);
        document.body.appendChild(backdrop);
    }

    // UI Panel erstellen
    function createPanel() {
        if (panel) return;

        // Container
        panel = document.createElement('div');
        panel.id = 'spviewer-backup-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9) translateZ(0);
            width: 400px;
            background: #3a3e44;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: none;
            opacity: 0;
            transition: opacity 0.2s ease, transform 0.2s ease;
            will-change: transform, opacity;
        `;

        panel.innerHTML = `
            <div style="background: #26292c; padding: 20px; border-radius: 8px 8px 0 0; color: rgba(255, 255, 255, 0.9); border-bottom: 1px solid rgba(0, 0, 0, 0.2);">
                <h2 style="margin: 0; font-size: 18px; font-weight: 600;">💾 SPViewer Backup</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.6;">Loadout Sicherung & Wiederherstellung</p>
            </div>

            <div style="padding: 20px; background: #3a3e44;">
                <div id="backup-status" style="padding: 10px 12px; margin-bottom: 16px; border-radius: 6px; font-size: 13px; background: #26292c; color: rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 0, 0, 0.2);">
                    Bereit zum Sichern Ihrer Loadouts
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                    <button id="backup-export" style="padding: 12px 16px; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; background: #fb8c00; color: white; transition: all 0.2s;">
                        📥 Loadouts exportieren
                    </button>
                    <button id="backup-import" style="padding: 12px 16px; border: 1px solid #fb8c00; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; background: transparent; color: #fb8c00; transition: all 0.2s;">
                        📤 Loadouts importieren
                    </button>
                    <button id="backup-check" style="padding: 12px 16px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; background: transparent; color: rgba(255, 255, 255, 0.8); transition: all 0.2s;">
                        🔍 Datenbank prüfen
                    </button>
                </div>

                <div id="backup-stats" style="background: #26292c; padding: 14px; border-radius: 6px; margin-bottom: 16px; display: none; border: 1px solid rgba(0, 0, 0, 0.2);">
                    <div style="font-size: 11px; color: rgba(255, 255, 255, 0.5); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Statistiken</div>
                    <div style="display: flex; justify-content: space-between; padding: 6px 0;">
                        <span style="font-size: 13px; color: rgba(255, 255, 255, 0.7);">Loadouts:</span>
                        <span id="backup-count" style="font-size: 15px; font-weight: 600; color: #fb8c00;">-</span>
                    </div>
                </div>

                <button id="backup-close" style="width: 100%; padding: 10px; border: 1px solid rgba(255, 255, 255, 0.2); background: transparent; border-radius: 6px; font-size: 13px; cursor: pointer; color: rgba(255, 255, 255, 0.7); font-weight: 500; transition: all 0.2s;">
                    Schließen
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // Event Listeners
        panel.querySelector('#backup-export').addEventListener('click', exportLoadouts);
        panel.querySelector('#backup-import').addEventListener('click', importLoadouts);
        panel.querySelector('#backup-check').addEventListener('click', checkDatabase);
        panel.querySelector('#backup-close').addEventListener('click', closePanel);

        // Hover-Effekte
        const exportBtn = panel.querySelector('#backup-export');
        const importBtn = panel.querySelector('#backup-import');
        const checkBtn = panel.querySelector('#backup-check');
        const closeBtn = panel.querySelector('#backup-close');

        exportBtn.addEventListener('mouseenter', () => {
            exportBtn.style.transform = 'translateY(-2px)';
            exportBtn.style.background = '#ffa726';
        });
        exportBtn.addEventListener('mouseleave', () => {
            exportBtn.style.transform = 'translateY(0)';
            exportBtn.style.background = '#fb8c00';
        });

        importBtn.addEventListener('mouseenter', () => {
            importBtn.style.transform = 'translateY(-2px)';
            importBtn.style.background = '#fb8c00';
            importBtn.style.color = 'white';
        });
        importBtn.addEventListener('mouseleave', () => {
            importBtn.style.transform = 'translateY(0)';
            importBtn.style.background = 'transparent';
            importBtn.style.color = '#fb8c00';
        });

        checkBtn.addEventListener('mouseenter', () => {
            checkBtn.style.transform = 'translateY(-2px)';
            checkBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        checkBtn.addEventListener('mouseleave', () => {
            checkBtn.style.transform = 'translateY(0)';
            checkBtn.style.background = 'transparent';
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.05)';
            closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            closeBtn.style.color = 'rgba(255, 255, 255, 0.9)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            closeBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        });

        // Statistiken laden
        loadStats();
    }

    // Floating Button erstellen
    function createFloatingButton() {
        if (document.getElementById('spviewer-backup-btn')) return;

        const button = document.createElement('div');
        button.id = 'spviewer-backup-btn';
        button.innerHTML = '💾';
        button.title = 'SPViewer Backup öffnen';

        button.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            background: #fb8c00;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            transition: all 0.2s;
            border: none;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.08)';
            button.style.background = '#ffa726';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.background = '#fb8c00';
            button.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        });
        button.addEventListener('click', togglePanel);

        document.body.appendChild(button);
    }

    // Panel öffnen/schließen
    function togglePanel() {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }

    function openPanel() {
        if (!backdrop) createBackdrop();
        if (!panel) createPanel();

        backdrop.style.display = 'block';
        panel.style.display = 'block';

        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
            panel.style.opacity = '1';
            panel.style.transform = 'translate(-50%, -50%) scale(1) translateZ(0)';
        });

        isOpen = true;
    }

    function closePanel() {
        backdrop.style.opacity = '0';
        panel.style.opacity = '0';
        panel.style.transform = 'translate(-50%, -50%) scale(0.9) translateZ(0)';

        setTimeout(() => {
            backdrop.style.display = 'none';
            panel.style.display = 'none';
        }, 200);

        isOpen = false;
    }

    // Status anzeigen
    function showStatus(message, type = 'info') {
        const status = panel.querySelector('#backup-status');
        const colors = {
            info: { bg: '#1e293b', color: '#38bdf8', border: '#334155' },
            success: { bg: '#14532d', color: '#4ade80', border: '#15803d' },
            error: { bg: '#450a0a', color: '#f87171', border: '#7f1d1d' },
            warning: { bg: '#422006', color: '#fbbf24', border: '#78350f' }
        };
        const c = colors[type] || colors.info;
        status.style.background = c.bg;
        status.style.color = c.color;
        status.style.borderColor = c.border;
        status.textContent = message;
    }

    // Statistiken laden
    async function loadStats() {
        // Stats werden nicht mehr gespeichert, um storage Permission zu vermeiden
    }

    // Export
    async function exportLoadouts() {
        showStatus('Exportiere Loadouts...', 'info');

        try {
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const allData = await new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            if (!allData || allData.length === 0) {
                showStatus('❌ Keine Loadouts gefunden', 'error');
                return;
            }

            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0.0',
                loadoutCount: allData.length,
                loadouts: allData
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const filename = `spviewer-backup-${new Date().toISOString().split('T')[0]}.json`;

            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            showStatus(`✅ ${allData.length} Loadouts exportiert!`, 'success');
            panel.querySelector('#backup-count').textContent = allData.length;
            panel.querySelector('#backup-stats').style.display = 'block';

        } catch (error) {
            console.error('Export error:', error);
            showStatus(`❌ Fehler: ${error.message}`, 'error');
        }
    }

    // Import
    function importLoadouts() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) {
                document.body.removeChild(fileInput);
                return;
            }

            showStatus('Importiere Loadouts...', 'info');

            try {
                const text = await file.text();
                const importData = JSON.parse(text);

                let loadouts;
                if (Array.isArray(importData)) {
                    loadouts = importData;
                } else if (importData.loadouts && Array.isArray(importData.loadouts)) {
                    loadouts = importData.loadouts;
                } else {
                    throw new Error('Ungültiges Dateiformat');
                }

                if (loadouts.length === 0) {
                    throw new Error('Keine Loadouts in der Datei');
                }

                const confirmed = confirm(
                    `Import von ${loadouts.length} Loadouts?\n\n` +
                    `⚠️ Vorhandene Loadouts mit gleicher ID werden überschrieben!\n\n` +
                    `Fortfahren?`
                );

                if (!confirmed) {
                    showStatus('Import abgebrochen', 'info');
                    document.body.removeChild(fileInput);
                    return;
                }

                const db = await new Promise((resolve, reject) => {
                    const request = indexedDB.open(DB_NAME);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);

                let count = 0;
                for (const item of loadouts) {
                    await new Promise((resolve, reject) => {
                        const request = store.put(item);
                        request.onsuccess = () => { count++; resolve(); };
                        request.onerror = () => reject(request.error);
                    });
                }

                showStatus(`✅ ${count} Loadouts importiert!`, 'success');
                panel.querySelector('#backup-count').textContent = count;
                panel.querySelector('#backup-stats').style.display = 'block';

                setTimeout(() => {
                    if (confirm('Import erfolgreich!\n\nSeite neu laden um Änderungen zu sehen?')) {
                        location.reload();
                    }
                }, 500);

            } catch (error) {
                console.error('Import error:', error);
                showStatus(`❌ Fehler: ${error.message}`, 'error');
            } finally {
                document.body.removeChild(fileInput);
            }
        });

        fileInput.click();
    }

    // Check Database
    async function checkDatabase() {
        showStatus('Prüfe Datenbank...', 'info');

        try {
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const count = await new Promise((resolve, reject) => {
                const request = store.count();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            showStatus(`✅ ${count} Loadouts gefunden`, 'success');
            panel.querySelector('#backup-count').textContent = count;
            panel.querySelector('#backup-stats').style.display = 'block';

        } catch (error) {
            console.error('Check error:', error);
            showStatus(`❌ Fehler: ${error.message}`, 'error');
        }
    }

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(createFloatingButton, 1000);
        });
    } else {
        setTimeout(createFloatingButton, 1000);
    }

})();
