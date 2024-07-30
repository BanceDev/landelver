document.addEventListener('alpine:init', () => {
  Alpine.store('socket', {
    hasConnected: false,
    socket: null,
    connect() {
      this.socket = new WebSocket(`ws://${window.location.hostname}:8765`);
      console.log("socket created");
      
      this.socket.addEventListener("open", (event) => {
        console.log("connection established");
        this.hasConnected = true;
      });

      this.socket.addEventListener("message", (event) => {
        this.handleMessage(event.data);
      });

      this.socket.addEventListener("error", (event) => {
        console.error('WebSocket error:', error);
      });

      this.socket.addEventListener("close", (event) => {
        console.log("connection closed");
        this.hasConnected = false;
        this.reconnect();
      });
    },
    reconnect() {
      setTimeout(() => {
        this.connect();
      }, 5000); 
    },
    sendMessage(message) {
      if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(message);
      } else {
          console.error('WebSocket is not open. Ready state is:', this.connection.readyState);
      }
    },
    handleMessage(message) {
      const data = JSON.parse(message);
      if (data.type === 'requestChars') {
        Alpine.store('charHandler').handleCharacterRequest(data);
      }
    },
    init() {
      console.log('store init');
      this.connect();
    }
  });

  Alpine.data('loadingPage', () => ({
    messages: [
      "rolling initiative...",
      "generating dungeons...",
      "brewing potions...",
      "seducing the dragon...",
      "casting fireballs...",
      "entering rage...",
      "perceiving... nothing?",
      "disarming traps...",
      "meeting in tavern...",
      "standing night watch...",
      "viciously mocking...",
      "picking pockets...",
      "speaking with animals...",
      "looting bodies...",
      "attuning magic items...",
      "reading spell scrolls...",
      "looting the bodies..."
    ],
    currentMessageIndex: 0,
    currentMessage: "rolling initiative...",
    startLoad() {
      setInterval(() => {
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
        this.currentMessage = this.messages[this.currentMessageIndex];
      }, 2000);
    },
    init() {
      this.startLoad();
    } 
  }));
  
  Alpine.data('user', () => ({
    hasSelected: false,
    isPlayer: false,
    choosePlayer() {
      this.hasSelected = true;
      this.isPlayer = true;
      console.log('requesting characters');
      const jsonMessage = JSON.stringify({ type: 'requestChars', content: '' });
      this.$store.socket.sendMessage(jsonMessage); 
    },
    chooseDm() {
      this.hasSelected = true;
      this.isPlayer = false;
    }
  }));

  Alpine.data('charMenu', () => ({
    hasSelected: false,
    pickNew: false,
    chooseNew() {
      this.hasSelected = true;
      this.pickNew = true;
    },
    chooseExisting() {
      this.hasSelected = true;
      this.pickNew = false;
    },
  }));

  Alpine.store('charHandler', {
    existingChars: [],
    handleCharacterRequest(data) {
      console.log('recieved character request');
      this.existingChars = data.chars; 
    }
  });

});

