# SpacePulse AI Dashboard - Environment Setup

## Overview
This project has been configured with Hugging Face AI integration and real-time ISS tracking. All sensitive information is managed through environment variables.

## Environment Variables Setup

### `.env` File
The `.env` file contains your Hugging Face API token and configuration. This file is automatically created and added to `.gitignore` to protect your credentials.

```
VITE_HF_TOKEN=your_token_here
VITE_HF_API_URL=https://api-inference.huggingface.co/models/
VITE_HF_MODEL=mistralai/Mistral-7B-Instruct-v0.1
```

### `.env.example`
A template file that shows what variables are needed (without actual values). This is safe to commit to version control.

## Features Enabled

### 1. AI Chatbot (SpacePulse AI)
- **Location**: `/src/chatbot/Chatbot.jsx`
- **Service**: `/src/services/huggingFaceService.js`
- **Features**:
  - Real-time responses powered by Hugging Face API
  - Space-focused question answering
  - Error handling and user feedback
  - Suggestion chips for quick questions

**How it works**:
1. User asks a space-related question
2. Question is sent to Hugging Face Mistral model via your API token
3. AI generates an intelligent response
4. Response appears in the chat interface

### 2. ISS Tracker
- **Location**: `/src/map/ISSTracker.jsx`
- **Service**: `/src/services/issService.js`
- **Features**:
  - Real-time ISS position data
  - Live altitude and velocity metrics
  - Automatic updates every 5 seconds
  - Manual refresh button
  - Error handling with retry option

**How it works**:
1. Component fetches ISS position from `wheretheiss.at` API (free, no auth required)
2. Displays current coordinates, altitude, and speed
3. Auto-updates every 5 seconds for live tracking
4. Shows loading and error states

## Running the Application

### Development
```bash
npm run dev
```
The app will start on `http://localhost:5174/`

### Building for Production
```bash
npm run build
npm run preview
```

## API Services Used

### 1. Hugging Face API (Chatbot)
- **Endpoint**: https://api-inference.huggingface.co/models/
- **Model**: `mistralai/Mistral-7B-Instruct-v0.1`
- **Authentication**: Bearer token in `.env`
- **Cost**: Free tier available, paid options for higher usage

### 2. Where the ISS At API (ISS Tracker)
- **Endpoint**: https://api.wheretheiss.at/v1/satellites/25544
- **Authentication**: None required
- **Rate Limit**: Generous free tier
- **Data**: Real satellite TLE orbital data

## Troubleshooting

### Chatbot Not Responding
1. Check if `VITE_HF_TOKEN` is set correctly in `.env`
2. Verify token is valid at https://huggingface.co/settings/tokens
3. Check browser console for API errors
4. Ensure you have internet connection

### ISS Tracker Not Showing Data
1. Check internet connection
2. Verify the API endpoint is accessible
3. Check browser console for CORS or network errors
4. Try the refresh button

### Port Already in Use
If port 5173/5174 is in use:
```bash
# Kill the process using the port (macOS/Linux)
lsof -ti :5173 | xargs kill -9
```

## Security Notes

⚠️ **Important**: 
- Never commit the `.env` file to version control
- Never share your Hugging Face token
- The `.env` file is in `.gitignore` to prevent accidental commits
- If token is exposed, regenerate it at https://huggingface.co/settings/tokens

## Future Enhancements

- [ ] Add Leaflet.js map visualization for ISS tracker
- [ ] Add orbital path visualization
- [ ] Add ground track display
- [ ] Cache ISS passes for specific locations
- [ ] Enhance UI with more space data (weather satellites, star map, etc.)

## File Structure

```
src/
├── services/
│   ├── huggingFaceService.js   # AI API integration
│   └── issService.js            # ISS tracking API
├── chatbot/
│   └── Chatbot.jsx              # Chat UI component
├── map/
│   └── ISSTracker.jsx           # ISS tracker UI
└── ...other components
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_HF_TOKEN` | Hugging Face API token | `hf_xxxxx...` |
| `VITE_HF_API_URL` | Hugging Face API endpoint | `https://api-inference.huggingface.co/models/` |
| `VITE_HF_MODEL` | Model to use | `mistralai/Mistral-7B-Instruct-v0.1` |

---

**Last Updated**: May 8, 2026
**Project**: SpacePulse AI Dashboard
