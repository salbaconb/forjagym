const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const SMOKE = process.argv.includes('--smoke-test');

// Evita ventanas que no aparecen por fallos de la tarjeta gráfica o sus controladores.
app.disableHardwareAcceleration();

let win = null;

function logError(err) {
  const text = '[' + new Date().toISOString() + '] ' + (err && err.stack ? err.stack : String(err)) + '\n';
  try {
    fs.appendFileSync(path.join(app.getPath('userData'), 'forja-error.log'), text);
  } catch (e) { /* sin registro, no pasa nada */ }
  if (SMOKE) console.error(text);
}

process.on('uncaughtException', (err) => {
  logError(err);
  if (!SMOKE) dialog.showErrorBox('Forja', 'Ha ocurrido un error:\n\n' + (err && err.message ? err.message : err));
});

function createWindow() {
  win = new BrowserWindow({
    width: 480,
    height: 880,
    minWidth: 360,
    minHeight: 560,
    title: 'Forja',
    show: false,
    backgroundColor: '#1B2029',
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // Se muestra cuando está lista; si algo la retrasa, se muestra igualmente a los 3 segundos.
  win.once('ready-to-show', () => win && win.show());
  setTimeout(() => { if (win && !win.isVisible()) win.show(); }, 3000);

  win.webContents.on('render-process-gone', (e, details) => {
    logError('El proceso de la ventana se cerró: ' + details.reason);
    if (!SMOKE) dialog.showErrorBox('Forja', 'La ventana se cerró de forma inesperada (' + details.reason + ').');
  });
  win.webContents.on('did-fail-load', (e, code, desc) => {
    logError('No se pudo cargar la interfaz: ' + desc + ' (' + code + ')');
    if (SMOKE) app.exit(1);
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Los enlaces externos se abren en el navegador, no dentro de la app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) {
      e.preventDefault();
      if (/^https?:/.test(url)) shell.openExternal(url);
    }
  });

  win.on('closed', () => { win = null; });

  if (SMOKE) runSmokeTest(win);
}

// Prueba de arranque (la usa GitHub Actions): comprueba que la interfaz carga y se pinta.
function runSmokeTest(w) {
  const errors = [];
  w.webContents.on('console-message', (e, level, message) => { if (level >= 3) errors.push(message); });
  const fail = (why) => { console.error('SMOKE FAIL: ' + why + (errors.length ? ' | ' + errors.join(' | ') : '')); app.exit(1); };
  setTimeout(() => fail('tiempo agotado'), 45000);
  w.webContents.on('did-finish-load', () => {
    setTimeout(async () => {
      try {
        const r = await w.webContents.executeJavaScript(
          '({app: !!document.querySelector(".app"), text: document.body.innerText.length, title: document.title})'
        );
        if (!r.app || r.text < 20) return fail('interfaz vacía ' + JSON.stringify(r));
        if (errors.length) return fail('errores en consola');
        console.log('SMOKE OK ' + JSON.stringify(r));
        app.exit(0);
      } catch (err) { fail(String(err)); }
    }, 2000);
  });
}

app.whenReady().then(() => {
  try {
    createWindow();
  } catch (err) {
    logError(err);
    dialog.showErrorBox('Forja', 'No se pudo abrir la ventana:\n\n' + err.message);
    app.quit();
  }
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => app.quit());
