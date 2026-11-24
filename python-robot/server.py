import asyncio, json, websockets
import serial
ser = serial.Serial("/dev/ttyACM0", 9600, timeout=1)

async def handler(ws):
    async for msg in ws:
        d = json.loads(msg)
        print(d)
        line = f'{int(d.get("left",0))},{int(d.get("right",0))},{int(d.get("tilt",90))}\n'
        ser.write(line.encode())

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

asyncio.run(main())