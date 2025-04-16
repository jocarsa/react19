import asyncio
import websockets
import json
import uuid
import ssl
from datetime import datetime

connected_clients = {}
chat_history = []

def get_time_str():
    now = datetime.now()
    return now.strftime("%I:%M %p")  # e.g., "10:30 AM"

async def register_client(websocket, data):
    client_id = str(uuid.uuid4())
    client_name = data.get("name", f"User-{client_id[:5]}")

    client_info = {
        "id": client_id,
        "name": client_name,
        "websocket": websocket,
        "img": "/api/placeholder/50/50"
    }

    connected_clients[client_id] = client_info

    # Notify all clients about the new user
    await broadcast_user_list()

    # Immediately send the chat history relevant to this new user
    relevant_history = [
        msg for msg in chat_history
        if (
            msg.get("to") == client_id or
            msg.get("from") == client_id or
            msg.get("to") == "GROUP"
        )
    ]
    await websocket.send(
        json.dumps({
            "type": "chat_history",
            "history": relevant_history
        })
    )

    return client_id

async def unregister_client(client_id):
    if client_id in connected_clients:
        del connected_clients[client_id]
        await broadcast_user_list()

async def broadcast_user_list():
    if not connected_clients:
        return

    users_list = []
    for cid, client in connected_clients.items():
        users_list.append({
            "id": cid,
            "name": client["name"],
            "img": client["img"],
            "lastMessage": "",
            "time": get_time_str(),
            "unreadCount": 0,
            "status": "online",
            "messages": []
        })

    # Add a pseudo "GROUP" contact
    users_list.append({
        "id": "GROUP",
        "name": "Group Chat",
        "img": "/api/placeholder/50/50",
        "lastMessage": "",
        "time": get_time_str(),
        "unreadCount": 0,
        "status": "online",
        "messages": []
    })

    message = {
        "type": "user_list",
        "users": users_list
    }

    await asyncio.gather(
        *[
            client["websocket"].send(json.dumps(message))
            for client in connected_clients.values()
        ]
    )

async def handle_message(client_id, data):
    if "to" not in data or "text" not in data:
        return

    recipient_id = data["to"]
    message_text = data["text"]
    time_str = get_time_str()

    message = {
        "type": "chat_message",
        "from": client_id,
        "to": recipient_id,
        "text": message_text,
        "time": time_str,
        "fromName": connected_clients[client_id]["name"]
            if client_id in connected_clients
            else "Unknown"
    }

    chat_history.append(message)
    if len(chat_history) > 100:
        chat_history.pop(0)

    # GROUP message => broadcast to all except the sender
    if recipient_id == "GROUP":
        for cid, info in connected_clients.items():
            if cid != client_id:  # exclude sender to avoid duplication
                try:
                    await info["websocket"].send(json.dumps(message))
                except:
                    pass

        # Sender gets "message_sent"
        if client_id in connected_clients:
            conf_message = message.copy()
            conf_message["type"] = "message_sent"
            await connected_clients[client_id]["websocket"].send(json.dumps(conf_message))
    else:
        # Direct message
        if recipient_id in connected_clients:
            try:
                await connected_clients[recipient_id]["websocket"].send(json.dumps(message))
            except:
                pass

        # Sender gets "message_sent"
        if client_id in connected_clients:
            try:
                conf_message = message.copy()
                conf_message["type"] = "message_sent"
                await connected_clients[client_id]["websocket"].send(json.dumps(conf_message))
            except:
                pass

# Handle profile update (uploading new image)
async def handle_update_profile(client_id, data):
    new_img = data.get("img")
    if not new_img:
        return
    if client_id in connected_clients:
        connected_clients[client_id]["img"] = new_img
        # Broadcast the updated user list so others see new image
        await broadcast_user_list()

async def handle_client(websocket):
    client_id = None
    print("New client connected")

    try:
        async for raw_message in websocket:
            try:
                data = json.loads(raw_message)
                msg_type = data.get("type", "")
                print(f"Received message type: {msg_type}")

                if msg_type == "register":
                    client_id = await register_client(websocket, data)
                    await websocket.send(
                        json.dumps({
                            "type": "registered",
                            "id": client_id,
                            "name": connected_clients[client_id]["name"]
                        })
                    )
                    print(f"Client registered: {connected_clients[client_id]['name']}")

                elif msg_type == "chat_message" and client_id:
                    await handle_message(client_id, data)
                    print(f"Message processed from {connected_clients[client_id]['name']}")

                elif msg_type == "get_history" and client_id:
                    relevant_history = [
                        msg for msg in chat_history
                        if (msg.get("from") == client_id
                            or msg.get("to") == client_id
                            or msg.get("to") == "GROUP")
                    ]
                    await websocket.send(
                        json.dumps({
                            "type": "chat_history",
                            "history": relevant_history
                        })
                    )

                elif msg_type == "update_profile" and client_id:
                    await handle_update_profile(client_id, data)

            except json.JSONDecodeError:
                print("Invalid JSON received")

    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")
    finally:
        if client_id and client_id in connected_clients:
            print(f"Client disconnected: {connected_clients[client_id]['name']}")
            await unregister_client(client_id)

async def main():
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(
        certfile="/etc/apache2/ssl/jocarsa_combined.cer",
        keyfile="/etc/apache2/ssl/jocarsa.key"
    )

    try:
        print("Starting secure WebSocket server on wss://jocarsa.com:3000...")
        async with websockets.serve(
            handle_client,
            host="0.0.0.0",
            port=3000,
            ssl=ssl_context
        ):
            print("Secure WebSocket server started on wss://jocarsa.com:3000")
            await asyncio.Future()
    except Exception as e:
        print(f"Server error: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server shutdown")
