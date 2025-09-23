export function openBlobInNewTab(blob) {
  if (!blob) return;
  const objectUrl = window.URL.createObjectURL(blob);
  let revoked = false;

  const safeRevoke = () => {
    if (!revoked) {
      try { window.URL.revokeObjectURL(objectUrl); } catch (_) {}
      revoked = true;
    }
  };

  const win = window.open(objectUrl, "_blank", "noopener,noreferrer");

  // If window opened, try to revoke when it's closed
  if (win) {
    const interval = setInterval(() => {
      if (win.closed) {
        clearInterval(interval);
        safeRevoke();
      }
    }, 1000);

    // Best-effort load hook (may not always fire for PDFs)
    try {
      win.addEventListener && win.addEventListener("load", () => {
        // Give renderer a moment, then revoke
        setTimeout(safeRevoke, 2000);
      });
    } catch (_) {
      // ignore cross-context issues
    }
  } else {
    // Popup blocked: still attempt to revoke after a short delay
    setTimeout(safeRevoke, 10000);
  }

  // Absolute safety net: revoke after 2 minutes if not already
  setTimeout(safeRevoke, 120000);
}


