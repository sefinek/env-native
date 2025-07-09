@echo off
node env-native
echo --------------------------------------------
node dotenv\dotenv.js
echo --------------------------------------------
node dotenv\dotenvx.js
exit