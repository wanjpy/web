import os
from blacksheep.server.dataprotection import generate_secret


AUTH_SECRET_KEY = os.environ.get("AUTH_SECRET_KEY", "jlkfdalkfhadflkfdsha")

