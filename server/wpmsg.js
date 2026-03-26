import fs from 'fs';
import axios from 'axios';

// --- CONFIGURATION ---
const API_KEY = '949d8ccfb298b83b93ae'; // Put your actual API Key here
const IMAGE_URL = 'https://i.ibb.co/PZx3sdHq/Screenshot-2026-03-26-at-4-57-50-PM.png'; // Direct link to your promo image

const MESSAGE_TEXT = `🆕 SURESHOT PRO TOOL APK 🆕

-Auto Round ID Fetch
-Easy To Use
-Number SureShot
-Big-Small Accurate
-WEB 📱+ APK 🤖

WinGo 30s
WinGo 1Min
WinGo 3Min
WinGo 5Min
--------------------
📎 🔴 https://sureshotpro.sbs
📎 🔴 https://sureshotpro.sbs

🎥 Watch Video On YouTube ⤵️
➡️ https://youtu.be/qQAtpOn-tFw

Join Telegram: https://t.me/modapksh`;

// --- HELPER FUNCTIONS ---

// Helper: Generates a random number between min and max
const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendMessages() {
    try {
        // 1. Read the valid phones from our file
        const data = fs.readFileSync('valid_phones.txt', 'utf8');
        const phoneList = data.split('\n').filter(p => p.trim() !== '');

        console.log(`Starting bulk send to ${phoneList.length} numbers...`);

        for (let i = 0; i < phoneList.length; i++) {
            const number = phoneList[i].trim();
            
            try {
                // 2. Call the Pan Mitra Image API
                // We use encodeURIComponent to ensure emojis and links don't break the URL
                const response = await axios.get('https://wbapi.in/api/send-image', {
                    params: {
                        api_key: API_KEY,
                        number: number,
                        msg: MESSAGE_TEXT,
                        image_url: IMAGE_URL
                    }
                });

                if (response.data.status) {
                    console.log(`[${i + 1}/${phoneList.length}] Success: ${number} | TaskID: ${response.data.taskId}`);
                } else {
                    console.log(`[${i + 1}/${phoneList.length}] Failed for ${number}: ${response.data.message}`);
                }

            } catch (err) {
                // --- FULL ERROR LOGGING ---
                console.error(`\n🔴 Critical Error for number ${number}:`);
                if (err.response) {
                    // The server responded with a status code outside the 2xx range
                    console.error('Data:', err.response.data);
                    console.error('Status:', err.response.status);
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error('No response received from API. Check your internet connection.');
                } else {
                    // Something happened in setting up the request
                    console.error('Error details:', err.message);
                }
                console.error('----------------------------\n');
            }

            // 3. Wait before the next message to prevent spam detection
            if (i < phoneList.length - 1) {
                const waitTime = getRandomDelay(3000, 7000); 
                console.log(`⏳ Waiting ${(waitTime / 1000).toFixed(1)} seconds before next...`);
                await sleep(waitTime);
            }
        }

        console.log('--- ALL TASKS PROCESSED ---');

    } catch (error) {
        console.error('Fatal Error:', error.message);
    }
}

sendMessages();