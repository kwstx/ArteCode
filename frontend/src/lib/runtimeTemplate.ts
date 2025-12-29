export const htmlTemplate = (userCode: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>body{margin:0;overflow:hidden;height:100%}canvas{display:block}</style>
  <script src="/p5.min.js"></script>
  <script>
    window.onerror = (msg, url, line, col, error) => {
      window.parent.postMessage({ type: 'ERROR', message: msg, line }, '*');
    };
    function run() {
      try {
        ${userCode}
      } catch(e) {
        window.parent.postMessage({ type: 'ERROR', message: e.message }, '*');
      }
    }
    window.onload = run;
  </script>
</head>
<body>
</body>
</html>
`;
