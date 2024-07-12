from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from transformers import BlenderbotTokenizerFast, BlenderbotForConditionalGeneration
import logging

model_name = 'facebook/blenderbot-400M-distill'
tokenizer = BlenderbotTokenizerFast.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

app = FastAPI()

# Mount the static folder, which contains our index.html app
app.mount("/static", StaticFiles(directory="static"), name="static")

# Logging setup
logging.basicConfig(level=logging.INFO)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await websocket.accept()
    logging.info(f"Client {client_id}: Websocket connected")
    try:
        while True:
            text = await websocket.receive_text()
            if text:
                logging.info(f"Client {client_id} said: {text}")
                response = generate_response(text)
                logging.info(f"LLM responded to {client_id}: {response}")
            else:
                response = ""

            await websocket.send_text(response)
    except WebSocketDisconnect:
        logging.info(f"Client {client_id}: WebSocket disconnected")
    except Exception as e:
        logging.error(f"Error {client_id}: {e}")
    finally:
        await websocket.close()
        logging.info(f"Client {client_id}: WebSocket disconnected")


def generate_response(text):
    # Implement LLM logic
    inputs = tokenizer(text, return_tensors="pt")
    result = model.generate(**inputs)
    decoded_result = tokenizer.batch_decode(result, skip_special_tokens=True)[0]
    return decoded_result
