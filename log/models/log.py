from datetime import datetime
import os


class Log:
    def _nome_arquivo():
        data = datetime.now().strftime("%Y%m%d%H")
        diretorio = f'logs/{datetime.now().strftime("%Y/%m")}'
        if not os.path.exists(diretorio):
            os.makedirs(diretorio)
        return f"{diretorio}/{data}.log"

    def salva_log(mensagem):
        arquivo = Log._nome_arquivo()
        with open(arquivo, "a", encoding="utf-8") as f:
            f.write(
                f"[{datetime.now().strftime('%Y-%m-%d %H: %M: %S')}] [ERROR] {mensagem}")
