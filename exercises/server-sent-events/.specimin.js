module.exports = sse;
sse.start = start;

function sse(res,name,data) {
  res.write('event: ' + name + '\n');
  res.write('data: ' + JSON.stringify(data) + '\n\n');
}

function start(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');
}
