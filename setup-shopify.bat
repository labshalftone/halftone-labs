@echo off
echo ========================================
echo  Shopify Setup - Halftone Labs
echo ========================================
echo.
echo This will open your browser to log in,
echo then push the app config to Shopify.
echo.
cd /d "C:\Users\ronit\fRAMER"
shopify app deploy --client-id 6268e1115314037c2920ec668a099c6b --allow-updates
echo.
pause
