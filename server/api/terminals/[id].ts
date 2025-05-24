import { defineWebSocketHandler } from 'h3';
import { spawn } from 'node-pty';

// Store active terminal processes
const terminals = new Map<string, any>();

export default defineWebSocketHandler({
  open(peer: any) {
    console.log('WebSocket connection attempt received for /api/terminals/[id]');

    // Extract terminal ID from the context
    const terminalId = peer.context.params?.id;
    if (!terminalId) {
      console.log('Closing connection: Missing terminal ID');
      peer.ws.close(1008, 'Missing terminal ID');
      return;
    }

    console.log(`Spawning terminal for ID: ${terminalId}`);

    // Spawn a new terminal process
    const term = spawn(process.platform === 'win32' ? 'powershell.exe' : 'bash', [], {
      name: 'xterm-256color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME || process.env.USERPROFILE,
      env: process.env,
    });

    // Store the terminal process
    terminals.set(terminalId, term);

    // Handle terminal output
    term.onData((data: string) => {
      console.log(`Sending terminal output for ${terminalId}: ${data.slice(0, 50)}...`);
      peer.ws.send(data);
    });

    // Handle terminal exit
    term.onExit(({ exitCode }: { exitCode: number }) => {
      console.log(`Terminal ${terminalId} exited with code ${exitCode}`);
      peer.ws.send(`\r\n[Process exited with code ${exitCode}]\r\n`);
      peer.ws.close();
      terminals.delete(terminalId);
    });

    console.log(`Terminal ${terminalId} connected`);
  },

  async message(peer: any, message: { text: () => string | Promise<string> }) {
    const terminalId = peer.context.params?.id;
    const term = terminals.get(terminalId);
    if (!term) {
      console.log(`No terminal found for ID: ${terminalId}`);
      peer.ws.close(1008, 'No terminal found');
      return;
    }

    try {
      const msgOrPromise = message.text();
      const msg = typeof msgOrPromise === 'string' ? msgOrPromise : await msgOrPromise;
      console.log(`Received message for ${terminalId}: ${msg.slice(0, 50)}...`);
      const parsed = JSON.parse(msg);
      if (parsed.type === 'input') {
        term.write(parsed.data);
      } else if (parsed.type === 'resize') {
        term.resize(parsed.cols, parsed.rows);
        console.log(`Resized terminal ${terminalId} to ${parsed.cols}x${parsed.rows}`);
      }
    } catch (err) {
      console.error(`Invalid message for ${terminalId}:`, err);
    }
  },

  close(peer: any) {
    const terminalId = peer.context.params?.id;
    const term = terminals.get(terminalId);
    if (term) {
      term.kill();
      terminals.delete(terminalId);
      console.log(`Terminal ${terminalId} disconnected`);
    }
  },

  error(peer: any, error: Error) {
    console.error(`WebSocket error for ${peer.context.params?.id}:`, error);
    const terminalId = peer.context.params?.id;
    const term = terminals.get(terminalId);
    if (term) {
      term.kill();
      terminals.delete(terminalId);
    }
  },
});

// Clean up terminals on server shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, cleaning up terminals');
  for (const term of terminals.values()) {
    term.kill();
  }
});