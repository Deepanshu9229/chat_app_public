# Chat App Interview Quick Reference

## 🔥 Must-Know Concepts

### Redux Pattern
```javascript
// Action → Reducer → Store → Component
const action = { type: 'SEND_MESSAGE', payload: message };
const newState = reducer(state, action);
```

### Socket.io vs WebSocket
- **WebSocket**: Native protocol, manual reconnection
- **Socket.io**: Library with fallbacks, rooms, auto-reconnection

### Basic Socket.io Setup
```javascript
// Client
const socket = io('http://localhost:3001');
socket.emit('send-message', data);
socket.on('receive-message', (data) => {});

// Server
io.on('connection', (socket) => {
  socket.on('send-message', (data) => {
    io.emit('receive-message', data); // broadcast
  });
});
```

## 💡 Common Interview Questions & Answers

### Q: "How do you handle real-time updates in React?"
**A:** Use Socket.io with Redux for state management:
```javascript
const useSocket = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on('message', (msg) => dispatch(addMessage(msg)));
  }, []);
};
```

### Q: "How do you prevent memory leaks?"
**A:** Clean up socket listeners in useEffect:
```javascript
useEffect(() => {
  socket.on('event', handler);
  return () => socket.off('event', handler);
}, []);
```

### Q: "How do you handle offline users?"
**A:** Queue messages and sync when online:
```javascript
const [messageQueue, setQueue] = useState([]);
const isOnline = navigator.onLine;

useEffect(() => {
  if (isOnline) {
    messageQueue.forEach(msg => socket.emit('send', msg));
    setQueue([]);
  }
}, [isOnline]);
```

### Q: "How do you optimize performance?"
**A:** 
- Virtual scrolling for long message lists
- Debounced typing indicators
- Message pagination
- React.memo for message components

### Q: "How do you handle authentication?"
**A:** JWT tokens in socket handshake:
```javascript
// Client
const socket = io(url, {
  auth: { token: localStorage.getItem('token') }
});

// Server
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // verify token...
  next();
});
```

## 🛡️ Security Essentials

1. **Sanitize inputs**: Use DOMPurify
2. **Rate limiting**: Prevent spam
3. **Authentication**: JWT tokens
4. **CORS**: Configure properly

## 📱 Mobile Considerations

- PWA with service workers
- Touch-friendly UI
- Auto-resizing text areas
- Push notifications

## 🧪 Testing Strategy

```javascript
// Unit test
test('sends message', () => {
  fireEvent.click(sendButton);
  expect(mockStore.getActions()).toContainEqual({
    type: 'SEND_MESSAGE'
  });
});

// Socket test
test('receives message', (done) => {
  socket.on('message', (msg) => {
    expect(msg.text).toBe('Hello');
    done();
  });
});
```

## 🎯 Key Architecture Points

1. **Unidirectional data flow**: Actions → Reducers → UI
2. **Component separation**: Container/Presentational
3. **Custom hooks**: Reusable socket logic
4. **Error boundaries**: Graceful failure handling
5. **State normalization**: Efficient updates

## 🚀 Performance Tips

- Use `React.memo` for message components
- Implement virtual scrolling for 1000+ messages
- Debounce typing indicators (1000ms)
- Lazy load older messages
- Optimize bundle size with code splitting

Remember: **Explain your reasoning** and discuss **trade-offs** between different approaches!