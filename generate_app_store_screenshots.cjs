const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateScreenshots() {
  const outputDir = path.join(__dirname, 'app_store_screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching headless browser with iPhone 16 Pro Max viewport (1290x2796)...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Exact 1290x2796 resolution (430x932 @ 3x DPR)
  await page.setViewport({
    width: 430,
    height: 932,
    deviceScaleFactor: 3
  });

  console.log('Navigating to SomnaLux app at http://localhost:4173 ...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 30000 });

  // Allow animations and fonts to render cleanly
  await new Promise(r => setTimeout(r, 2000));

  // 1. Dashboard & SWS Glymphatic Reservoir
  console.log('Capturing Screenshot 1: Polysomnography & SWS Reservoir...');
  const screen1Path = path.join(outputDir, '01_dashboard_reservoir.png');
  await page.screenshot({ path: screen1Path });
  console.log('✓ Saved:', screen1Path);

  // 2. What-If Modeler & Hypnogram (Scroll down dashboard)
  console.log('Capturing Screenshot 2: Interactive What-If Modeler...');
  await page.evaluate(() => {
    window.scrollTo({ top: 750, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  const screen2Path = path.join(outputDir, '02_what_if_modeler.png');
  await page.screenshot({ path: screen2Path });
  console.log('✓ Saved:', screen2Path);

  // 3. Cellular Science Lab Tab
  console.log('Capturing Screenshot 3: 4-Pillar Cellular Science Lab...');
  await page.evaluate(() => {
    // Click on Science tab if available, or navigate to science section
    const buttons = Array.from(document.querySelectorAll('button'));
    const scienceBtn = buttons.find(b => b.textContent && (b.textContent.includes('Science') || b.textContent.includes('Cellular')));
    if (scienceBtn) scienceBtn.click();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  const screen3Path = path.join(outputDir, '03_cellular_science.png');
  await page.screenshot({ path: screen3Path });
  console.log('✓ Saved:', screen3Path);

  // 4. Longevity Prognosis Tab
  console.log('Capturing Screenshot 4: Longevity & Biological Age...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const longevityBtn = buttons.find(b => b.textContent && (b.textContent.includes('Longevity') || b.textContent.includes('Prognosis')));
    if (longevityBtn) longevityBtn.click();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  const screen4Path = path.join(outputDir, '04_longevity_prognosis.png');
  await page.screenshot({ path: screen4Path });
  console.log('✓ Saved:', screen4Path);

  // 5. Audio Synthesizer & Neuromodulation Studio
  console.log('Capturing Screenshot 5: Neuromodulation Studio & Breath Pacer...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const audioBtn = buttons.find(b => b.textContent && (b.textContent.includes('Audio') || b.textContent.includes('Neuromodulation') || b.textContent.includes('Sound')));
    if (audioBtn) audioBtn.click();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  const screen5Path = path.join(outputDir, '05_neuromodulation_audio.png');
  await page.screenshot({ path: screen5Path });
  console.log('✓ Saved:', screen5Path);

  await browser.close();
  console.log('\n🎉 ALL 5 APP STORE SCREENSHOTS GENERATED SUCCESSFULLY AT 1290x2796 PX!');
}

generateScreenshots().catch(err => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});
