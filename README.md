# SPViewer HangarSync

# 100% mit AI erstellt.

Browser-Extension zum Sichern und Synchronisieren Ihrer SPViewer Fahrzeug-Loadouts. Einfacher Export und Import aller Schiffsausrüstungen direkt auf [SPViewer.eu](https://www.spviewer.eu).

## Features

- **Einfache Bedienung**: Floating-Button direkt auf der SPViewer-Seite
- **Lokale Sicherung**: Alle Daten bleiben auf Ihrem Computer
- **Cross-Browser**: Verfügbar für Firefox und Chrome
- **Design-Integration**: Nahtlose Integration in das SPViewer-Design
- **Schnell**: Optimierte Performance, keine Lags

## Installation

### Firefox

1. Laden Sie die Extension herunter
2. Öffnen Sie Firefox und navigieren Sie zu `about:addons`
3. Klicken Sie auf das Zahnrad-Symbol → "Add-on aus Datei installieren"
4. Wählen Sie die `extension-firefox` Datei aus

**Oder via Firefox Add-ons Store** (nach Veröffentlichung):
- [SPViewer HangarSync@Mozilla](https://addons.mozilla.org/de/firefox/addon/spviewer-hangarsync/)

### Chrome / Brave / Edge

1. Laden Sie die Extension herunter
2. Öffnen Sie Chrome und navigieren Sie zu `chrome://extensions`
3. Aktivieren Sie "Entwicklermodus" (oben rechts)
4. Klicken Sie auf "Entpackte Erweiterung laden"
5. Wählen Sie den `extension-chrome` Ordner aus

**Oder via Chrome Web Store** (nach Veröffentlichung):
- [SPViewer HangarSync@Google](https://chromewebstore.google.com/detail/spviewer-hangarsync/bckedfbdoklndodklepgnlaldhkobjnl)

## Verwendung

1. Öffnen Sie [SPViewer.eu](https://www.spviewer.eu)
2. Klicken Sie auf den orangenen Button unten rechts
3. Wählen Sie eine Aktion:

### Export
- Klicken Sie auf "Export Loadouts"
- Eine JSON-Datei wird automatisch heruntergeladen
- Dateiname: `spviewer-loadouts-YYYY-MM-DD.json`
- Bewahren Sie diese Datei sicher auf!

### Import
- Klicken Sie auf "Import Loadouts"
- Wählen Sie Ihre gesicherte JSON-Datei aus
- Ihre Loadouts werden wiederhergestellt
- Bestehende Loadouts mit gleicher ID werden aktualisiert

### Anzahl prüfen
- Die Extension zeigt automatisch die Anzahl Ihrer gespeicherten Loadouts an

## Was wird gesichert?

Die Extension sichert alle Ihre Fahrzeug-Loadouts aus der SPViewer IndexedDB, inklusive:

- Fahrzeugname und Klasse
- Ausrüstung und Waffen
- Loadout-Name und Beschreibung
- Build- und Patch-Version
- Erstellungsdatum
- Performance-Daten (DPS, Schilde, HP, etc.)
- Alle weiteren Loadout-Eigenschaften

## Export-Format

Die Backup-Datei ist eine JSON-Datei im folgenden Format:

```json
[
  {
    "id": "loadout-id",
    "vehicleName": "Anvil F7C Hornet",
    "loadoutName": "PVE Build",
    "build": "3.21.0",
    "patch": "LIVE",
    "created": "2024-01-15T10:30:00.000Z",
    "data": { ... }
  }
]
```

## Projektstruktur

```
SPViewer HangarSync/
├── extension-firefox/          # Firefox Extension (Manifest V2)
│   ├── manifest.json
│   ├── content.js
│   └── icons/
│       ├── icon-48.png
│       └── icon-96.png
├── extension-chrome/           # Chrome Extension (Manifest V3)
│   ├── manifest.json
│   ├── content.js
│   └── icons/
│       ├── icon-48.png
│       └── icon-96.png
├── README.md
├── LICENSE
└── .gitignore
```

## Entwicklung

### Voraussetzungen

- Firefox oder Chrome Browser
- Grundkenntnisse in JavaScript (optional)

### Lokale Installation für Entwicklung

**Firefox:**
```bash
cd extension-firefox
# Dann in Firefox: about:debugging → "Temporäres Add-on laden"
```

**Chrome:**
```bash
cd extension-chrome
# Dann in Chrome: chrome://extensions → "Entpackte Erweiterung laden"
```

### Technische Details

- **Firefox**: Manifest V2, `browser.*` API mit Promises
- **Chrome**: Manifest V3, `chrome.*` API
- **Datenbank**: `SCSPVDatabase (default)`
- **Store**: `vehiclesLoadout`
- **Performance**: Hardware-beschleunigt, optimiert für beide Browser

### Code-Unterschiede Chrome vs Firefox

Die einzigen Unterschiede zwischen den beiden Versionen:

1. **Manifest-Version**: Firefox nutzt V2, Chrome nutzt V3
2. **Storage API**: Firefox nutzt `browser.storage`, Chrome nutzt `chrome.storage`
3. **Performance**: Firefox-Version ohne `backdrop-filter` für bessere Performance

## Sicherheit

- ✅ Alle Daten bleiben lokal auf Ihrem Computer
- ✅ Keine Daten werden ins Internet hochgeladen
- ✅ Kein Server-Zugriff erforderlich
- ✅ Open Source - Code kann überprüft werden
- ✅ Minimale Berechtigungen (nur `activeTab` und `storage`)

## Häufige Fragen (FAQ)

**Q: Werden meine Daten hochgeladen?**
A: Nein, alle Daten bleiben lokal. Die Extension greift nur auf die lokale IndexedDB zu.

**Q: Kann ich Backups zwischen Browsern übertragen?**
A: Ja! Exportieren Sie in einem Browser und importieren Sie in einem anderen.

**Q: Was passiert beim Import mit bestehenden Loadouts?**
A: Loadouts mit gleicher ID werden aktualisiert, neue werden hinzugefügt.

**Q: Wie oft sollte ich Backups machen?**
A: Empfehlung: Nach jedem größeren Update oder vor Browser-Wartung.

**Q: Funktioniert die Extension offline?**
A: Die Extension funktioniert, aber Sie müssen auf spviewer.eu sein, um auf die Datenbank zuzugreifen.

## Probleme melden

Falls Sie auf Probleme stoßen:

1. Überprüfen Sie, ob Sie auf [https://www.spviewer.eu](https://www.spviewer.eu) sind
2. Öffnen Sie die Browser-Konsole (F12) und prüfen Sie auf Fehler
3. Erstellen Sie ein Issue auf GitHub mit:
   - Browser und Version
   - Fehlermeldung (falls vorhanden)
   - Schritte zur Reproduktion

## Contributing

Beiträge sind willkommen! So können Sie helfen:

1. Forken Sie das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushen Sie zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## Changelog

### Version 1.0.0 (2025-12)
- Erste Veröffentlichung
- Export/Import Funktionalität
- Firefox und Chrome Support
- Optimierte Performance
- Nahtlose Design-Integration

## Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## Autor

**SeBoOne**
- GitHub: [@SeBoOne](https://github.com/SeBoOne)

## Credits

- Star Citizen Community
- [SPViewer.eu](https://www.spviewer.eu) - Das beste Star Citizen Loadout-Tool

---

**Viel Spaß beim Sichern Ihrer Loadouts! o7**
