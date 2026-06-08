import re

from django.core.exceptions import ValidationError


class SenhaForteValidator:
    """Exige senha com mais de 8 caracteres, número, letra maiúscula,
    letra minúscula e caractere especial."""

    def validate(self, password, user=None):
        erros = []
        if len(password) <= 8:
            erros.append("ter mais de 8 caracteres")
        if not re.search(r"\d", password):
            erros.append("conter pelo menos um número")
        if not re.search(r"[A-Z]", password):
            erros.append("conter pelo menos uma letra maiúscula")
        if not re.search(r"[a-z]", password):
            erros.append("conter pelo menos uma letra minúscula")
        if not re.search(r"[^A-Za-z0-9]", password):
            erros.append("conter pelo menos um caractere especial")
        if erros:
            raise ValidationError(
                "A senha deve " + "; ".join(erros) + ".",
                code="senha_fraca",
            )

    def get_help_text(self):
        return (
            "Sua senha deve ter mais de 8 caracteres e conter pelo menos um número, "
            "uma letra maiúscula, uma letra minúscula e um caractere especial."
        )
