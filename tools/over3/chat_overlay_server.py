import asyncio
import json
import threading
from pathlib import Path
import websockets
from aiohttp import web
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ChatOverlayServer:
    def __init__(self):
        self.clients = set()
        self.latest_messages = []
        self.loop = None  # ⬅️ будет установлен при старте

        # Значения по умолчанию
        self.chat_width = 370
        self.chat_height = 460
        self.chat_timeout = 60000  # мс
        self.chat_limit = 50

        # Путь к конфигу
        self.config_path = Path(__file__).parent / "config.json"
        self.load_config_from_file()

    def load_config_from_file(self):
        if self.config_path.exists():
            try:
                with open(self.config_path, "r", encoding="utf-8") as f:
                    config = json.load(f)

                    self.chat_width = int(config.get("chat_width", self.chat_width))
                    self.chat_height = int(config.get("chat_height", self.chat_height))
                    self.chat_timeout = int(config.get("chat_timeout", self.chat_timeout))
                    if self.chat_timeout < 1000:
                        self.chat_timeout *= 1000
                    self.chat_limit = int(config.get("chat_limit", self.chat_limit))

                    print("✅ Загружены настройки из config.json:")
                    print(f"  ➤ Ширина: {self.chat_width}")
                    print(f"  ➤ Высота: {self.chat_height}")
                    print(f"  ➤ Таймаут: {self.chat_timeout}")
                    print(f"  ➤ Лимит: {self.chat_limit}")
            except Exception as e:
                print("⚠️ Ошибка при чтении config.json:", e)

    def broadcast_config(self):
        config_data = {
            "config": {
                "width": self.chat_width,
                "height": self.chat_height,
                "timeout": self.chat_timeout,
                "limit": self.chat_limit
            }
        }
        print("📡 Отправляем конфиг клиентам:", config_data)
        config = json.dumps(config_data)
        asyncio.run_coroutine_threadsafe(self._send(config), self.loop)

        if self.loop:
            asyncio.run_coroutine_threadsafe(self._send(config), self.loop)
        else:
            print("⚠️ Не удалось отправить конфиг: event loop не инициализирован")

    async def websocket_handler(self, websocket):
        self.clients.add(websocket)
        try:
            await websocket.send(json.dumps({
                "config": {
                    "width": self.chat_width,
                    "height": self.chat_height,
                    "timeout": self.chat_timeout,
                    "limit": self.chat_limit
                }
            }))
            for msg in self.latest_messages:
                await websocket.send(msg)

            await websocket.wait_closed()
        finally:
            self.clients.remove(websocket)

    async def _send(self, message):
        if self.clients:
            await asyncio.gather(*[client.send(message) for client in self.clients])

    def send(self, sender, html):
        message = json.dumps({'html': html})

        self.latest_messages.append(message)
        if len(self.latest_messages) > 50:
            self.latest_messages.pop(0)

        if self.loop:
            asyncio.run_coroutine_threadsafe(self._send(message), self.loop)
        else:
            print("⚠️ Не удалось отправить сообщение: event loop не инициализирован")

    async def _handle_reload(self, request):
        print("🔄 Получен запрос на перезагрузку overlay")

        if self.loop:
            msg = json.dumps({"action": "reloadOverlay"})
            asyncio.run_coroutine_threadsafe(self._send(msg), self.loop)
        else:
            print("⚠️ Нет event loop — перезагрузка невозможна")

        return web.Response(text="Overlay reloaded")


    def start(self):
        def runner():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            self.loop = loop  # ⬅️ сохраняем главный loop

            async def index(request):
                html_path = Path(__file__).parent / "interface" / "overlay.html"
                print(f"[DEBUG] overlay.html path: {html_path} | Exists: {html_path.exists()}")
                return web.FileResponse(html_path)

            app = web.Application()
            app.router.add_get("/", index)
            app.router.add_post("/reload", self._handle_reload)  # ⬅️ правильно добавлен обработчик

            async def start_all():
                runner = web.AppRunner(app)
                await runner.setup()
                site = web.TCPSite(runner, "localhost", 8888)
                await site.start()

                await websockets.serve(
                    self.websocket_handler,
                    "localhost", 8765
                )

                observer = Observer()
                observer.schedule(ConfigWatcher(self), path=self.config_path.parent, recursive=False)
                observer.start()

                print("✅ Overlay запущен: http://localhost:8888")
                await asyncio.Future()

            loop.run_until_complete(start_all())

        threading.Thread(target=runner, daemon=True).start()


class ConfigWatcher(FileSystemEventHandler):
    def __init__(self, server: ChatOverlayServer):
        self.server = server

    def on_modified(self, event):
        if Path(event.src_path) == self.server.config_path:
            print("📝 config.json изменён — загружаем")
            self.server.load_config_from_file()
            self.server.broadcast_config()
