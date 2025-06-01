from administrador import models


NIVEL_CHOICES = [
        ('aprendiz', 'Aprendiz'),
        ('escudeiro', 'Escudeiro'),
        ('cavaleiro', 'Cavaleiro'),
        ('conselheiro', 'Conselheiro'),
        ('guradiao', 'Guardião'),
        ('nao_fraguista', 'Não Fraguista')
    ]

class NivelChoices:
    APPRENTICE = 'aprendiz'
    SQUIRE = 'escudeiro'
    KNIGHT = 'cavaleiro'
    COUNSELOR = 'conselheiro'
    GUARDIAN = 'guardiao'
    NOFRAGUISTA = 'nao_fraguista'
    