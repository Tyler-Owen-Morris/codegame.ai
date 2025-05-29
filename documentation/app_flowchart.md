flowchart TD
Start[Start] --> ScanQR[Scan QR code]
ScanQR --> DecodeQR[Detect and decode QR data]
DecodeQR --> TrimParams[Trim URL parameters]
TrimParams --> SendBackend[Send QR data location time user id to backend]
SendBackend --> AIAvail{AI Service available}
AIAvail -->|Yes| GenAIPuzzle[Generate puzzle via xAI API]
AIAvail -->|No| FallbackPuzzle[Load puzzle from static library]
GenAIPuzzle --> StorePuzzle[Store mapping of QR to puzzle]
FallbackPuzzle --> StorePuzzle
StorePuzzle --> ReturnPuzzle[Return puzzle to mobile app]
ReturnPuzzle --> DisplayPuzzle[Display puzzle with animated UI]
DisplayPuzzle --> UserSolve[User solves puzzle]
UserSolve --> StoreResult[Store result update stats scan history]
StoreResult --> UpdatePoints[Update code points and leaderboard]
UpdatePoints --> End[End]